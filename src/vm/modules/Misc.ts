import { downloadFile } from '@/utils'

export class Misc {
  static async retry<T>(task: Promise<T>, times: number, delay: number): Promise<T> {
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

  static async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static async saveAs(binaryData: Uint8Array, title = 'download') {
    return downloadFile(binaryData, title)
  }

  static async saveAsZip(binaryData: Uint8Array, title = 'download') {
    return downloadFile(binaryData, title, [
      { name: 'Zip', extensions: ['zip'] },
    ])
  }
}