import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt; // Đọc cookie 'jwt'

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB bằng ID từ token
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Token hợp lệ nhưng không tìm thấy người dùng");
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Token không hợp lệ, không có quyền truy cập");
    }
  } else {
    res.status(401);
    throw new Error("Chưa đăng nhập, không có quyền truy cập");
  }
});

const admin = (req, res, next) => {
  // Kiểm tra (dùng toLowerCase để an toàn)
  if (req.user && req.user.role && req.user.role.toLowerCase() === "admin") {
    next(); // Là admin, đi tiếp
  } else {
    res.status(403); // 403 Forbidden
    throw new Error("Không có quyền Admin");
  }
};
const customer = (req, res, next) => {
  // Kiểm tra role là 'customer' (dùng toLowerCase cho chắc chắn)
  if (req.user && req.user.role && req.user.role.toLowerCase() === "customer") {
    next();
  } else {
    res.status(403); // 403 Forbidden
    throw new Error("Chức năng chỉ dành cho Khách hàng");
  }
};

export { protect, admin, customer };
