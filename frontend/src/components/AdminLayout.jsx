import React, { useState } from "react";
import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  BarChart2,
  Users,
  LogOut,
  Home,
  Settings,
  Ticket,
  Menu,
  X,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

// --- Component NavLink ---
const AdminNavLink = ({ to, icon, children, onClick }) => (
  <NavLink
    to={to}
    end={to === "/admin"}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-yellow-600 text-white shadow-md"
          : "text-slate-300 hover:bg-slate-800 hover:text-white"
      }`
    }
  >
    {icon}
    {children}
  </NavLink>
);

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // --- Sidebar Content ---
  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-900 text-white border-r border-slate-800">
      {/* Header Sidebar */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link
          to="/admin"
          className="flex items-center gap-2 font-bold text-xl tracking-wide"
        >
          <Settings className="h-6 w-6 text-yellow-500" />
          <span>
            ADMIN<span className="text-yellow-500">PANEL</span>
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-6 space-y-1 custom-scrollbar">
        <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Tổng quan
        </p>
        <AdminNavLink
          to="/admin"
          icon={<LayoutDashboard size={18} />}
          onClick={closeMobileMenu}
        >
          Dashboard
        </AdminNavLink>

        <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">
          Quản lý cửa hàng
        </p>
        <AdminNavLink
          to="/admin/products"
          icon={<ShoppingBag size={18} />}
          onClick={closeMobileMenu}
        >
          Sản phẩm
        </AdminNavLink>
        <AdminNavLink
          to="/admin/orders"
          icon={<BarChart2 size={18} />}
          onClick={closeMobileMenu}
        >
          Đơn hàng
        </AdminNavLink>
        <AdminNavLink
          to="/admin/coupons"
          icon={<Ticket size={18} />}
          onClick={closeMobileMenu}
        >
          Mã giảm giá
        </AdminNavLink>

        <p className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mt-6 mb-2">
          Khách hàng
        </p>
        <AdminNavLink
          to="/admin/users"
          icon={<Users size={18} />}
          onClick={closeMobileMenu}
        >
          Người dùng
        </AdminNavLink>
      </nav>

      {/* Footer Sidebar */}
      <div className="border-t border-slate-800 p-4 bg-slate-950/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-9 w-9 rounded-full bg-yellow-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate w-32">
              {user?.fullName || "Admin"}
            </p>
            <p className="text-xs text-slate-400 truncate w-32">
              {user?.email}
            </p>
          </div>
        </div>

        <div className="grid gap-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-red-600/10 px-3 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:block fixed inset-y-0 left-0 z-20 w-64 shadow-xl">
        <SidebarContent />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 min-h-screen">
        {/* Header Mobile */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:hidden">
          <Link
            to="/admin"
            className="flex items-center gap-2 font-bold text-lg text-slate-800"
          >
            <Settings className="h-5 w-5 text-yellow-600" />
            <span>Admin</span>
          </Link>
          <button
            onClick={toggleMobileMenu}
            className="text-slate-600 p-2 hover:bg-gray-100 rounded-md"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Sidebar Mobile Popup */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={closeMobileMenu}
          >
            <aside
              className="absolute left-0 top-0 h-full w-64 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Nội dung trang con */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
