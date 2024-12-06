import { randomUUID } from '@/store/utils';

export class UUID {
  generate() {
    return randomUUID();
  }
}