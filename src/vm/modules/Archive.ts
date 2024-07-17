import JSZip from 'jszip'

interface FlatItem {
  name: string
  data: string
  type: 'base64' | 'text'
}

export class Archive {
  async zipFlat(items: FlatItem[]) {
    const zip = new JSZip()
    items.forEach((item) => {
      let data = item.data
      if (item.type === 'base64') {
        data = data.replace(/^data:image\/\w+;base64,/, '')
      }
      zip.file(item.name, data, { base64: item.type === 'base64' })
    })
    return await zip.generateAsync({ type: 'uint8array' })
  }
}