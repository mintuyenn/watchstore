import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin, customer } from "../middleware/authMiddleware.js";
import passport from "passport";
import generateToken from "../utils/generateToken.js";

// --- Các route cơ bản ---
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post(protect, logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route("/").get(protect, admin, getUsers);

router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// --- 1. Route bắt đầu đăng nhập Google (ĐÃ SỬA LỖI) ---
router.get(
  "/auth/google",
  passport.authenticate("google", { session: false }) // Không cần scope ở đây nữa
);

// --- 2. Route Callback (ĐÃ SỬA REDIRECT CHO CHUẨN) ---
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login", // Bạn nên thay bằng link frontend login page nếu muốn
  }),
  (req, res) => {
    generateToken(res, req.user._id);
    const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

    res.redirect(frontendURL);
  }
);

export default router;
