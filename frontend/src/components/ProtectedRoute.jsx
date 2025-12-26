import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-emerald-600 font-medium">
          Đang kiểm tra đăng nhập...
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedRoute: Không tìm thấy user. Redirect login.");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = user.role ? user.role.toLowerCase() : "customer";

  if (userRole === "admin") {
    return <Navigate to="/admin/products" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
