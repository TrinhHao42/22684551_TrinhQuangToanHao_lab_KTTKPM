const express = require("express");

const app = express();
app.use(express.json());

function sendEmail(order) {
  return new Promise((resolve, reject) => {
    console.log("Đang gửi email cho order:", order.email);

    setTimeout(() => {
      if (Math.random() < 0.3) {
        return reject(new Error("Gửi email thất bại"));
      }
      console.log("Gửi email thành công:", order.email);
      resolve();
    }, 4000); 
  });
}

app.post("/order", async (req, res) => {
  try {
    const email = req.body;

    const startTime = Date.now();
    const orderId = Date.now();

    const order = { id: orderId, email };
    
    await new Promise((resolve) => {
      setTimeout(() => {
        console.log("Tạo đơn hàng:", order);
        resolve();
      }, 2000);
    });
    await sendEmail(order);
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    console.log(`Hoàn thành công việc trong ${duration}s`);
    
    res.json({
      success: true,
      orderId,
      duration: `${duration}s`,
    });
  } catch (err) {
    console.error("Lỗi:", err.message);
    res.status(500).json({
      success: false,
      message: "Đặt hàng thất bại",
    });
  }
});

app.listen(3000, () => {
  console.log("Order API (NO MQ) chạy tại port 3000");
});
