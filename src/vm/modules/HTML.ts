import { convert } from 'html-to-text'

export class HTML {
  async getPlainText(html: string) {
    return convert(html, {
      wordwrap: null
    })
  }
}