import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/paymentRoutes.js";
import passport from "passport";
import "./config/passport.js";

// --- IMPORT CÁC ROUTE ---
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

// --- IMPORT ERROR MIDDLEWARE ---
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Cấu hình
dotenv.config();
connectDB();
const app = express();
// 👇 THÊM DÒNG NÀY (Bắt buộc khi deploy Railway/Heroku/Vercel)
app.set("trust proxy", 1);

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://watchstoree-production.up.railway.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// --- API ROUTES ---
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment", paymentRoutes);
app.use(passport.initialize());

// --- Xử lý Uploads (Static) ---
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// --- ERROR HANDLING MIDDLEWARES ---
app.use(notFound); //
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server đang chạy tại port ${PORT}`)
);
