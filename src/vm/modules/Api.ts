import { SERVER_PLUGIN } from '@/constants'
import { invoke } from '@tauri-apps/api'

interface ServerInfo {
  host: string
  port: number
}

interface Args {
  http_addr: string
  http_port: number
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
}