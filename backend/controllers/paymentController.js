import crypto from "crypto";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { format } from "date-fns";

/**
 * Helper: Sắp xếp tham số theo A-Z
 */

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      str.push(key);
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    // Sửa lỗi quan trọng tại dòng này:
    sorted[str[key]] = obj[str[key]];
  }
  return sorted;
}

/**
 * API: Tạo URL thanh toán VNPAY
 */
const createVnpayPaymentUrl = asyncHandler(async (req, res) => {
  const { orderId, amount, language = "vn", bankCode = "" } = req.body;

  // 1. Validate dữ liệu
  if (!orderId || !amount) {
    res.status(400);
    throw new Error("Thiếu thông tin Order ID hoặc số tiền");
  }

  // 2. Config VNPAY
  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  // Kiểm tra config có tồn tại không
  if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
    res.status(500);
    throw new Error("Vui lòng cấu hình VNPAY trong file .env");
  }

  // 3. Xử lý Thời gian (Bắt buộc GMT+7)
  // Lấy giờ hiện tại, cộng thêm offset để đảm bảo đúng giờ VN dù server ở đâu
  const date = new Date();
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const vnpTime = new Date(utc + 3600000 * 7); // Cộng 7 giờ (GMT+7)

  const vnp_CreateDate = format(vnpTime, "yyyyMMddHHmmss");

  // Tạo mã giao dịch duy nhất: OrderID_HHmmss
  // Giúp user có thể thử thanh toán lại đơn hàng cũ mà không bị lỗi "Mã GD đã tồn tại"
  const vnp_TxnRef = `${orderId}_${format(vnpTime, "HHmmss")}`;

  // 4. Lấy IP (Ưu tiên hardcode 127.0.0.1 ở môi trường dev để tránh lỗi IPv6)
  const ipAddr = "127.0.0.1";

  // 5. Tạo tham số
  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: language,
    vnp_CurrCode: "VND",
    vnp_TxnRef: vnp_TxnRef,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.floor(amount) * 100, // Nhân 100, dùng Math.floor cho chắc chắn
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: vnp_CreateDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // 6. Sắp xếp object (BẮT BUỘC)
  vnp_Params = sortObject(vnp_Params);

  // 7. Ký số (Signature)
  // Logic: Duyệt qua từng key đã sort -> Encode -> Nối lại
  let signDataString = [];
  for (let key in vnp_Params) {
    if (Object.prototype.hasOwnProperty.call(vnp_Params, key)) {
      let value = vnp_Params[key];
      if (value || value === 0) {
        // Encode chuẩn VNPAY: space thành dấu +
        signDataString.push(
          encodeURIComponent(key) +
            "=" +
            encodeURIComponent(value).replace(/%20/g, "+"),
        );
      }
    }
  }
  const stringToSign = signDataString.join("&");

  // Tạo checksum
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(stringToSign, "utf-8")).digest("hex");

  // 8. Tạo URL cuối cùng
  const finalUrl = `${vnpUrl}?${stringToSign}&vnp_SecureHash=${signed}`;

  console.log("👉 VNPAY URL Created:", finalUrl);
  res.status(200).json({ paymentUrl: finalUrl });
});

/**
 * API: Xử lý VNPAY Return
 */
const vnpayReturn = asyncHandler(async (req, res) => {
  let vnp_Params = req.query;
  const secureHash = vnp_Params["vnp_SecureHash"];

  // Xóa 2 tham số hash
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  // Sắp xếp lại
  vnp_Params = sortObject(vnp_Params);

  // Tái tạo chuỗi ký
  let signDataString = [];
  for (let key in vnp_Params) {
    if (Object.prototype.hasOwnProperty.call(vnp_Params, key)) {
      let value = vnp_Params[key];
      if (value || value === 0) {
        signDataString.push(
          encodeURIComponent(key) +
            "=" +
            encodeURIComponent(value).replace(/%20/g, "+"),
        );
      }
    }
  }
  const stringToSign = signDataString.join("&");

  const secretKey = process.env.VNP_HASH_SECRET;
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(stringToSign, "utf-8")).digest("hex");

  const orderIdRaw = vnp_Params["vnp_TxnRef"];
  const orderId = orderIdRaw ? orderIdRaw.split("_")[0] : null; // Tách lấy OrderID thật
  const responseCode = vnp_Params["vnp_ResponseCode"];

  // Frontend URL
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

  // Debug log
  console.log("--- VNPAY RETURN ---");
  console.log("Checksum Client:", secureHash);
  console.log("Checksum Server:", signed);
  console.log("Response Code:", responseCode);

  if (secureHash === signed) {
    if (responseCode === "00") {
      try {
        const order = await Order.findById(orderId);
        if (order) {
          if (!order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
              id: vnp_Params["vnp_TransactionNo"],
              status: responseCode,
              update_time: vnp_Params["vnp_PayDate"],
              email_address: "vnpay_user",
            };
            await order.save();
          }
          return res.redirect(
            `${frontendUrl}/order-success?orderId=${orderId}&status=success`,
          );
        } else {
          return res.redirect(
            `${frontendUrl}/cart?status=fail&reason=order_not_found`,
          );
        }
      } catch (error) {
        return res.redirect(
          `${frontendUrl}/cart?status=fail&reason=server_error`,
        );
      }
    } else {
      return res.redirect(
        `${frontendUrl}/cart?status=fail&code=${responseCode}`,
      );
    }
  } else {
    console.error("⛔ SAI CHỮ KÝ!");
    return res.redirect(
      `${frontendUrl}/cart?status=fail&reason=invalid_signature`,
    );
  }
});

export { createVnpayPaymentUrl, vnpayReturn };
