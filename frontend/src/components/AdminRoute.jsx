import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Component Loading nội bộ (để code gọn trong 1 file)
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="animate-spin h-10 w-10 border-4 border-emerald-600 border-t-transparent rounded-full mb-4"></div>
    <p className="text-gray-500 font-medium animate-pulse">
      Đang kiểm tra quyền Admin...
    </p>
  </div>
);

const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Màn hình chờ khi đang fetch API profile
  if (isLoading) {
    return <LoadingScreen />;
  }

  // 2. Chưa đăng nhập -> Chuyển về Login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 3. Đã đăng nhập nhưng KHÔNG PHẢI ADMIN -> Chuyển về Trang chủ
  // Dùng toLowerCase() để an toàn (Admin == admin)
  if (user.role?.toLowerCase() !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4. Là Admin xịn -> Cho phép vào
  return <Outlet />;
};

export default AdminRoute;
