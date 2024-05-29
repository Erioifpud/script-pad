import { FetchOptions, ResponseType, fetch } from '@tauri-apps/api/http'

export class Request {
  static async raw(url: string, options: FetchOptions) {
    const res = await fetch(url, options)
    return res
  }
  static async get(url: string, options: Omit<FetchOptions, 'method' | 'responseType'>) {
    const resp = await Request.raw(url, {
      ...options,
      method: 'GET',
      responseType: ResponseType.JSON
    })
    return resp.data
  }

  static async post(url: string, options: Omit<FetchOptions, 'method' | 'responseType'>) {
    const resp = await Request.raw(url, {
      ...options,
      method: 'POST',
      responseType: ResponseType.JSON
    })
    return resp.data
  }

}