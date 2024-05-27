import { FileManager as ModuleFile } from './modules/File'
import { Request as ModuleRequest } from './modules/Request';
import { AI as ModuleAI } from './modules/AI';
import { Config as ModuleConfig } from './modules/Config'
import { HTML as ModuleHTML } from './modules/HTML';
import { App as ModuleApp } from './modules/App';
import { Input as ModuleInput } from './modules/Input';

const template = (code: string) => {
  return `(async () => {
    try {
      ${code}
    } catch(err) {
      console.error(err);
      App.done();
    }
  })()`
}

export function executeScript(code: string, vars: Record<string, any>) {
  function executeWithScope(code: string) {
    const FileManager = ModuleFile;
    const HTTP = ModuleRequest;
    const AI = ModuleAI;
    const Config = ModuleConfig;
    const HTML = ModuleHTML;
    const App = ModuleApp;
    const Input = ModuleInput;
    ModuleConfig.vars = vars;
    // 定义上下文中的类和函数
    eval(
      template(code)
    );
  }
  return executeWithScope(code);
}
