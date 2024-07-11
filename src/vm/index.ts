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
import { Template as ModuleTemplate } from './modules/Template';
import { RemoteCall as ModuleRemoteCall } from './modules/RemoteCall';
import ReactLib from 'react';
// @ts-expect-error 这个库没有类型定义
import vm from 'vm-browserify'

const template = (code: string) => {
  return `(async () => {
    try {
      Lib.win = window;
      RemoteCall.win = window;
      ${code}
    } catch(err) {
      console.error(err);
      Notice.send('运行错误', err.message);
    } finally {
      await RemoteCall._stopTask();
      App.done();
    }
  })()`
}

export function executeScript(code: string, vars: Record<string, string>) {
  return executeScriptRaw(code, vars)
}

export function executeScriptRaw(code: string, vars: Record<string, string>, injectVars?: Record<string, string>) {
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
  const Template = ModuleTemplate;
  const RemoteCall = ModuleRemoteCall;
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
    Template,
    RemoteCall,
    ...injectVars,
    console: window.console,
    // 用于修复 iframe 中的 setTimeout 失效的问题（在 iframe 被清理前还没有执行的那些）
    // eslint-disable-next-line @typescript-eslint/ban-types
    setTimeout: function (callback: Function, wait: number) {
      return setTimeout(() => callback(), wait);
    },
    clearTimeout: (handle: number) => clearTimeout(handle)
  })
}