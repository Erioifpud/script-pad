import { randomUUID } from '@/store/utils';

export class UUID {
  async generate() {
    return randomUUID();
  }
}