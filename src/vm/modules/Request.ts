import { FetchOptions, ResponseType, fetch } from '@tauri-apps/api/http'

export class Request {
  async raw(url: string, options: FetchOptions) {
    const res = await fetch(url, options)
    return res
  }
  async get(url: string, options: Omit<FetchOptions, 'method' | 'responseType'>) {
    const resp = await this.raw(url, {
      ...options,
      method: 'GET',
      responseType: ResponseType.JSON
    })
    return resp.data
  }

  async post(url: string, options: Omit<FetchOptions, 'method' | 'responseType'>) {
    const resp = await this.raw(url, {
      ...options,
      method: 'POST',
      responseType: ResponseType.JSON
    })
    return resp.data
  }

}