import { FetchOptions, ResponseType, fetch } from '@tauri-apps/api/http'

export class Request {
  async raw<T>(url: string, options: FetchOptions) {
    const res = await fetch<T>(url, options)
    return res
  }
  async get<T>(url: string, options: Omit<FetchOptions, 'method' | 'responseType'>) {
    const resp = await this.raw<T>(url, {
      ...options,
      method: 'GET',
      responseType: ResponseType.JSON
    })
    return resp.data
  }

  async post<T>(url: string, options: Omit<FetchOptions, 'method' | 'responseType'>) {
    const resp = await this.raw<T>(url, {
      ...options,
      method: 'POST',
      responseType: ResponseType.JSON
    })
    return resp.data
  }

}