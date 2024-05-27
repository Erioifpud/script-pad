import { convert, HtmlToTextOptions } from 'html-to-text'

export class HTML {
  static async getPlainText(html: string) {
    return convert(html, {
      wordwrap: null
    })
  }
}