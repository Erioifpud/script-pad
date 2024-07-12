mod handlers;

use std::sync::Mutex;
use actix_web::{HttpServer, App, web, middleware};
use tauri::AppHandle;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

pub struct ServerOptions {
    pub http_addr: String,
    pub http_port: u16,
}

#[actix_web::main]
pub async fn init(app: AppHandle, options: ServerOptions) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app)
    });

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(handlers::remote::handle)
    })
        .bind((options.http_addr, options.http_port))?
        .run()
        .await
}