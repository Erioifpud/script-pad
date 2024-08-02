use std::sync::Mutex;
use std::thread;
use tauri::plugin::{Builder, TauriPlugin};
use tauri::{generate_handler, Manager, Wry};
use crate::{Args};
use crate::http_server::{init as init_http_server};

#[tauri::command]
fn get_server_info(args: tauri::State<Mutex<Args>>) -> Args {
    args.lock().unwrap().clone()
}

fn run_http_server(boxed_handle: Box<tauri::AppHandle>, options: crate::http_server::ServerOptions) {
    thread::spawn(move || {
        init_http_server(*boxed_handle, options).unwrap();
    });
}

pub fn init() -> TauriPlugin<Wry> {
    Builder::new("http_server")
        .setup(move |app| {
            let handle = app.app_handle();
            let state_args = handle.state::<Mutex<Args>>();
            let args = state_args.lock().unwrap().clone();
            let boxed_handle = Box::new(handle);
            run_http_server(boxed_handle, crate::http_server::ServerOptions {
                http_addr: args.http_addr,
                http_port: args.http_port,
            });

            Ok(())
        })
        .invoke_handler(generate_handler![get_server_info])
        .build()
}