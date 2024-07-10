use actix_web::{post};
use actix_web::web::{Data, Json};
use tauri::Manager;
use bytes::BytesMut;
use serde::{Deserialize, Serialize};
use crate::server::TauriAppState;

#[derive(Deserialize, Serialize)]
struct RunInfo {
    id: String,
}

impl Clone for RunInfo {
    fn clone(&self) -> Self {
        RunInfo {
            id: self.id.clone(),
        }
    }
}

#[post("/api/run")]
pub async fn handle(data: Data<TauriAppState>, info: Json<RunInfo>) -> actix_web::Result<String> {
    let app = data.app.lock().unwrap();
    app.emit_all("test", info.into_inner()).unwrap();

    let text = "hello world";
    println!("{}",text);

    Ok(text.to_string())
}