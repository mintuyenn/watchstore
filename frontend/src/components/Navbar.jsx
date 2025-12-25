import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Phone,
  MapPin,
  LogOut,
  ListOrdered,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // --- HÀM XỬ LÝ ---
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      navigate(`/products?keyword=${encodeURIComponent(trimmedKeyword)}`);
      setKeyword("");
      setIsOpen(false);
    } else {
      navigate("/products");
    }
  };

  const closeMobileMenu = () => setIsOpen(false);

  const getShortName = (user) => {
    const fullName = user?.fullName || user?.name || user?.username;
    if (!fullName) return "Account";
    return fullName.split(" ")[0];
  };

  const displayName =
    user?.fullName || user?.name || user?.username || "Tài khoản";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0F14]/95 backdrop-blur-md border-b border-white/5 font-sans transition-all duration-300">
      {/* --- TOP BAR (Minimalist Dark) --- */}
      <div className="bg-[#0F172A] border-b border-white/5 text-[10px] tracking-widest uppercase py-2 hidden md:block text-gray-400">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex gap-8">
            <span className="flex items-center gap-2 hover:text-white transition cursor-default">
              <Phone size={12} className="text-[#C9A24D]" />
              Hotline:{" "}
              <span className="font-bold text-white">0862.347.170</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition cursor-default">
              <MapPin size={12} className="text-[#C9A24D]" />
              Store: 112 Hồ Văn Huê, Phường 9, Quận Phú Nhuận, TP. Hồ Chí Minh
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-[#C9A24D] transition">
              Contact
            </Link>
            <span className="text-gray-700">|</span>
            <Link
              to="/policy/warranty"
              className="hover:text-[#C9A24D] transition"
            >
              Warranty Check
            </Link>
          </div>
        </div>
      </div>

      {/* --- MAIN NAVBAR --- */}
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold text-white tracking-tighter hover:opacity-90 transition"
            onClick={closeMobileMenu}
          >
            WATCH<span className="text-[#C9A24D]">STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-[0.15em] text-gray-300 uppercase">
            <NavLinkStyled to="/products?brand=G-Shock">G-Shock</NavLinkStyled>
            <NavLinkStyled to="/products?brand=Rolex">Rolex</NavLinkStyled>
            <NavLinkStyled to="/products?brand=Omega">Omega</NavLinkStyled>
            <NavLinkStyled to="/products?brand=Casio">Casio</NavLinkStyled>
            <NavLinkStyled to="/products">BỘ SƯU TẬP</NavLinkStyled>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Search Bar (Compact & Dark) */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 focus-within:border-[#C9A24D] transition-colors"
            >
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-xs text-white placeholder-gray-500 w-32 focus:w-48 transition-all duration-300"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button
                type="submit"
                aria-label="Tìm kiếm"
                className="text-gray-400 hover:text-[#C9A24D]"
              >
                <Search size={16} />
              </button>
            </form>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative text-white hover:text-[#C9A24D] transition p-1 group"
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C9A24D] text-[10px] font-bold text-black ring-2 ring-[#0B0F14]">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User Dropdown (Dark Mode) */}
            {user ? (
              <div className="relative group hidden md:block">
                <button
                  className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition focus:outline-none"
                  title={displayName}
                >
                  <User size={22} strokeWidth={1.5} />
                  <span className="hidden xl:block text-xs uppercase tracking-wider">
                    {getShortName(user)}
                  </span>
                </button>

                {/* Dropdown Content */}
                <div className="absolute right-0 top-full pt-4 w-56 hidden group-hover:block z-50">
                  <div className="bg-[#111827] rounded-sm shadow-2xl border border-white/10 py-2">
                    <div className="px-4 py-3 border-b border-white/5 mb-1">
                      <p className="text-xs text-gray-400">Xin chào,</p>
                      <p className="text-sm font-bold text-white truncate">
                        {displayName}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#C9A24D] transition"
                    >
                      <User size={14} /> Hồ sơ cá nhân
                    </Link>
                    <Link
                      to="/my-orders"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-[#C9A24D] transition"
                    >
                      <ListOrdered size={14} /> Đơn hàng
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin/products"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#C9A24D] hover:bg-white/5"
                      >
                        <Settings size={14} /> Trang quản trị
                      </Link>
                    )}
                    <hr className="my-1 border-white/5" />
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition"
                    >
                      <LogOut size={14} /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block text-xs font-bold uppercase tracking-widest text-white border border-white/20 px-5 py-2 hover:bg-white hover:text-black transition duration-300"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden text-white hover:text-[#C9A24D] transition"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- MOBILE MENU (Dark Overlay) --- */}
        {isOpen && (
          <div className="lg:hidden absolute left-0 top-full w-full bg-[#0B0F14] border-t border-white/10 shadow-2xl z-40 h-screen overflow-y-auto pb-20">
            <div className="flex flex-col p-6 space-y-6">
              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full bg-[#1F2937] border border-white/5 text-white px-4 py-3 text-sm focus:border-[#C9A24D] outline-none rounded-none"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-3 text-gray-400 hover:text-[#C9A24D]"
                >
                  <Search size={18} />
                </button>
              </form>

              {/* Links */}
              <div className="flex flex-col space-y-2">
                <MobileNavLink to="/" onClick={closeMobileMenu}>
                  Trang chủ
                </MobileNavLink>
                <MobileNavLink
                  to="/products?brand=Rolex"
                  onClick={closeMobileMenu}
                >
                  Rolex
                </MobileNavLink>
                <MobileNavLink
                  to="/products?brand=Omega"
                  onClick={closeMobileMenu}
                >
                  Omega
                </MobileNavLink>
                <MobileNavLink
                  to="/products?brand=Hublot"
                  onClick={closeMobileMenu}
                >
                  Hublot
                </MobileNavLink>
                <MobileNavLink to="/products" onClick={closeMobileMenu}>
                  Tất cả sản phẩm
                </MobileNavLink>
              </div>

              <hr className="border-white/10" />

              {/* Mobile Auth */}
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white mb-4">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-[#C9A24D]">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Đang đăng nhập</p>
                      <p className="font-bold">{displayName}</p>
                    </div>
                  </div>
                  <MobileNavLink to="/profile" onClick={closeMobileMenu}>
                    Hồ sơ cá nhân
                  </MobileNavLink>
                  <MobileNavLink to="/my-orders" onClick={closeMobileMenu}>
                    Đơn hàng
                  </MobileNavLink>
                  {user.role === "admin" && (
                    <MobileNavLink
                      to="/admin/products"
                      onClick={closeMobileMenu}
                      className="text-[#C9A24D]"
                    >
                      Trang Admin
                    </MobileNavLink>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 text-red-500 font-medium tracking-wide uppercase text-sm border-t border-white/5 mt-2"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-[#C9A24D] text-[#0B0F14] py-3 text-sm font-bold uppercase tracking-widest hover:bg-white transition"
                  onClick={closeMobileMenu}
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// --- Styled Components (Minimalist) ---

const NavLinkStyled = ({ to, children, className = "" }) => (
  <Link
    to={to}
    className={`relative group py-2 hover:text-[#C9A24D] transition-colors duration-300 ${className}`}
  >
    {children}
    {/* Underline effect */}
    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A24D] transition-all duration-300 group-hover:w-full"></span>
  </Link>
);

const MobileNavLink = ({ to, onClick, children, className = "" }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block py-3 text-gray-300 hover:text-[#C9A24D] hover:pl-2 text-sm font-medium uppercase tracking-wider transition-all border-b border-white/5 ${className}`}
  >
    {children}
  </Link>
);

export default Navbar;
