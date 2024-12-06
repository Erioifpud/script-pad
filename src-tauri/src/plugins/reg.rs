use serde::{Deserialize, Serialize};
use tauri::{command, plugin::TauriPlugin, Wry};
use winreg::{types::FromRegValue, HKEY};
#[cfg(windows)]
use winreg::{enums::{HKEY_CLASSES_ROOT, HKEY_CURRENT_CONFIG, HKEY_CURRENT_USER, HKEY_CURRENT_USER_LOCAL_SETTINGS, HKEY_DYN_DATA, HKEY_LOCAL_MACHINE, HKEY_PERFORMANCE_DATA, HKEY_PERFORMANCE_NLSTEXT, HKEY_PERFORMANCE_TEXT, HKEY_USERS}, RegKey};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegValue {
    success: bool,
    reason: String,
    value: String,
    value_type: String,
    last_write_time: String,
}

impl RegValue {
    fn success(value: String, value_type: String, last_write_time: String) -> Self {
        RegValue {
            success: true,
            reason: String::new(),
            value,
            value_type,
            last_write_time,
        }
    }

    fn fail(reason: String) -> Self {
        RegValue {
            success: false,
            reason,
            value: String::new(),
            value_type: String::new(),
            last_write_time: String::new(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegKeys {
    success: bool,
    reason: String,
    keys: Vec<String>,
}

impl RegKeys {
    fn success(keys: Vec<String>) -> Self {
        RegKeys { success: true, reason: String::new(), keys }
    }

    fn fail(reason: String) -> Self {
        RegKeys { success: false, reason, keys: Vec::new() }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegItem {
    name: String,
    value: String,
    value_type: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegItems {
    success: bool,
    reason: String,
    items: Vec<RegItem>,
}

impl RegItems {
    fn success(items: Vec<RegItem>) -> Self {
        RegItems { success: true, reason: String::new(), items }
    }

    fn fail(reason: String) -> Self {
        RegItems { success: false, reason, items: Vec::new() }
    }
}

/**
 * 获取字符串与注册表根键的映射
 */
fn get_hkey(hkey: String) -> Result<HKEY, String> {
    let hkey = match hkey.as_str() {
        "ClassesRoot" => HKEY_CLASSES_ROOT,
        "CurrentUser" => HKEY_CURRENT_USER,
        "LocalMachine" => HKEY_LOCAL_MACHINE,
        "Users" => HKEY_USERS,
        "PerformanceData" => HKEY_PERFORMANCE_DATA,
        "PerformanceText" => HKEY_PERFORMANCE_TEXT,
        "PerformanceNLSText" => HKEY_PERFORMANCE_NLSTEXT,
        "CurrentConfig" => HKEY_CURRENT_CONFIG,
        "DynData" => HKEY_DYN_DATA,
        "CurrentUserLocalSettings" => HKEY_CURRENT_USER_LOCAL_SETTINGS,
        _ => return Err("无效的注册表根键类型".to_string()),
    };
    Ok(hkey)
}

/**
 * 获取注册表子项
 */
fn get_sub_key(hkey: String, path: String) -> Result<(RegKey, RegKey), String> {
    let hkey = get_hkey(hkey)?;

    let reg = RegKey::predef(hkey);
    let sub_key = reg.open_subkey(path)
        .map_err(|_| "打开注册表子项失败".to_string())?;

    Ok((reg, sub_key))
}

/**
 * 格式化注册表 raw 值
 */
fn format_raw_value(val: winreg::reg_value::RegValue) -> (Result<String, String>, String) {
    match val.vtype {
        winreg::enums::RegType::REG_SZ | winreg::enums::RegType::REG_EXPAND_SZ | winreg::enums::RegType::REG_MULTI_SZ => {
            (
                FromRegValue::from_reg_value(&val)
                    .map_err(|_| "无法将字符串转换为字符串".to_string()), 
                "string".to_string()
            )
        },
        winreg::enums::RegType::REG_DWORD => {
            (
                FromRegValue::from_reg_value(&val)
                    .map(|v: u32| v.to_string())
                    .map_err(|_| "无法将DWORD转换为字符串".to_string()),
                "dword".to_string()
            )
        },
        winreg::enums::RegType::REG_QWORD => {
            (
                FromRegValue::from_reg_value(&val)
                    .map(|v: u64| v.to_string())
                    .map_err(|_| "无法将QWORD转换为字符串".to_string()),
                "qword".to_string()
            )
        },
        winreg::enums::RegType::REG_BINARY => {
            // 用逗号分隔二进制数据
            let binary_str = val.bytes.iter().map(|b| format!("{:02x}", b)).collect::<Vec<String>>().join(",");
            (
                Ok(binary_str),
                "binary".to_string()
            )
        },
        _ => (Err("未知注册表值类型".to_string()), "unknown".to_string()),
    }
}

#[command]
pub fn get_registry_value(hkey: String, path: String, name: String) -> Result<RegValue, RegValue> {
    #[cfg(windows)] {
        let (reg, sub_key) = get_sub_key(hkey, path).map_err(|err| RegValue::fail(err))?;

        let (value, value_type) = match sub_key.get_raw_value(&name) {
            Ok(val) => format_raw_value(val),
            Err(err) => return Err(RegValue::fail(format!("获取注册表值失败: {}", err))),
        };

        let value = value.map_err(|_| RegValue::fail("无法将值转换为字符串".to_string()))?;
        
        let info = reg.query_info()
            .map_err(|_| RegValue::fail("查询注册表信息失败".to_string()))?;
        let mt = info.get_last_write_time_system();
        let last_write_time = format!(
            "{}-{:02}-{:02} {:02}:{:02}:{:02}",
            mt.wYear, mt.wMonth, mt.wDay, mt.wHour, mt.wMinute, mt.wSecond
        );
    
        Ok(RegValue::success(value, value_type, last_write_time))
    }

    #[cfg(not(windows))] {
        Err(RegValue::fail("当前系统不支持注册表操作".to_string()))
    }
}

#[command]
pub fn get_registry_keys(hkey: String, path: String) -> Result<RegKeys, RegKeys> {
    #[cfg(windows)] {
        let (_reg, sub_key) = get_sub_key(hkey, path).map_err(|err| RegKeys::fail(err))?;

        let keys = sub_key.enum_keys()
            .filter_map(|key| {
                match key {
                    Ok(key) => Some(key),
                    Err(_) => None,
                }
            })
            .collect();

        Ok(RegKeys::success(keys))
    }

    #[cfg(not(windows))] {
        Err(RegKeys::fail("当前系统不支持注册表操作".to_string()))
    }
}

#[command]
pub fn get_registry_values(hkey: String, path: String) -> Result<RegItems, RegItems> {
    #[cfg(windows)] {
        let (_reg, sub_key) = get_sub_key(hkey, path).map_err(|err| RegItems::fail(err))?;

        let values = sub_key.enum_values()
            .filter_map(|value| {
                match value {
                    Ok(value) => {
                        let (name, reg_value) = value;
                        let (value, value_type) = format_raw_value(reg_value);
                        if let Ok(value) = value {
                            Some(RegItem { name, value, value_type })
                        } else {
                            None
                        }
                    },
                    Err(_) => None,
                }
            })
            .collect();

        Ok(RegItems::success(values))
    }

    #[cfg(not(windows))] {
        Err(RegItems::fail("当前系统不支持注册表操作".to_string()))
    }
}

pub fn init() -> TauriPlugin<Wry> {
    tauri::plugin::Builder::new("registry")
        .invoke_handler(tauri::generate_handler![get_registry_value, get_registry_keys, get_registry_values])
        .build()
}