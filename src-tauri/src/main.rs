// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod server;

use showfile;
use std::{env, thread};
use clap::Parser;
use serde::{Deserialize, Serialize};
use server::init;

#[derive(clap::Parser, Debug, Deserialize, Serialize)]
#[command(version, about, long_about = None)]
struct Args {
    /// http server address
    #[arg(long, default_value_t = String::from("127.0.0.1"), value_name = "ADDR", help = "HTTP 服务地址")]
    http_addr: String,

    /// http server port
    #[arg(long, default_value_t = 56789, value_name = "PORT", help = "HTTP 服务端口")]
    http_port: u16,
}

fn run_http_server(boxed_handle: Box<tauri::AppHandle>, options: crate::server::ServerOptions) {
    thread::spawn(move || {
        init(*boxed_handle, options).unwrap();
    });
}

fn main() {
    let args = Args::parse();

    tauri::Builder::default()
        .setup(move |app| {
            let handle = app.handle();
            let boxed_handle = Box::new(handle);
            run_http_server(boxed_handle, crate::server::ServerOptions {
                http_addr: args.http_addr,
                http_port: args.http_port,
            });

            Ok(())
        })
        // .on_window_event(|event| {
        //     match event.event() {
        //         tauri::WindowEvent::Destroyed => {
        //             println!("Window destroyed")
        //         }
        //         _ => {}
        //     }
        // })
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
