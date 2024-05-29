// @ts-ignore
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
import ReactLib from 'react';
// @ts-ignore
import vm from 'vm-browserify'

const template = (code: string) => {
  return `(async () => {
    try {
      ${code}
    } catch(err) {
      console.error(err);
    } finally {
      App.done();
    }
  })()`
}

export function executeScriptEval(code: string, vars: Record<string, any>) {
  function executeWithScope(code: string) {
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
    ModuleConfig.vars = vars;

    const fullCode = template(code)

    const transformed = Babel.transform(fullCode, {
      presets: ['react']
    })

    eval(
      transformed.code
    );
  }
  return executeWithScope(code);
}

export function executeScript(code: string, vars: Record<string, any>) {
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
    console: window.console,
    setTimeout: (callback: Function, wait: number) => setTimeout(() => callback(), wait),
    clearTimeout: (handle: number) => clearTimeout(handle)
  })
}