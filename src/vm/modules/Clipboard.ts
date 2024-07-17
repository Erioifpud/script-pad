import { readFiles, readImage, readText, writeImage, writeText } from '@/utils/clipboard';

export class Clipboard {
  async readImageBase64() {
    return readImage('base64');
  }

  async readImageBytes() {
    return readImage('array');
  }

  async writeImage(data: number[] | string) {
    return writeImage(data);
  }

  async readHTML() {
    return readText('html');
  }

  async readPlain() {
    return readText('plain');
  }

  async readRichText() {
    return readText('rich');
  }

  async writeText(data: string) {
    return writeText(data, 'plain');
  }

  async writeRichText(data: string) {
    return writeText(data, 'rich');
  }

  async readFiles() {
    return readFiles('files');
  }

  async readFileUrls() {
    return readFiles('urls');
  }
}