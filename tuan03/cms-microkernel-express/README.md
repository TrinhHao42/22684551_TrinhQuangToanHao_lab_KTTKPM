# CMS Microkernel (Express + EJS + MongoDB)

Project theo mô hình microkernel:

- Core: plugin manager, JWT auth, authorization, event hook system
- Plugins:
  - Post Plugin (quản lý nội dung)
  - User Plugin (quản lý user/role)
  - Menu Plugin (quản lý điều hướng)

## Chức năng

- Quản lý nội dung
- Quản lý người dùng và phân quyền
- Quản lý menu và điều hướng

## Chạy project

1. Copy `.env.example` thành `.env`
2. Đảm bảo MongoDB đang chạy
3. Chạy lệnh:

```bash
npm install
npm run dev
```

Mặc định: `http://localhost:3001`

Tài khoản seed sẵn: `admin / admin123`
