import admin from './firebase'

class Notifications {
  notification = admin.messaging();

  // async addDeviceToUser(token: string | string[], user: string) {
  //   console.log(admin.apps)
  //   this.sendNotification(token)
  // }

  async sendNotification(
    token: string | string[],
    payload: admin.messaging.MessagingPayload,
    options?: admin.messaging.MessagingOptions | undefined
  ) {
    return await this.notification.sendToDevice(token, payload, options);
  }
}

export default Notifications;
