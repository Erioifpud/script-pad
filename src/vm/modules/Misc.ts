import { downloadFile } from '@/utils'
import { invoke } from '@tauri-apps/api'

interface ServerInfo {
  host: string
  port: number
}

interface Args {
  http_addr: string
  http_port: number
}

export class Misc {
  async retry<T>(task: Promise<T>, times: number, delay: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const retry = (n: number) => {
        return task
          .then(resolve)
          .catch(err => {
            if (n === 0) {
              reject(err)
              return
            }
            setTimeout(() => {
              retry(n - 1)
            }, delay)
          })
      }
      retry(times)
    })
  }

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async saveAs(binaryData: Uint8Array, title = 'download') {
    return downloadFile(binaryData, title)
  }

  async saveAsZip(binaryData: Uint8Array, title = 'download') {
    return downloadFile(binaryData, title, [
      { name: 'Zip', extensions: ['zip'] },
    ])
  }

  async toBase64(str: string) {
    return btoa(
      String.fromCharCode(
        ...new TextEncoder().encode(str)
      )
    )
  }

  async fromBase64(b64: string) {
    return new TextDecoder().decode(
      Uint8Array.from(
        atob(b64),
        (c) => c.charCodeAt(0)
      )
    )
  }

  async getServerInfo(): Promise<ServerInfo> {
    return invoke<Args>('plugin:http_server|get_server_info').then((args) => {
      return {
        host: args.http_addr,
        port: args.http_port,
      }
    })
  }
}