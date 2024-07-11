// @ts-expect-error 这个库没有类型定义
import * as Babel from '@babel/standalone';
import { FileManager } from './modules/File'
import { Request as HTTP } from './modules/Request';
import { AI } from './modules/AI';
import { Config } from './modules/Config'
import { HTML } from './modules/HTML';
import { App } from './modules/App';
import { Input } from './modules/Input';
import { TTS  } from './modules/TTS';
import { Clipboard } from './modules/Clipboard';
import { UUID } from './modules/UUID';
import { Lib } from './modules/Lib';
import { Notice } from './modules/Notice';
import { Misc } from './modules/Misc';
import { Doc } from './modules/Doc';
import { Random } from './modules/Random';
import { Time } from './modules/Time';
import { Capture } from './modules/Capture';
import { Archive } from './modules/Archive';
import { Template } from './modules/Template';
import { RemoteCall } from './modules/RemoteCall';
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
  Config.vars = vars;

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
    React: ReactLib,
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