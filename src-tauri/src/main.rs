// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod server;

use showfile;
use std::thread;
use server::init;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let boxed_handle = Box::new(handle);

            thread::spawn(move || {
                init(*boxed_handle).unwrap()
            });
            Ok(())
        })
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
