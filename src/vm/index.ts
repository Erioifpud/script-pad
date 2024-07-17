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
import { Script } from './vm-browserify'

const template = (code: string) => {
  return `(async () => {
    try {
      Lib.setWin(window);
      RemoteCall.setWin(window);
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
  const fullCode = template(code)

  const transformed = Babel.transform(fullCode, {
    presets: ['react']
  })

  // @ts-expect-error 肯定有，是 vm-browserify 定义时的问题
  return Script.runInNewContext(transformed.code, {
    FileManager: new FileManager(),
    HTTP: new HTTP(),
    AI: new AI(),
    Config: new Config(vars),
    HTML: new HTML(),
    App: new App(),
    Input: new Input(),
    React: ReactLib,
    TTS: new TTS(),
    Clipboard: new Clipboard(),
    UUID: new UUID(),
    Lib: new Lib(),
    Notice: new Notice(),
    Misc: new Misc(),
    Doc: new Doc(),
    Random: new Random(),
    Time: new Time(),
    Capture: new Capture(),
    Archive: new Archive(),
    Template: new Template(),
    RemoteCall: new RemoteCall(),
    // iframe 版加载图片后读取不出尺寸
    Image: window.Image,
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