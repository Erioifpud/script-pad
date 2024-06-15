import { shuffle } from 'lodash-es';
import * as seedrandom from 'seedrandom';

export class Random {
  static async integer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static async float(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  static async boolean() {
    return Math.random() >= 0.5;
  }

  static async shuffle<T>(array: T[]) {
    return shuffle(array);
  }

  static async string(length: number, chars?: string) {
    let result = '';
    const characters = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static async seed(seed: string) {
    const rng = seedrandom.alea(seed);
    return rng;
  }
}
