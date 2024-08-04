// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod plugins;
mod http_server;

use std::{env};
use std::sync::Mutex;
use clap::Parser;
use serde::{Deserialize, Serialize};
use plugins::{ server, window };

#[derive(clap::Parser, Debug, Deserialize, Serialize, Clone)]
#[command(version, about, long_about = None)]
pub struct Args {
    /// http http_server address
    #[arg(long, default_value_t = String::from("127.0.0.1"), value_name = "ADDR", help = "HTTP 服务地址")]
    http_addr: String,

    /// http http_server port
    #[arg(long, default_value_t = 56789, value_name = "PORT", help = "HTTP 服务端口")]
    http_port: u16,
}

fn main() {
    let args = Args::parse();

    tauri::Builder::default()
        .manage(Mutex::new(args.clone()))
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_clipboard::init())
        .plugin(server::init())
        .plugin(window::init())
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
