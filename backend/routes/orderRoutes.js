import express from "express";
const router = express.Router();
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getOrders,
  updateOrderToDelivered,
  deleteOrder,
  getDashboardStats,
} from "../controllers/orderController.js";
import { protect, admin, customer } from "../middleware/authMiddleware.js";

router.route("/stats").get(protect, admin, getDashboardStats);

router.route("/myorders").get(protect, customer, getMyOrders);

router
  .route("/")
  .post(protect, customer, addOrderItems) // User tạo đơn hàng
  .get(protect, admin, getOrders); // Admin lấy tất cả đơn hàng

router
  .route("/:id")
  .get(protect, getOrderById) // User/Admin lấy chi tiết
  .delete(protect, admin, deleteOrder); // Admin xóa đơn hàng

// Cập nhật thanh toán
router.route("/:id/pay").put(protect, updateOrderToPaid);

// Cập nhật giao hàng
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
