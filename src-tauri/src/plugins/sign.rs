use sha256::digest;
use tauri::plugin::TauriPlugin;
use tauri::{command, Wry};

#[command]
pub fn sign_template(template: String) -> String {
    let salt = "%MqqoBWfv$f$VhDGxunfE^p*WcBq4Lah&M5*Xe6V#y4uuDRV653r$t#geX*^kKG$";
    digest(template + salt)
}

pub fn init() -> TauriPlugin<Wry> {
    tauri::plugin::Builder::new("sign")
        .invoke_handler(tauri::generate_handler![sign_template])
        .build()
}