mod handlers;

use std::sync::Mutex;
use actix_web::{HttpServer, App, web, middleware};
use tauri::AppHandle;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

#[actix_web::main]
pub async fn init(app: AppHandle) -> std::io::Result<()> {
    let tauri_app = web::Data::new(TauriAppState {
        app: Mutex::new(app)
    });

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .wrap(middleware::Logger::default())
            .service(handlers::remote::handle)
    })
        .bind(("127.0.0.1", 56789))?
        .run()
        .await
}