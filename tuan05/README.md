# Bài 3: Service-Based Architecture

## Cách  làm trong bài 3 này:

Trong bài thực hành này,  đã thiết kế và triển khai một hệ thống theo kiến trúc Microservices sử dụng Spring Boot cho backend và một giao diện web HTML cơ bản cho frontend. Kiến trúc bao gồm các service cụ thể:

1. **Khởi tạo cơ sở dữ liệu:**
    đã thiết lập file `docker-compose.yaml` để chạy một container **MariaDB**. Database này sẽ cung cấp nơi lưu trữ dữ liệu chung hoặc riêng biệt cho các microservice.

2. **Xây dựng các Backend Services (Spring Boot):**
   - **Order Service (`orderService` - port `8081`)**: Quản lý các đơn hàng.
   - **Payment Service (`paymentService` - port `8082`)**: Xử lý các tác vụ thanh toán.
   - **Shipping Service (`shippingService` - port `8083`)**: Quản lý giao dịch vận chuyển.
   
   Mỗi service hoạt động độc lập và phơi bày (expose) các API RESTful của riêng nó.

3. **Thiết lập API Gateway (`apiGateway` - port `8080`)**:
   - Sử dụng **Spring Cloud Gateway (WebMVC)** để làm cổng giao tiếp duy nhất giữa Frontend và hệ thống Backend.
   - Thay vì frontend gọi trực tiếp port `8081`, `8082`, hay `8083`,  đã config các routes (trong file `application.yaml`) để API Gateway định tuyến request:
     - `/orders/**` → Route tới `http://localhost:8081`
     - `/payments/**` → Route tới `http://localhost:8082`
     - `/shippings/**` → Route tới `http://localhost:8083`
   - Cấu hình giải quyết lỗi **CORS Policy**, cho phép frontend được quyền gọi API thông qua Gateway.

![alt text](minhchung/bai3_chay_cac_service.png)

4. **Tích hợp Frontend (`frontend/index.html`)**:
   -  tạo một giao diện Web đơn giản (Single Page) hoàn toàn gọi qua địa chỉ `http://localhost:8080` (API Gateway) để thao tác lấy dữ liệu và hiển thị lên màn hình.
   - Việc gọi thông qua Gateway giúp bảo mật đường link gốc của các service backend và quy hoạch dễ dàng.

## Kết quả đạt được:
- Ứng dụng chạy thành công trọn vẹn mô hình Microservices thay vì Monolithic.
- Giao diện có thể gọi và hiển thị được dữ liệu từ các service (order, payment, shipping) một cách hoàn hảo thông qua cổng API Gateway duy nhất quản lý luồng dữ liệu.
![alt text](minhchung/bai3_order_create.png) ![alt text](minhchung/bai3_order_delete.png) ![alt text](minhchung/bai3_order_getAll.png) ![alt text](minhchung/bai3_order_getById.png) ![alt text](minhchung/bai3_order_update.png) ![alt text](minhchung/bai3_payment_create.png) ![alt text](minhchung/bai3_payment_delete.png) ![alt text](minhchung/bai3_payment_getAll.png) ![alt text](minhchung/bai3_payment_getById.png) ![alt text](minhchung/bai3_payment_update.png) ![alt text](minhchung/bai3_shipping_create.png) ![alt text](minhchung/bai3_shipping_delete.png) ![alt text](minhchung/bai3_shipping_getAll.png) ![alt text](minhchung/bai3_shipping_getById.png) ![alt text](minhchung/bai3_shipping_update.png)