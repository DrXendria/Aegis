use tauri::Manager;

fn sanitize_filename(filename: &str) -> Result<String, String> {
    std::path::Path::new(filename)
        .file_name()
        .and_then(|n| n.to_str())
        .map(|s| s.to_string())
        .ok_or_else(|| "Invalid filename".to_string())
}

#[tauri::command]
fn read_local_file(app: tauri::AppHandle, filename: String) -> Result<Option<String>, String> {
    let safe_name = sanitize_filename(&filename)?;
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    let file_path = data_dir.join(&safe_name);

    match std::fs::read_to_string(&file_path) {
        Ok(content) => Ok(Some(content)),
        Err(e) if e.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
fn write_local_file(
    app: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<String, String> {
    let safe_name = sanitize_filename(&filename)?;
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;

    let target_path = data_dir.join(&safe_name);
    let tmp_path = data_dir.join(format!("{}.tmp", safe_name));
    let bak_path = data_dir.join(format!("{}.bak", safe_name));

    // Preserve previous healthy version as .bak before replacing
    if target_path.exists() {
        let _ = std::fs::copy(&target_path, &bak_path);
    }

    // Atomic write: write to .tmp then rename over target
    std::fs::write(&tmp_path, content).map_err(|e| e.to_string())?;
    std::fs::rename(&tmp_path, &target_path).map_err(|e| e.to_string())?;

    Ok(target_path.to_string_lossy().to_string())
}

#[tauri::command]
fn get_vault_data_dir(app: tauri::AppHandle) -> Result<String, String> {
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    Ok(data_dir.to_string_lossy().to_string())
}

#[tauri::command]
fn save_encrypted_backup(
    app: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<String, String> {
    let safe_name = sanitize_filename(&filename)?;

    let base_dir = app
        .path()
        .document_dir()
        .or_else(|_| app.path().app_data_dir())
        .map_err(|e| e.to_string())?;

    let backup_dir = base_dir.join("Aegis-Backups");
    std::fs::create_dir_all(&backup_dir).map_err(|e| e.to_string())?;

    let file_path = backup_dir.join(safe_name);
    std::fs::write(&file_path, content).map_err(|e| e.to_string())?;

    Ok(file_path.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(any(target_os = "android", target_os = "ios"))]
    {
        builder = builder.plugin(tauri_plugin_biometric::init());
        builder = builder.plugin(tauri_plugin_haptics::init());
    }

    builder
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![
            read_local_file,
            write_local_file,
            get_vault_data_dir,
            save_encrypted_backup
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
