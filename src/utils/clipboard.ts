import clipboard from "tauri-plugin-clipboard-api";

type TypeImageRead = 'base64' | 'objectURL' | 'array' | 'blob'

export function readImage(type: 'base64'): Promise<string>;
export function readImage(type: 'objectURL'): Promise<string>;
export function readImage(type: 'array'): Promise<Uint8Array>;
export function readImage(type: 'blob'): Promise<Blob>;

export function readImage(type: TypeImageRead) {
  if (type === 'base64') {
    return clipboard.readImageBase64();
  }
  if (type === 'objectURL') {
    return clipboard.readImageObjectURL();
  }
  if (type === 'array') {
    return clipboard.readImageBinary('Uint8Array');
  }
  return clipboard.readImageBinary('Blob');
}

type TypeTextRead = 'plain' | 'rich' | 'html'

export function readText(type: 'plain'): Promise<string>;
export function readText(type: 'html'): Promise<string>;
export function readText(type: 'rich'): Promise<string>;

export function readText(type: TypeTextRead) {
  if (type === 'html') {
    return clipboard.readHtml();
  }
  if (type === 'rich') {
    return clipboard.readRtf();
  }
  return clipboard.readText();
}

type TypeFilesRead = 'files' | 'urls'

export function readFiles (type: TypeFilesRead) {
  if (type === 'files') {
    return clipboard.readFiles();
  }
  return clipboard.readFilesURIs();
}

export function writeImage(data: number[] | string) {
  if (typeof data === 'string') {
    return clipboard.writeImageBase64(data)
  }
  return clipboard.writeImageBinary(data);
}

type TypeTextWrite = 'plain' | 'html' | 'rich'

export function writeText(data: string, type: TypeTextWrite) {
  if (type === 'rich') {
    return clipboard.writeRtf(data)
  }
  return clipboard.writeHtmlAndText(data, data)
}
