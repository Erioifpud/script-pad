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
}