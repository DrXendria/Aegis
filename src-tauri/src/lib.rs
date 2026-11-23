use tauri::Manager;

#[tauri::command]
fn save_encrypted_backup(
    app: tauri::AppHandle,
    filename: String,
    content: String,
) -> Result<String, String> {
    let safe_name = std::path::Path::new(&filename)
        .file_name()
        .and_then(|n| n.to_str())
        .ok_or_else(|| "Invalid backup filename".to_string())?;

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
        .invoke_handler(tauri::generate_handler![save_encrypted_backup])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
