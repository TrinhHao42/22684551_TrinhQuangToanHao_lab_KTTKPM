const readline = require("readline");

class OrderState {
  handle(order) {}
  getName() {}
}

class NewState extends OrderState {
  handle() {
    console.log("🆕 Phase 1 - Mới tạo: Kiểm tra thông tin đơn hàng");
  }
  getName() {
    return "NEW";
  }
}

class ProcessingState extends OrderState {
  handle() {
    console.log("📦 Phase 2 - Đang xử lý: Đóng gói và vận chuyển");
  }
  getName() {
    return "PROCESSING";
  }
}

class DeliveredState extends OrderState {
  handle() {
    console.log("✅ Phase 3 - Đã giao: Cập nhật trạng thái đơn hàng");
  }
  getName() {
    return "DELIVERED";
  }
}

class CancelledState extends OrderState {
  handle() {
    console.log("❌ Phase X - Hủy: Hủy đơn hàng và hoàn tiền");
  }
  getName() {
    return "CANCELLED";
  }
}

class OrderContext {
  constructor() {
    this.state = new NewState();
  }

  showState() {
    console.log("👉 Trạng thái hiện tại:", this.state.getName());
  }

  process() {
    this.state.handle(this);
  }

  next() {
    if (this.state instanceof NewState) {
      this.setState(new ProcessingState());
    } else if (this.state instanceof ProcessingState) {
      this.setState(new DeliveredState());
    } else {
      console.log("⚠️ Không thể chuyển phase tiếp theo");
    }
  }

  cancel() {
    this.setState(new CancelledState());
  }

  setState(state) {
    this.state = state;
    console.log("🔁 Chuyển sang trạng thái:", state.getName());
  }
}

class ShippingStrategy {
  calculateFee() {}
  getName() {}
}

class FastShipping extends ShippingStrategy {
  calculateFee() {
    return 50;
  }
  getName() {
    return "FAST";
  }
}

class NormalShipping extends ShippingStrategy {
  calculateFee() {
    return 20;
  }
  getName() {
    return "NORMAL";
  }
}

class ShippingContext {
  setStrategy(strategy) {
    this.strategy = strategy;
    console.log("🚚 Phương thức vận chuyển:", strategy.getName());
  }

  getFee() {
    return this.strategy.calculateFee();
  }
}

class OrderService {
  cost() {}
}

class BasicOrder extends OrderService {
  cost() {
    return 200;
  }
}

class OrderDecorator extends OrderService {
  constructor(order) {
    super();
    this.order = order;
  }
  cost() {
    return this.order.cost();
  }
}

class GiftWrap extends OrderDecorator {
  cost() {
    return super.cost() + 30;
  }
}

class Insurance extends OrderDecorator {
  cost() {
    return super.cost() + 40;
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("\n===== ORDER SYSTEM (CHỌN VẬN CHUYỂN) =====");

const order = new OrderContext();
const shippingContext = new ShippingContext();

order.showState();
order.process();

rl.question(
  "\n👉 Chọn phương thức vận chuyển (fast / normal): ",
  (answer) => {
    if (answer === "fast") {
      shippingContext.setStrategy(new FastShipping());
    } else if (answer === "normal") {
      shippingContext.setStrategy(new NormalShipping());
    } else {
      console.log("❌ Không hợp lệ, dùng mặc định NORMAL");
      shippingContext.setStrategy(new NormalShipping());
    }

    console.log("💸 Phí vận chuyển:", shippingContext.getFee());

    order.next();
    order.process();

    order.next();
    order.process();

    const finalOrder = new Insurance(new GiftWrap(new BasicOrder()));
    console.log("💰 Tổng tiền:", finalOrder.cost());

    rl.close();
  }
);
