use actix_web::{get, HttpRequest, HttpResponse};
use actix_web::web::{Query};
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Params {
    url: String
}

#[get("/api/img_cors")]
pub async fn img_cors(req: HttpRequest) -> HttpResponse {
    let params = Query::<Params>::from_query(req.query_string()).unwrap();
    let url = &params.url;
    
    let client = reqwest::Client::new();
    let res = client
        .get(url)
        .send()
        .await;

    match res {
        Ok(v) => {
            let headers = v.headers().clone();
            let bytes = v.bytes().await.unwrap();
            HttpResponse::Ok()
                .content_type(headers.get("content-type").unwrap().to_str().unwrap())
                .body(bytes)
        },
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}