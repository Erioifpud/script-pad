import { convert } from 'html-to-text'

export class HTML {
  getPlainText(html: string) {
    return convert(html, {
      wordwrap: null
    })
  }
}