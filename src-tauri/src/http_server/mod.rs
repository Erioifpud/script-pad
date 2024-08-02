mod handlers;

use std::sync::Mutex;
use actix_web::{HttpServer, App, web, middleware};
use tauri::AppHandle;
use ttl_cache::TtlCache;

struct TauriAppState {
    app: Mutex<AppHandle>,
}

struct ImageCacheValue {
    mime_type: String,
    data: Vec<u8>,
}

struct ImageCacheState {
    cache: Mutex<TtlCache<String, ImageCacheValue>>
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

    let image_cache = web::Data::new(ImageCacheState {
        cache: Mutex::new(TtlCache::new(10)),
    });

    HttpServer::new(move || {
        App::new()
            .app_data(tauri_app.clone())
            .app_data(image_cache.clone())
            .wrap(middleware::Logger::default())
            .service(handlers::remote::handle)
            .service(handlers::upload_image::save)
            .service(handlers::upload_image::get)
    })
        .bind((options.http_addr, options.http_port))?
        .run()
        .await
}