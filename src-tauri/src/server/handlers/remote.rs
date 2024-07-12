use std::sync::{Arc, Mutex};
use actix_web::{post};
use actix_web::web::{Data, Json};
use tauri::Manager;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::server::TauriAppState;

// 请求体数据
#[derive(Deserialize, Serialize, Clone)]
struct RunInfo {
    id: String,
    data: serde_json::Value,
}

// 任务数据，用户请求体 + 每次执行都会重新创建的任务 id
#[derive(Deserialize, Serialize, Clone)]
#[serde(rename_all(serialize = "camelCase"))]
struct Task {
    task_id: String,
    #[serde(flatten)]
    run_info: RunInfo
}

impl Task {
    fn create_by(run_info: RunInfo) -> Self {
        Task {
            task_id: Uuid::new_v4().to_string(),
            run_info: run_info.clone()
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all(deserialize = "camelCase"))]
pub struct CallbackData {
    task_id: String,
    data: serde_json::Value,
}

type CallbackHolder<T> = Arc<Mutex<Option<T>>>;

#[post("/api/run")]
pub async fn handle(data: Data<TauriAppState>, info: Json<RunInfo>) -> std::io::Result<Json<CallbackData>> {
    // 1. 获取请求体数据
    // 2. 通过 Tauri 事件将数据发送给前端，前端找到脚本执行
    // 3. 前端将执行结果通过 Tauri 事件将数据发送回来
    // 4. 由于事件监听只能在闭包回调里拿到数据，所以需要通过 Arc<Mutex<Option<T>>> 传递
    // 5. 在拿到返回数据前会阻塞（这里必定能拿到，前端无论如何都会触发 remote/http-response 事件），将数据通过接口返回
    let app = data.app.lock().unwrap();
    let body = info.into_inner();
    let holder: CallbackHolder<CallbackData> = Arc::new(Mutex::new(None));

    app.emit_all("remote/http-request", Task::create_by(body)).unwrap();

    let clone_holder = holder.clone();

    app.once_global("remote/http-response", move |event| {
        let json_str = event.payload().unwrap();
        let callback_data: CallbackData = serde_json::from_str(json_str).unwrap();

        clone_holder.lock().unwrap().replace(callback_data);
    });

    loop {
        let holder = holder.lock().unwrap();
        if holder.is_some() {
            break;
        }
    }

    let holder_data = holder.lock().unwrap().take().unwrap();

    Ok(Json(holder_data))
}