import { difference } from 'lodash-es';
import { Request } from './Request';

interface CDNJSResults {
  name: string;
  latest: string;
}

export class Lib {
  private win: Window & typeof globalThis = window;
  private keys: string[] = []

  setWin(win: Window & typeof globalThis) {
    this.win = win
  }

  async load(originName: string) {
    if (typeof originName !== "string") {
      throw new Error("Argument should be a string, please check it.");
    }
    // 先记录当前 win 的键
    this.keys = Object.keys(this.win)
    // Trim string
    const name = originName.trim();
    // If it is a valid URL, inject it directly
    if (/^https?:\/\//.test(name)) {
      return this.inject(name);
    }
    // If version specified, try unpkg
    if (name.indexOf("@") !== -1) {
      return this.unpkg(name);
    }
    return this.cdnjs(name);
  }

  private cdnjs(name: string) {
    console.log('正在搜索', name);
    return new Request().get(`https://api.cdnjs.com/libraries?search=${name}`, {})
      .then(resp => resp as { results: CDNJSResults[] })
      .then(({ results }) => {
        if (results.length === 0) {
          throw new Error(`找不到 ${name}`);
        }

        const matchedResult = results.filter((item) => item.name === name);
        const { name: exactName, latest: url } = matchedResult[0] || results[0];
        if (name !== exactName) {
          console.log(`找不到 ${name}, 已替换成 ${exactName}`);
        }

        return this.inject(
          url,
        );
      })
  }

  private unpkg(name: string) {
    const url = `https://unpkg.com/${name}`;
    return this.inject(url);
  }

  // async esm(name: string) {
  //   console.log(name, "(esm) is loading, please be patient...");
  //   const res = this.win.eval(`(await import("https://esm.run/${name}"))`);
  //   return res;
  // }

  private inject(
    url: string,
  ) {
    return this.downloadScriptCode(url).then((code: string) => {
      return this.injectScriptCode(code)
    })
  }

  private injectScriptCode(
    code: string,
  ): Promise<string[]> {
    return new Promise((resolve) => {
      this.win.eval(code)
      const newKeys = Object.keys(this.win)
      const libNames = difference(newKeys, this.keys)
      resolve(libNames)
    })
  }

  private downloadScriptCode(url: string) {
    return new Request().raw(url, {
      method: 'GET',
      responseType: 2
    }).then(resp => {
      return resp.data as string
    })
  }
}
