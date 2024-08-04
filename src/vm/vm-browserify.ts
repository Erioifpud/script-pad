// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck 迟早要改，能用就先用着（https://github.com/browserify/vm-browserify）
const indexOf = function (xs, item) {
  if (xs.indexOf) return xs.indexOf(item);
  else for (let i = 0; i < xs.length; i++) {
      if (xs[i] === item) return i;
  }
  return -1;
};
const Object_keys = function (obj) {
  if (Object.keys) return Object.keys(obj)
  else {
      const res = [];
      for (const key in obj) res.push(key)
      return res;
  }
};

const forEach = function (xs, fn) {
  if (xs.forEach) return xs.forEach(fn)
  else for (let i = 0; i < xs.length; i++) {
      fn(xs[i], i, xs);
  }
};

const defineProp = (function() {
  try {
      Object.defineProperty({}, '_', {});
      return function(obj, name, value) {
          Object.defineProperty(obj, name, {
              writable: true,
              enumerable: false,
              configurable: true,
              value: value
          })
      };
  } catch(e) {
      return function(obj, name, value) {
          obj[name] = value;
      };
  }
}());

const globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape', 'Blob', 'TextEncoder', 'URL'];

function Context() {}
Context.prototype = {};


export const Script = function NodeScript (code) {
  if (!(this instanceof Script)) return new Script(code);
  this.code = code;
};

Script.prototype.runInContext = function (context) {
  if (!(context instanceof Context)) {
      throw new TypeError("needs a 'context' argument.");
  }

  const iframe = document.createElement('iframe');
  if (!iframe.style) iframe.style = {};
  iframe.style.display = 'none';

  document.body.appendChild(iframe);

  const win = iframe.contentWindow;
  let wEval = win.eval
  const wExecScript = win.execScript;

  if (!wEval && wExecScript) {
      // win.eval() magically appears when this is called in IE:
      wExecScript.call(win, 'null');
      wEval = win.eval;
  }

  forEach(Object_keys(context), function (key) {
      win[key] = context[key];
  });
  forEach(globals, function (key) {
      if (context[key]) {
          win[key] = context[key];
      }
  });

  const winKeys = Object_keys(win);

  const res = wEval.call(win, this.code);

  forEach(Object_keys(win), function (key) {
      // Avoid copying circular objects like `top` and `window` by only
      // updating existing context properties or new properties in the `win`
      // that was only introduced after the eval.
      if (key in context || indexOf(winKeys, key) === -1) {
          context[key] = win[key];
      }
  });

  forEach(globals, function (key) {
      if (!(key in context)) {
          defineProp(context, key, win[key]);
      }
  });

  document.body.removeChild(iframe);

  return res;
};

Script.prototype.runInThisContext = function () {
  return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
  const ctx = Script.createContext(context);
  const res = this.runInContext(ctx);

  if (context) {
      forEach(Object_keys(ctx), function (key) {
          context[key] = ctx[key];
      });
  }

  return res;
};

forEach(Object_keys(Script.prototype), function (name) {
  Script[name] = function (code, ...args) {
      const s = Script(code);
      // eslint-disable-next-line prefer-spread
      return s[name].apply(s, args);
  };
});

export const isContext = function (context) {
  return context instanceof Context;
};

export const createScript = function (code) {
  return Script(code);
};

export const createContext = Script.createContext = function (context) {
  const copy = new Context();
  if(typeof context === 'object') {
      forEach(Object_keys(context), function (key) {
          copy[key] = context[key];
      });
  }
  return copy;
};