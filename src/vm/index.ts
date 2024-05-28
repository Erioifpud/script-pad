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
import ReactLib from 'react';

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

export function executeScript(code: string, vars: Record<string, any>) {
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
