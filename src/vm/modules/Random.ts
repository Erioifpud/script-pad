import { shuffle } from 'lodash-es';
import * as seedrandom from 'seedrandom';

export class Random {
  integer(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  float(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  boolean() {
    return Math.random() >= 0.5;
  }

  shuffle<T>(array: T[]) {
    return shuffle(array);
  }

  string(length: number, chars?: string) {
    let result = '';
    const characters = chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  seed(seed: string) {
    const rng = seedrandom.alea(seed);
    return rng;
  }
}
