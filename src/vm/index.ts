import { FileManager as ModuleFile } from './modules/File'

export function executeScript(script: string) {
  function executeWithScope(code: string) {
    const FileManager = ModuleFile;
    // 定义上下文中的类和函数
    return eval(code);
  }
  return executeWithScope(script);
}
