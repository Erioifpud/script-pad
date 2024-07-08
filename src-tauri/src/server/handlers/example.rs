use actix_web::{post};

#[post("/api/test")]
pub async fn handle() -> actix_web::Result<String> {
    let text = "hello world";
    println!("{}",text);

    Ok(text.to_string())
}