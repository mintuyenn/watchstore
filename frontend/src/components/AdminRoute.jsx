import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Component Loading đẹp (đồng bộ với các trang khác)
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mb-4"></div>
    <p className="text-gray-500 font-medium animate-pulse">Đang xác thực...</p>
  </div>
);

const AdminRoute = () => {
  // 1. SỬA TÊN BIẾN: Đổi isLoadingAuth thành isLoading (cho khớp với AuthContext)
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 2. CHECK LOADING: Bắt buộc phải có để chờ API profile chạy xong
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 3. LOGIC CHUYỂN HƯỚNG

  // Trường hợp A: Đã đăng nhập
  if (user) {
    // SỬA: Dùng toLowerCase() để so sánh chính xác dù là 'Admin' hay 'admin'
    if (user.role?.toLowerCase() === "admin") {
      return <Outlet />; // -> Cho vào trang Admin
    } else {
      return <Navigate to="/" replace />; // -> Khách hàng đi nhầm thì đá về Home
    }
  }

  // Trường hợp B: Chưa đăng nhập -> Đá về Login
  return <Navigate to="/login" replace state={{ from: location }} />;
};

export default AdminRoute;
