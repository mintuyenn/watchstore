import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js"; // Import middleware

router.route("/").get(getProducts).post(protect, admin, createProduct); // Bảo vệ route POST
router.route("/:id/reviews").post(protect, createProductReview);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct) // Bảo vệ route PUT
  .delete(protect, admin, deleteProduct); // Bảo vệ route DELETE

export default router;
