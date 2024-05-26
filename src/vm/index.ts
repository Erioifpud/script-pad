export function executeScript(script: string) {
  function executeWithScope(code: string) {
    const window = {};
    // 定义上下文中的类和函数
    return eval(code);
  }
  return executeWithScope(script);
}
