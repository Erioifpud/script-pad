import { dialog, fs } from '@tauri-apps/api';
// @ts-expect-error 这个库没有类型定义
import domtoimage from 'dom-to-image-more'

/**
 * 图片 Base64 数据转换为二进制数据
 * @param imageData 图片 Base64 数据
 * @returns 二进制数据
 */
export function imageDataToBinary(imageData: string) {
  // Remove the data URL prefix (e.g., 'data:image/png;base64,')
  const data = imageData.replace(/^data:image\/\w+;base64,/, '');

  // Decode the base64 data into binary format
  const binaryString = atob(data);

  // Create a Uint8Array from the binary string
  const length = binaryString.length;
  const binaryArray = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    binaryArray[i] = binaryString.charCodeAt(i);
  }

  return binaryArray;
}

/**
 * 将元素保存为图片
 * @param element 操作元素
 * @returns Promise<string> 图片 Base64 数据
 */
export function takeScreenshot(element: HTMLElement) {
  const width = element.offsetWidth
  const height = element.offsetHeight
  return domtoimage.toPng(element, {
    quality: 2,
    width: width * 2,
    height: height * 2,
    style: {
      transform: 'scale(2)',
      transformOrigin: 'top left',
    },
  })
}

/**
 * 弹窗选择路径保存并下载图片
 * @param data 图片 Base64 数据
 * @param title 保存弹窗的标题
 * @returns
 */
export function downloadImage(data: string, title: string) {
  return downloadFile(imageDataToBinary(data), title, [
    {
      name: 'Image',
      extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
    }
  ])
}

/**
 * 弹窗选择路径保存并下载文件
 * @param binaryData 文件二进制数据，Uint8Array
 * @param title 保存弹窗的标题
 * @returns
 */
export function downloadFile(binaryData: Uint8Array, title: string, filters: dialog.DialogFilter[] = []) {
  return dialog.save({
    title: title,
    filters
  }).then(path => {
    if (!path) {
      return false
    }
    fs.writeBinaryFile(path, binaryData)
    return true
  })
}
