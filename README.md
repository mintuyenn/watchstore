# ⌚ WatchStore - Full-stack E-commerce Solution

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen)]()
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue)]()
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-success)]()

> **Dự án thương mại điện tử hoàn chỉnh với quy trình đặt hàng, quản lý tồn kho và tích hợp thanh toán trực tuyến VNPAY.**
## 🛠 Tech Stack

Dự án được xây dựng theo kiến trúc **Monorepo** và đóng gói bằng **Docker**.

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Payment:** VNPAY (Checksum validation, IPN/Return URL handling)
* **Authentication:** JWT (JSON Web Token)

### **Frontend**
* **Core:** React.js (Vite)
* **State Management:** Redux Toolkit
* **HTTP Client:** Axios (Configured with Interceptors)
* **Routing:** React Router DOM

### **DevOps & Deployment**
* **Containerization:** Docker & Docker Compose
* **Web Server:** Nginx (Reverse Proxy for Frontend)
* **Cloud Platform:** Railway

---

## 🔥 Key Features

### 🛒 Client Side
- [x] **Product Discovery:** Tìm kiếm, lọc sản phẩm.
- [x] **Shopping Cart:** Thêm/sửa/xóa sản phẩm, tính tổng tiền realtime.
- [x] **Secure Payment:** Tích hợp cổng thanh toán **VNPAY Sandbox** (Xử lý Hash security chuẩn SHA512).
- [x] **Order Tracking:** Xem lịch sử đơn hàng và trạng thái thanh toán.

### 🛡 Admin Side
- [x] **Dashboard:** Thống kê doanh thu, số lượng đơn hàng.
- [x] **Product Management:** CRUD sản phẩm, quản lý kho hàng.
- [x] **Order Management:** Cập nhật trạng thái đơn hàng (Đang xử lý/Giao hàng/Đã hủy).

---

## 🐳 Run with Docker (Recommended)

Dự án đã được cấu hình Docker đầy đủ. Chỉ cần 1 lệnh để khởi chạy toàn bộ hệ thống.

**1. Clone project**
```bash
git clone [https://github.com/username/watchstore.git](https://github.com/username/watchstore.git)
cd watchstore
