import { randomUUID } from '@/store/utils';

export class UUID {
  static async generate() {
    return randomUUID();
  }
}