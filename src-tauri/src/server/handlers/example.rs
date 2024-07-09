use actix_web::{post};
use actix_web::web::Data;
use tauri::Manager;
use crate::server::TauriAppState;

#[post("/api/test")]
pub async fn handle(data: Data<TauriAppState>) -> actix_web::Result<String> {
    let app = data.app.lock().unwrap();
    app.emit_all("test", "test").unwrap();

    let text = "hello world";
    println!("{}",text);

    Ok(text.to_string())
}