use serde::{Deserialize, Serialize};
use std::collections::hash_map::RandomState;
use std::hash::{BuildHasher, Hasher};
use std::io::{Read, Write};
use std::net::{TcpListener, TcpStream};
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter, Manager};

pub const BRIDGE_PORT: u16 = 41937;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BridgeEntry {
    pub id: String,
    pub title: String,
    pub username: String,
    pub password: String,
    pub category: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BridgeCard {
    pub id: String,
    pub title: String,
    pub number: String,
    pub expiry: String,
    pub cvv: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SaveCredentialPayload {
    pub title: String,
    pub username: String,
    pub password: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SaveCardPayload {
    pub title: String,
    pub number: String,
    pub expiry: String,
    pub cvv: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct SaveSubscriptionPayload {
    pub title: String,
    pub cost: String,
    pub currency: String,
    pub renewal_date: Option<String>,
    pub payment_method: Option<String>,
}

#[derive(Clone, Debug, Serialize)]
pub struct BridgeInfo {
    pub port: u16,
    pub token: String,
}

pub struct BridgeState {
    pub token: String,
    pub unlocked: bool,
    pub entries: Vec<BridgeEntry>,
    pub cards: Vec<BridgeCard>,
}

pub type SharedBridgeState = Arc<Mutex<BridgeState>>;

fn generate_token() -> String {
    let mut out = String::with_capacity(32);
    for _ in 0..4 {
        let s = RandomState::new();
        let mut h = s.build_hasher();
        h.write_u64(
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .map(|d| d.as_nanos() as u64)
                .unwrap_or(0),
        );
        out.push_str(&format!("{:08x}", (h.finish() & 0xffff_ffff) as u32));
    }
    out
}

pub fn load_or_create_token(app: &AppHandle) -> String {
    if let Ok(data_dir) = app.path().app_data_dir() {
        let _ = std::fs::create_dir_all(&data_dir);
        let token_path = data_dir.join("bridge_token");
        if let Ok(existing) = std::fs::read_to_string(&token_path) {
            let trimmed = existing.trim().to_string();
            if trimmed.len() >= 16 {
                return trimmed;
            }
        }
        let fresh = generate_token();
        let _ = std::fs::write(&token_path, &fresh);
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let _ = std::fs::set_permissions(&token_path, std::fs::Permissions::from_mode(0o600));
        }
        return fresh;
    }
    generate_token()
}

pub fn start_bridge_server(app: AppHandle, state: SharedBridgeState) {
    thread::spawn(move || {
        let addr = format!("127.0.0.1:{}", BRIDGE_PORT);
        let listener = match TcpListener::bind(&addr) {
            Ok(l) => l,
            Err(e) => {
                eprintln!("[Aegis Bridge] Could not bind {}: {}", addr, e);
                return;
            }
        };

        for stream in listener.incoming().flatten() {
            let st = Arc::clone(&state);
            let app_clone = app.clone();
            thread::spawn(move || {
                handle_client(stream, st, app_clone);
            });
        }
    });
}

fn is_allowed_origin(origin: &str) -> bool {
    origin.starts_with("chrome-extension://") || origin.starts_with("moz-extension://")
}

fn url_decode(input: &str) -> String {
    let bytes = input.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' && i + 2 < bytes.len() {
            if let Ok(hex) = std::str::from_utf8(&bytes[i + 1..i + 3]) {
                if let Ok(val) = u8::from_str_radix(hex, 16) {
                    out.push(val);
                    i += 3;
                    continue;
                }
            }
        } else if bytes[i] == b'+' {
            out.push(b' ');
            i += 1;
            continue;
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).to_string()
}

fn extract_query_param(target: &str, key: &str) -> String {
    let Some((_, query)) = target.split_once('?') else {
        return String::new();
    };
    for pair in query.split('&') {
        if let Some((k, v)) = pair.split_once('=') {
            if k == key {
                return url_decode(v);
            }
        }
    }
    String::new()
}

fn domain_matches(entry_title: &str, host: &str) -> bool {
    let host_clean = host.trim().to_lowercase();
    let host_clean = host_clean.strip_prefix("www.").unwrap_or(&host_clean);
    if host_clean.is_empty() {
        return false;
    }

    let title_lower = entry_title.to_lowercase();
    if title_lower.contains(host_clean) || (host_clean.contains(&title_lower) && title_lower.len() >= 3)
    {
        return true;
    }

    let parts: Vec<&str> = host_clean.split('.').collect();
    if parts.len() >= 2 {
        let stem = parts[parts.len() - 2];
        if stem.len() >= 3 && title_lower.contains(stem) {
            return true;
        }
    }
    false
}

fn write_json(stream: &mut TcpStream, status: &str, origin: Option<&str>, body: &str) {
    let cors_header = match origin {
        Some(o) if is_allowed_origin(o) => format!(
            "Access-Control-Allow-Origin: {}\r\nAccess-Control-Allow-Headers: Content-Type, X-Aegis-Token\r\nAccess-Control-Allow-Methods: GET, POST, OPTIONS\r\nVary: Origin\r\n",
            o
        ),
        _ => String::new(),
    };
    let response = format!(
        "HTTP/1.1 {}\r\nContent-Type: application/json; charset=utf-8\r\nContent-Length: {}\r\n{}Connection: close\r\n\r\n{}",
        status,
        body.len(),
        cors_header,
        body
    );
    let _ = stream.write_all(response.as_bytes());
    let _ = stream.flush();
}

fn read_http_request(stream: &mut TcpStream) -> Option<String> {
    let _ = stream.set_read_timeout(Some(std::time::Duration::from_secs(2)));
    let mut raw = Vec::with_capacity(4096);
    let mut chunk = [0u8; 4096];
    let mut header_end: Option<usize> = None;
    let mut content_length: usize = 0;

    loop {
        match stream.read(&mut chunk) {
            Ok(0) => break,
            Ok(n) => {
                raw.extend_from_slice(&chunk[..n]);
                if raw.len() > 65536 {
                    break;
                }
                if header_end.is_none() {
                    if let Some(pos) = raw.windows(4).position(|w| w == b"\r\n\r\n") {
                        let end = pos + 4;
                        header_end = Some(end);
                        let header_str = String::from_utf8_lossy(&raw[..pos]);
                        for line in header_str.lines().skip(1) {
                            if let Some((k, v)) = line.split_once(':') {
                                if k.trim().eq_ignore_ascii_case("content-length") {
                                    content_length = v.trim().parse::<usize>().unwrap_or(0);
                                }
                            }
                        }
                    }
                }
                if let Some(end) = header_end {
                    if raw.len() >= end + content_length {
                        break;
                    }
                }
            }
            Err(_) => break,
        }
    }

    if raw.is_empty() {
        return None;
    }
    Some(String::from_utf8_lossy(&raw).to_string())
}

fn handle_client(mut stream: TcpStream, state: SharedBridgeState, app: AppHandle) {
    let Some(req_str) = read_http_request(&mut stream) else {
        return;
    };
    let (header_part, body_part) = match req_str.split_once("\r\n\r\n") {
        Some((h, b)) => (h, b),
        None => (req_str.as_ref(), ""),
    };

    let mut lines = header_part.lines();
    let Some(request_line) = lines.next() else {
        return;
    };
    let mut req_parts = request_line.split_whitespace();
    let method = req_parts.next().unwrap_or("");
    let target = req_parts.next().unwrap_or("/");
    let path = target.split('?').next().unwrap_or("/");

    let mut origin: Option<String> = None;
    let mut provided_token: Option<String> = None;
    for line in lines {
        if let Some((k, v)) = line.split_once(':') {
            let key = k.trim().to_ascii_lowercase();
            let val = v.trim();
            if key == "origin" {
                origin = Some(val.to_string());
            } else if key == "x-aegis-token" {
                provided_token = Some(val.to_string());
            }
        }
    }

    if let Some(ref o) = origin {
        if !is_allowed_origin(o) {
            write_json(&mut stream, "403 Forbidden", None, r#"{"error":"Origin not allowed"}"#);
            return;
        }
    }

    if method == "OPTIONS" {
        write_json(&mut stream, "204 No Content", origin.as_deref(), "");
        return;
    }

    if method == "GET" && path == "/health" {
        let unlocked = state.lock().map(|s| s.unlocked).unwrap_or(false);
        let body = serde_json::json!({
            "ok": true,
            "unlocked": unlocked,
            "version": env!("CARGO_PKG_VERSION")
        })
        .to_string();
        write_json(&mut stream, "200 OK", origin.as_deref(), &body);
        return;
    }

    let Ok(guard) = state.lock() else {
        write_json(&mut stream, "500 Internal Server Error", origin.as_deref(), r#"{"error":"Lock error"}"#);
        return;
    };

    if provided_token.as_deref() != Some(guard.token.as_str()) {
        write_json(&mut stream, "401 Unauthorized", origin.as_deref(), r#"{"error":"Invalid pairing token"}"#);
        return;
    }

    if !guard.unlocked {
        write_json(&mut stream, "423 Locked", origin.as_deref(), r#"{"error":"Vault is locked"}"#);
        return;
    }

    match (method, path) {
        ("GET", "/match") => {
            let host = extract_query_param(target, "host");
            let matches: Vec<&BridgeEntry> = guard
                .entries
                .iter()
                .filter(|e| domain_matches(&e.title, &host))
                .collect();
            let body = serde_json::json!({
                "ok": true,
                "host": host,
                "total": guard.entries.len(),
                "entries": matches
            })
            .to_string();
            write_json(&mut stream, "200 OK", origin.as_deref(), &body);
        }
        ("GET", "/search") => {
            let q = extract_query_param(target, "q").to_lowercase();
            let matches: Vec<&BridgeEntry> = guard
                .entries
                .iter()
                .filter(|e| {
                    q.is_empty()
                        || e.title.to_lowercase().contains(&q)
                        || e.username.to_lowercase().contains(&q)
                })
                .take(25)
                .collect();
            let body = serde_json::json!({
                "ok": true,
                "entries": matches
            })
            .to_string();
            write_json(&mut stream, "200 OK", origin.as_deref(), &body);
        }
        ("GET", "/cards") => {
            let body = serde_json::json!({
                "ok": true,
                "cards": guard.cards
            })
            .to_string();
            write_json(&mut stream, "200 OK", origin.as_deref(), &body);
        }
        ("POST", "/save") => {
            drop(guard);
            match serde_json::from_str::<SaveCredentialPayload>(body_part.trim()) {
                Ok(payload) if !payload.title.trim().is_empty() && !payload.password.is_empty() => {
                    let _ = app.emit("bridge-save-credential", payload);
                    write_json(&mut stream, "200 OK", origin.as_deref(), r#"{"ok":true}"#);
                }
                _ => {
                    write_json(&mut stream, "400 Bad Request", origin.as_deref(), r#"{"error":"Invalid credential payload"}"#);
                }
            }
        }
        ("POST", "/save-card") => {
            drop(guard);
            match serde_json::from_str::<SaveCardPayload>(body_part.trim()) {
                Ok(payload) if !payload.number.trim().is_empty() => {
                    let _ = app.emit("bridge-save-card", payload);
                    write_json(&mut stream, "200 OK", origin.as_deref(), r#"{"ok":true}"#);
                }
                _ => {
                    write_json(&mut stream, "400 Bad Request", origin.as_deref(), r#"{"error":"Invalid card payload"}"#);
                }
            }
        }
        ("POST", "/save-subscription") => {
            drop(guard);
            match serde_json::from_str::<SaveSubscriptionPayload>(body_part.trim()) {
                Ok(payload) if !payload.title.trim().is_empty() && !payload.cost.trim().is_empty() => {
                    let _ = app.emit("bridge-save-subscription", payload);
                    write_json(&mut stream, "200 OK", origin.as_deref(), r#"{"ok":true}"#);
                }
                _ => {
                    write_json(&mut stream, "400 Bad Request", origin.as_deref(), r#"{"error":"Invalid subscription payload"}"#);
                }
            }
        }
        _ => {
            write_json(&mut stream, "404 Not Found", origin.as_deref(), r#"{"error":"Not found"}"#);
        }
    }
}
