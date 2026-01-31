class Notification {
  async send(message) {
    throw new Error("send() must be implemented");
  }
}

class EmailNotification extends Notification {
  async send(message) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `Email sent: ${message}`;
  }
}

class SMSNotification extends Notification {
  async send(message) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return `SMS sent: ${message}`;
  }
}

class NotificationFactory {
  static async createNotification(type) {

    await new Promise((resolve) => setTimeout(resolve, 300));

    switch (type) {
      case "email":
        return new EmailNotification();
      case "sms":
        return new SMSNotification();
      default:
        throw new Error("Unknown notification type");
    }
  }
}

(async () => {
  const notifier = await NotificationFactory.createNotification("email");
  const result = await notifier.send("Hello Design Patterns");
  console.log(result);
})();
