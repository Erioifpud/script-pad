import { useLogStore } from '@/store/log';

// @ts-ignore
class CustomConsole implements Console {
  public originalConsole: Console;

  constructor(originalConsole: Console) {
    this.originalConsole = originalConsole;
  }

  log(message?: any, ...optionalParams: any[]): void {
    useLogStore.getState().addLog('log', [message, ...optionalParams]);
    this.originalConsole.log(message, ...optionalParams);
  }

  error(message?: any, ...optionalParams: any[]): void {
    useLogStore.getState().addLog('error', [message, ...optionalParams]);
    this.originalConsole.error(message, ...optionalParams);
  }

  debug(message?: any, ...optionalParams: any[]): void {
    useLogStore.getState().addLog('debug', [message, ...optionalParams]);
    this.originalConsole.debug(message, ...optionalParams);
  }

  info(message?: any, ...optionalParams: any[]): void {
    useLogStore.getState().addLog('info', [message, ...optionalParams]);
    this.originalConsole.info(message, ...optionalParams);
  }

  warn(message?: any, ...optionalParams: any[]): void {
    useLogStore.getState().addLog('warn', [message, ...optionalParams]);
    this.originalConsole.warn(message, ...optionalParams);
  }

  clear(): void {
    useLogStore.getState().setLogs([]);
    this.originalConsole.clear();
  }

  dir(value: any, ...optionalParams: any[]): void {
    this.originalConsole.dir(value, ...optionalParams);
  }

  dirxml(value: any): void {
    this.originalConsole.dirxml(value);
  }

  table(value: any, properties?: string[]): void {
    this.originalConsole.table(value, properties);
  }

  trace(message?: any, ...optionalParams: any[]): void {
    this.originalConsole.trace(message, ...optionalParams);
  }

  group(...label: any[]): void {
    this.originalConsole.group(...label);
  }

  groupEnd(): void {
    this.originalConsole.groupEnd();
  }

  groupCollapsed(...label: any[]): void {
    this.originalConsole.groupCollapsed(...label);
  }

  time(label?: string): void {
    this.originalConsole.time(label);
  }

  timeEnd(label?: string): void {
    this.originalConsole.timeEnd(label);
  }

  timeLog(label?: string, ...data: any[]): void {
    this.originalConsole.timeLog(label, ...data);
  }

  count(label?: string): void {
    this.originalConsole.count(label);
  }

  countReset(label?: string): void {
    this.originalConsole.countReset(label);
  }

  assert(condition?: boolean, message?: string, ...optionalParams: any[]): void {
    this.originalConsole.assert(condition, message, ...optionalParams);
  }
  timeStamp(label?: string | undefined): void {
    this.originalConsole.timeStamp(label);
  }

  profile(label?: string): void {
    this.originalConsole.profile(label);
  }

  profileEnd(label?: string): void {
    this.originalConsole.profileEnd(label);
  }
}

// 创建一个新的CustomConsole实例
const myConsole = new CustomConsole(console);

// 创建一个代理来处理其他的console方法
// @ts-ignore
export const proxyConsole: Console = new Proxy(myConsole, {
  get(target: CustomConsole, propKey: string | symbol) {
    if (typeof propKey === 'string' && propKey in target) {
      // 如果目标对象有这个属性，那就直接返回
      return target[propKey as keyof CustomConsole];
    } else if (typeof propKey === 'string' && propKey in target.originalConsole) {
      // 如果目标对象没有这个属性，但原始的 console 有，那就返回原始 console 的方法
      return target.originalConsole[propKey as keyof Console];
    }
  }
});
