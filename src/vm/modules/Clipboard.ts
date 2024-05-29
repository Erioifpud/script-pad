import { readFiles, readImage, readText, writeImage, writeText } from '@/utils/clipboard';

export class Clipboard {
  static async readImageBase64() {
    return readImage('base64');
  }

  static async readImageBytes() {
    return readImage('array');
  }

  static async writeImage(data: number[] | string) {
    return writeImage(data);
  }

  static async readHTML() {
    return readText('html');
  }

  static async readPlain() {
    return readText('plain');
  }

  static async readRichText() {
    return readText('rich');
  }

  static async writeText(data: string) {
    return writeText(data, 'plain');
  }

  static async writeRichText(data: string) {
    return writeText(data, 'rich');
  }

  static async readFiles() {
    return readFiles('files');
  }

  static async readFileUrls() {
    return readFiles('urls');
  }
}