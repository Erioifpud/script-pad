// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use showfile;

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_clipboard::init())
    .invoke_handler(tauri::generate_handler![open_devtools, open_directory])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn open_devtools(window: tauri::Window) {
  window.open_devtools();
}

#[tauri::command]
fn open_directory(path: String) {
  showfile::show_path_in_file_manager(path);
}