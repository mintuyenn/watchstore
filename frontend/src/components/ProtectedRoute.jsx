import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Component Loading (Đồng bộ giao diện với AdminRoute)
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] bg-white">
    <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mb-4"></div>
    <p className="text-emerald-600 font-medium animate-pulse">
      Đang xác thực người dùng...
    </p>
  </div>
);

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Màn hình chờ
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 2. Chưa đăng nhập -> Chuyển về Login
  if (!user) {
    console.log("ProtectedRoute: Chưa đăng nhập. Redirect về Login.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Đã đăng nhập nhưng LÀ ADMIN -> Chuyển về Admin Dashboard
  // (Ngăn Admin vô tình đặt hàng hoặc sửa profile khách)
  if (user.role?.toLowerCase() === "admin") {
    console.log("ProtectedRoute: Phát hiện Admin. Redirect về Dashboard.");
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 4. Là Khách hàng -> Cho phép vào
  return <Outlet />;
};

export default ProtectedRoute;
