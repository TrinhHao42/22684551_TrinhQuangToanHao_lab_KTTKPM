# CMS Layered (Express + EJS + MongoDB)

Project theo mô hình phân lớp:

- UI (EJS)
- Controller
- Service
- Repository
- Model (Mongoose)
- Database (MongoDB)

## Chức năng

- Quản lý nội dung (tạo/sửa/xóa/đăng)
- Quản lý người dùng và phân quyền (admin/editor/contributor)
- Quản lý menu điều hướng

## Chạy project

1. Copy `.env.example` thành `.env`
2. Đảm bảo MongoDB đang chạy
3. Chạy lệnh:

```bash
npm install
npm run dev
```

Mặc định: `http://localhost:3000`

Tài khoản seed sẵn: `admin / admin123`
