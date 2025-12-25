import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiLogin } from "../services/auth";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleGoogleLogin = () => {
    window.open(`${API_URL}/api/users/auth/google`, "_self");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const userData = await apiLogin({ email, password });
      login(userData);
      if (userData && userData.role === "admin") {
        navigate("/admin/products");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Email hoặc mật khẩu không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0B0F14]">
      {/* --- LEFT SIDE: IMAGE & BRANDING --- */}
      <div className="hidden lg:flex w-1/2 bg-black relative items-center justify-center overflow-hidden">
        {/* HÌNH ẢNH DỌC (PORTRAIT) - VỪA KHÍT KHUNG */}
        <img
          // Link hình ảnh dọc (Vertical)
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop"
          alt="Luxury Watch Background"
          // object-cover: Lấp đầy khung mà không bị méo
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />

        {/* Lớp phủ gradient để chữ dễ đọc hơn */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-black/60"></div>

        {/* Text Content */}
        <div className="relative z-10 p-12 text-center">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tighter drop-shadow-2xl">
            TIMELESS <span className="text-[#C9A24D]">LEGACY</span>
          </h2>
          <p className="text-gray-200 text-lg font-light max-w-md mx-auto leading-relaxed drop-shadow-md border-t border-[#C9A24D]/30 pt-6">
            "Đẳng cấp không chỉ là sở hữu, mà là sự cảm nhận từng nhịp đập của
            thời gian."
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#0B0F14] relative z-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24D]/10 rounded-bl-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
              Welcome Back
            </span>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
              Đăng Nhập
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Nhập thông tin để truy cập vào bộ sưu tập của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#C9A24D] transition-colors">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/10 rounded bg-[#0F172A] text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] transition-all duration-300"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#C9A24D] transition-colors">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/10 rounded bg-[#0F172A] text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-sm text-[#0B0F14] bg-[#C9A24D] hover:bg-white hover:shadow-[0_0_30px_rgba(201,162,77,0.5)] transition-all duration-500 shadow-[0_4px_14px_0_rgba(201,162,77,0.39)] disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Social Links */}
          <div className="space-y-6">
            <div className="relative flex items-center justify-center text-sm">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative bg-[#0B0F14] px-2 text-gray-500 uppercase text-xs">
                Hoặc
              </span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-sm text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <FaGoogle className="mr-2" /> Google
            </button>

            <p className="text-center text-sm text-gray-500">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="font-bold text-[#C9A24D] hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
