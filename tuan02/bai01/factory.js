import readline from "readline";

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  try {
    const type = await ask("Nhập loại thông báo (email | sms): ");
    const message = await ask("Nhập nội dung thông báo: ");

    const notifier = await NotificationFactory.createNotification(type.trim());
    const result = await notifier.send(message);

    console.log(result);
  } catch (error) {
    console.error("Lỗi:", error.message);
  } finally {
    rl.close();
  }
})();
