import { FileManager as ModuleFile } from './modules/File'
import { Request as ModuleRequest } from './modules/Request';

export function executeScript(script: string) {
  function executeWithScope(code: string) {
    const FileManager = ModuleFile;
    const HTTP = ModuleRequest;
    // 定义上下文中的类和函数
    return eval(code);
  }
  return executeWithScope(script);
}
