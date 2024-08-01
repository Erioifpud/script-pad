use serde::{Deserialize, Serialize};

pub mod remote;
pub mod upload_image;

#[derive(Deserialize, Serialize, Clone)]
pub struct ResponseWrapper<T> {
    success: bool,
    message: String,
    data: T
}