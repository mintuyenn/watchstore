import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { apiRegister } from "../services/auth";
import { FaGoogle, FaUser, FaEnvelope, FaLock } from "react-icons/fa";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userData = await apiRegister({ fullName, email, password });
      login(userData);
      navigate("/");
    } catch (err) {
      setError(err.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0B0F14]">
      {/* --- LEFT SIDE: IMAGE (Cận cảnh bộ máy - Mechanical) --- */}
      <div className="hidden lg:flex w-1/2 bg-black relative items-center justify-center overflow-hidden">
        <img
          // Hình ảnh bộ máy đồng hồ (Gears/Movement) tượng trưng cho việc thiết lập tài khoản
          src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2574&auto=format&fit=crop"
          alt="Luxury Watch Movement"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-black/60"></div>

        <div className="relative z-10 p-12 text-center">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tighter drop-shadow-2xl">
            JOIN THE <span className="text-[#C9A24D]">ELITE</span>
          </h2>
          <p className="text-gray-200 text-lg font-light max-w-md mx-auto leading-relaxed drop-shadow-md border-t border-[#C9A24D]/30 pt-6">
            "Trở thành thành viên để sở hữu những tuyệt tác thời gian độc
            quyền."
          </p>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 bg-[#0B0F14] relative z-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24D]/10 rounded-bl-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
              Membership
            </span>
            <h2 className="text-3xl font-bold text-white uppercase tracking-wide">
              Đăng Ký thành viên
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Tạo tài khoản mới hoàn toàn miễn phí.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded text-center animate-pulse">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                  Họ và tên
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#C9A24D] transition-colors">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/10 rounded bg-[#0F172A] text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] transition-all duration-300"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
              </div>

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

              {/* Password Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      minLength="6"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/10 rounded bg-[#0F172A] text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] transition-all duration-300"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                    Nhập lại
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#C9A24D] transition-colors">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/10 rounded bg-[#0F172A] text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] transition-all duration-300"
                      placeholder="••••••"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-sm text-[#0B0F14] bg-[#C9A24D] hover:bg-white hover:shadow-[0_0_30px_rgba(201,162,77,0.5)] transition-all duration-500 shadow-[0_4px_14px_0_rgba(201,162,77,0.39)] disabled:opacity-70"
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
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
              className="w-full flex items-center justify-center px-4 py-3 border border-white/10 rounded-sm text-sm font-medium text-gray-300 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-300"
            >
              <FaGoogle className="mr-2" /> Google
            </button>

            <p className="text-center text-sm text-gray-500">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-bold text-[#C9A24D] hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
