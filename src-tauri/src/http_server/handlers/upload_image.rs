use actix_web::web::{Data, Json, Path};
use serde::{Deserialize, Serialize};
use base64::{Engine as _, engine::{general_purpose}};
use crate::http_server::handlers::ResponseWrapper;
use std::time::Duration;
use actix_web::{get, HttpResponse, post};
use actix_web::http::StatusCode;
use crate::http_server::{ImageCacheState, ImageCacheValue};
use uuid::Uuid;

#[derive(Deserialize, Serialize, Clone, Debug)]
struct ImageInfo {
    base64: String,
    mime_type: String,
}

#[post("/api/upload_image")]
pub async fn save(data: Data<ImageCacheState>, info: Json<ImageInfo>) -> Json<ResponseWrapper<String>> {
    let body = info.into_inner();

    let key = Uuid::new_v4().to_string();
    let mime_type = if body.mime_type.is_empty() {
        "image/png".to_string()
    } else {
        body.mime_type
    };

    let image_base64 = if body.base64.starts_with("data:") {
        let parts: Vec<&str> = body.base64.split(',').collect();
        parts[1].to_string()
    } else {
        body.base64
    };

    if image_base64.is_empty() {
        return Json(ResponseWrapper {
            success: false,
            message: "base64 is empty".to_string(),
            data: String::new(),
        })
    }

    let image_data = general_purpose::STANDARD.decode(image_base64).unwrap();

    let mut cache = data.cache.lock().unwrap();
    cache.insert(key.clone(), ImageCacheValue {
        mime_type,
        data: image_data,
    }, Duration::from_secs(300));

    Json(ResponseWrapper {
        success: true,
        message: String::new(),
        data: key.clone(),
    })
}

#[get("/api/get_image/{id}")]
pub async fn get(data: Data<ImageCacheState>, path: Path<String>) -> HttpResponse {
    let id = path.into_inner();
    let cache = data.cache.lock().unwrap();
    if let Some(value) = cache.get(&id) {
        return HttpResponse::build(StatusCode::OK)
            .content_type(value.mime_type.clone())
            .body(value.data.clone());
    }
    HttpResponse::build(StatusCode::NOT_FOUND)
        .content_type("text/plain")
        .body("Not Found")
}