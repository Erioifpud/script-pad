use tauri::{AppHandle, command, generate_handler, Manager, WindowBuilder, Wry};
use tauri::utils::config::WindowConfig;
use tauri::plugin::{Builder, TauriPlugin};

#[command]
pub fn close_window(app_handle: AppHandle, label: String) {
    if let Some(window) = app_handle.get_window(&label) {
        window.close().unwrap();
    }
}

#[command]
pub async fn create_window(app_handle: AppHandle, options: WindowConfig, reusable: bool) {
    let window = app_handle.get_window(&options.label);
    if let Some(win) = window {
        if reusable {
            win.show().unwrap();
            win.set_focus().unwrap();
            return;
        } else {
            win.close().unwrap();
        }
    }
    WindowBuilder::from_config(&app_handle, options.clone())
        .build()
        .unwrap();
}

pub fn init() -> TauriPlugin<Wry> {
    Builder::new("window")
        .invoke_handler(generate_handler![
            create_window,
            close_window,
        ])
        .build()
}