import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  // 1. Tạo token
  const token = jwt.sign(
    { userId }, // Nội dung token
    process.env.JWT_SECRET, // Lấy khóa bí mật từ file .env
    { expiresIn: "7d" } // Hết hạn 7 ngày
  );

  // 2. Gửi token qua Cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Chỉ server được đọc
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày (tính bằng mili giây)
  });
};

export default generateToken;
