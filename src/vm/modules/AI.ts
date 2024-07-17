import { Body } from '@tauri-apps/api/http';
import { Request } from './Request';

interface CommonMessage {
  role: string
  content: string
}

type Message = CommonMessage

interface Choice {
  message: Message
  finish_reason: string
}

interface QwenOptions {
  model: string
  input: {
    prompt?: string
    messages?: Message[]
  }
  parameters?: {
    result_format?: string
    seed?: number
    max_tokens?: number
    top_p?: number
    top_k?: number
    repetition_penalty?: number
    temperature?: number
    stop?: string | string[]
    enable_search?: boolean
    incremental_output?: boolean
    // tools?: any
  }
}

interface QwenResponse {
  output: {
    text: string
    finish_reason: string
    choices: Choice[]
  }
  usage: {
    output_tokens: number
    input_tokens: number
    total_tokens: number
  }
  request_id: string
}

interface QwenChatRawOptions {
  model: string
  messages: Message[]
  key: string
}

interface QwenChatOptions {
  model: string
  question: string
  key: string
}

export class AI {
  async qwenChatRaw(options: QwenChatRawOptions) {
    const resp = await Request.post('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${options.key}`
      },
      body: Body.json({
        model: options.model,
        input: {
          messages: options.messages
        },
        parameters: {
          result_format: 'message',
        }
      } as QwenOptions)
    }) as QwenResponse
    if ('code' in resp) {
      throw new Error(`Qwen 请求错误：${JSON.stringify(resp)}`)
    }
    return resp
  }

  async qwenChatSimple(options: QwenChatOptions) {
    const resp = await this.qwenChatRaw({
      model: options.model,
      messages: [
        {
          role: 'user',
          content: options.question
        }
      ],
      key: options.key
    })
    if (resp.output.finish_reason === 'error') {
      throw new Error(resp.output.text)
    }
    const answers = resp.output.choices.map(choice => {
      return choice.message.content
    })
    return answers.join('\n')
  }

  async qwenChat(options: QwenChatRawOptions) {
    const resp = await this.qwenChatRaw(options)
    if (resp.output.finish_reason === 'error') {
      throw new Error(resp.output.text)
    }
    const answers = resp.output.choices.map(choice => {
      return choice.message.content
    })
    return answers.join('\n')
  }
}