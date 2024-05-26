// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use boa_engine::{Context, Source};

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_store::Builder::default().build())
    .invoke_handler(tauri::generate_handler![execute_script])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
fn execute_script(code: String) {
  // 创建一个新的上下文
  let mut context = Context::default();

  let utf16: Vec<u16> = code.encode_utf16().collect();
  // 在上下文中执行 JavaScript 代码
  match context.eval(Source::from_utf16(&utf16)) {
    Ok(res) => {
      println!(
        "{}",
        res.to_string(&mut context).unwrap().to_std_string_escaped()
      );
    }
    Err(e) => {
      // Pretty print the error
      eprintln!("Uncaught {e}");
    }
  };
}