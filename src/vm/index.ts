import { FileManager as ModuleFile } from './modules/File'
import { Request as ModuleRequest } from './modules/Request';
import { AI as ModuleAI } from './modules/AI';
import { Config as ModuleConfig } from './modules/Config'
import { HTML as ModuleHTML } from './modules/HTML';
import { App as ModuleApp } from './modules/App';

export function executeScript(code: string, vars: Record<string, any>) {
  function executeWithScope(code: string) {
    const FileManager = ModuleFile;
    const HTTP = ModuleRequest;
    const AI = ModuleAI;
    const Config = ModuleConfig;
    const HTML = ModuleHTML;
    const App = ModuleApp;
    ModuleConfig.vars = vars;
    // 定义上下文中的类和函数
    return eval(code);
  }
  return executeWithScope(code);
}
