import { SERVER_PLUGIN } from '@/constants'
import { invoke } from '@tauri-apps/api'
import { Request } from './Request'
import { Body } from '@tauri-apps/api/http'

interface ServerInfo {
  host: string
  port: number
}

interface Args {
  http_addr: string
  http_port: number
}

interface ResponseWrapper<T> {
  success: boolean
  message: string
  data: T
}

export class Api {
  async getServerInfo(): Promise<ServerInfo> {
    return invoke<Args>(SERVER_PLUGIN.GET_SERVER_INFO).then((args) => {
      return {
        host: args.http_addr,
        port: args.http_port,
      }
    })
  }

  private async getUrl(path: string) {
    const { host, port } = await this.getServerInfo()
    return `http://${host}:${port}/${path}`
  }

  async uploadImage(base64: string, mimeType = 'image/png') {
    const url = await this.getUrl('api/upload_image')
    const resp = await new Request().post<ResponseWrapper<string>>(url, {
      body: Body.json({
        mime_type: mimeType,
        base64
      })
    })
    return resp
  }

  async getImage(id: string) {
    const url = await this.getUrl(`api/get_image/${id}`)
    return url
  }

  async imageCors(imgUrl: string) {
    const url = await this.getUrl(`api/img_cors?url=${imgUrl}`)
    return url
  }
}