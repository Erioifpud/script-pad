// @ts-expect-error 这个库没有类型定义
import * as Babel from '@babel/standalone';
import { FileManager as ModuleFile } from './modules/File'
import { Request as ModuleRequest } from './modules/Request';
import { AI as ModuleAI } from './modules/AI';
import { Config as ModuleConfig } from './modules/Config'
import { HTML as ModuleHTML } from './modules/HTML';
import { App as ModuleApp } from './modules/App';
import { Input as ModuleInput } from './modules/Input';
import { TTS as ModuleTTS } from './modules/TTS';
import { Clipboard as ModuleClipboard } from './modules/Clipboard';
import { UUID as ModuleUUID } from './modules/UUID';
import { Lib as ModuleLib } from './modules/Lib';
import { Notice as ModuleNotice } from './modules/Notice';
import { Misc as ModuleMisc } from './modules/Misc';
import { Doc as ModuleDoc } from './modules/Doc';
import { Random as ModuleRandom } from './modules/Random';
import { Time as ModuleTime } from './modules/Time';
import { Capture as ModuleCapture } from './modules/Capture';
import { Archive as ModuleArchive } from './modules/Archive';
import ReactLib from 'react';
// @ts-expect-error 这个库没有类型定义
import vm from 'vm-browserify'

const template = (code: string) => {
  return `(async () => {
    try {
      Lib.win = window;
      ${code}
    } catch(err) {
      console.error(err);
      Notice.send('运行错误', err.message);
    } finally {
      App.done();
    }
  })()`
}

// export function executeScriptEval(code: string, vars: Record<string, any>) {
//   function executeWithScope(code: string) {
//     // 无需在意，这里只是为了给 eval 提供上下文
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const FileManager = ModuleFile;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const HTTP = ModuleRequest;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const AI = ModuleAI;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const Config = ModuleConfig;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const HTML = ModuleHTML;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const App = ModuleApp;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const Input = ModuleInput;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const React = ReactLib;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const TTS = ModuleTTS;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const Clipboard = ModuleClipboard;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const UUID = ModuleUUID;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const Lib = ModuleLib;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const Notice = ModuleNotice;
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const Misc = ModuleMisc;
//     ModuleConfig.vars = vars;

//     const fullCode = template(code)

//     const transformed = Babel.transform(fullCode, {
//       presets: ['react']
//     })

//     eval(
//       transformed.code
//     );
//   }
//   return executeWithScope(code);
// }

export function executeScript(code: string, vars: Record<string, string>) {
  const FileManager = ModuleFile;
  const HTTP = ModuleRequest;
  const AI = ModuleAI;
  const Config = ModuleConfig;
  const HTML = ModuleHTML;
  const App = ModuleApp;
  const Input = ModuleInput;
  const React = ReactLib;
  const TTS = ModuleTTS;
  const Clipboard = ModuleClipboard;
  const UUID = ModuleUUID;
  const Lib = ModuleLib;
  const Notice = ModuleNotice;
  const Misc = ModuleMisc;
  const Doc = ModuleDoc;
  const Random = ModuleRandom;
  const Time = ModuleTime;
  const Capture = ModuleCapture;
  const Archive = ModuleArchive;
  ModuleConfig.vars = vars;

  const fullCode = template(code)

  const transformed = Babel.transform(fullCode, {
    presets: ['react']
  })

  return vm.runInNewContext(transformed.code, {
    FileManager,
    HTTP,
    AI,
    Config,
    HTML,
    App,
    Input,
    React,
    TTS,
    Clipboard,
    UUID,
    Lib,
    Notice,
    Misc,
    Doc,
    Random,
    Time,
    Capture,
    Archive,
    console: window.console,
    // 用于修复 iframe 中的 setTimeout 失效的问题（在 iframe 被清理前还没有执行的那些）
    // eslint-disable-next-line @typescript-eslint/ban-types
    setTimeout: function (callback: Function, wait: number) {
      return setTimeout(() => callback(), wait);
    },
    clearTimeout: (handle: number) => clearTimeout(handle)
  })
}