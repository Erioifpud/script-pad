export class EventBus {
  private listeners: Map<string, Function[]> = new Map();

  on(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }

  off(event: string, listener: Function) {
    if (!this.listeners.has(event)) {
      return;
    }
    const fnList = this.listeners.get(event) || []
    const index = fnList.indexOf(listener);
    if (index !== -1) {
      this.listeners.set(event, fnList.slice(index, 1));
    }
  }

  clear(event: string) {
    this.listeners.delete(event);
  }

  emit(event: string, ...args: any[]) {
    if (!this.listeners.has(event)) {
      return;
    }
    const fnList = this.listeners.get(event) || []
    fnList.forEach((fn) => {
      fn.apply(this, args);
    });
  }
}