import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/api/notification';

export class Notice {
  static async send(title: string, body: string = '') {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
      const permission = await requestPermission();
      permissionGranted = permission === 'granted';
    }
    if (!permissionGranted) {
      return;
    }
    sendNotification({ body, title });
  }
}