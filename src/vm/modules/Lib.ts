import { difference } from 'lodash-es';
import { Request } from './Request';

interface CDNJSResults {
  name: string;
  latest: string;
}

export class Lib {
  static win = window;
  static keys: string[] = []
  static async load(originName: string) {
    if (typeof originName !== "string") {
      throw new Error("Argument should be a string, please check it.");
    }
    // 先记录当前 win 的键
    Lib.keys = Object.keys(Lib.win)
    // Trim string
    const name = originName.trim();
    // If it is a valid URL, inject it directly
    if (/^https?:\/\//.test(name)) {
      return Lib.inject(name);
    }
    // If version specified, try unpkg
    if (name.indexOf("@") !== -1) {
      return Lib.unpkg(name);
    }
    return Lib.cdnjs(name);
  }

  private static cdnjs(name: string) {
    console.log('正在搜索', name);
    return Request.get(`https://api.cdnjs.com/libraries?search=${name}`, {})
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

        return Lib.inject(
          url,
        );
      })
  }

  private static unpkg(name: string) {
    const url = `https://unpkg.com/${name}`;
    return Lib.inject(url);
  }

  // static async esm(name: string) {
  //   console.log(name, "(esm) is loading, please be patient...");
  //   const res = Lib.win.eval(`(await import("https://esm.run/${name}"))`);
  //   return res;
  // }

  private static inject(
    url: string,
  ) {
    return Lib.downloadScriptCode(url).then(code => {
      return Lib.injectScriptCode(code)
    })
  }

  private static injectScriptCode(
    code: string,
  ): Promise<string[]> {
    return new Promise((resolve) => {
      Lib.win.eval(code)
      const newKeys = Object.keys(Lib.win)
      const libNames = difference(newKeys, Lib.keys)
      resolve(libNames)
    })
  }

  private static downloadScriptCode(url: string) {
    return Request.raw(url, {
      method: 'GET',
      responseType: 2
    }).then(resp => {
      return resp.data as string
    })
  }
}
