import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; // Đảm bảo đường dẫn đúng
import { apiGetProfile, apiUpdateProfile } from "../services/auth";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaCamera,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function ProfilePage() {
  // Lấy thêm isLoading từ AuthContext
  const { user, login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [submitting, setSubmitting] = useState(false); // Đổi tên để tránh trùng với isLoading của Auth
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Logic load data vào form
  useEffect(() => {
    const loadProfile = async () => {
      // Chỉ chạy khi đã xác định được user (không còn loading)
      if (!isLoading) {
        if (user && !formData.email) {
          try {
            const profileData = await apiGetProfile();
            setFormData({
              fullName: profileData.fullName || "",
              email: profileData.email || "",
              phone: profileData.phone || "",
              address: profileData.address || "",
              password: "",
              confirmPassword: "",
              createdAt: profileData.createdAt || "",
            });
          } catch (err) {
            console.error("Lỗi tải profile:", err);
            setError("Không thể tải thông tin tài khoản.");
          }
        } else if (user) {
          // Fallback nếu API lỗi hoặc dùng data từ context
          setFormData((prev) => ({
            ...prev,
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            address: user.address || "",
          }));
        }
      }
    };
    loadProfile();
  }, [user, isLoading]); // Thêm isLoading vào dependency

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setSuccess("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password && formData.password.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);
    try {
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await apiUpdateProfile(updateData);
      login(updatedUser);
      setSuccess("Cập nhật hồ sơ thành công!");
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      console.error("Lỗi cập nhật profile:", err);
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- QUAN TRỌNG: Màn hình chờ khi đang check login ---
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0B0F14] flex items-center justify-center">
        <div className="text-[#C9A24D] text-lg font-bold flex items-center gap-3 animate-pulse">
          {/* SVG Loading Spinner */}
          <svg
            className="animate-spin h-8 w-8"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  // --- Nếu check xong mà không có user (chưa đăng nhập) ---
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center pt-20">
        <div className="text-xl mb-4">Bạn chưa đăng nhập.</div>
        <a
          href="/login"
          className="px-6 py-2 bg-[#C9A24D] text-black font-bold rounded hover:bg-white transition"
        >
          Đăng nhập ngay
        </a>
      </div>
    );
  }

  // --- Render chính (giữ nguyên UI cũ) ---
  return (
    <div className="min-h-screen w-full bg-[#0B0F14] text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
            My Account
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
            Hồ Sơ Của Bạn
          </h1>
          <p className="mt-2 text-gray-400 font-light">
            Quản lý thông tin cá nhân và bảo mật tài khoản.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#050505] border border-white/10 rounded-lg shadow-2xl overflow-hidden relative">
          {/* Decorative Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A24D]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="md:flex">
            {/* --- LEFT COLUMN: AVATAR & SUMMARY --- */}
            <div className="md:w-1/3 bg-[#0F1116] p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col items-center justify-center text-center">
              <div className="relative group mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-[#C9A24D]/20 overflow-hidden shadow-lg group-hover:border-[#C9A24D] transition-colors duration-300">
                  <img
                    src={
                      user?.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        (formData.fullName || "User") +
                        "&background=0D0D0D&color=C9A24D&size=256"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-0 right-0 bg-[#C9A24D] text-black p-2 rounded-full shadow-lg hover:bg-white transition-colors">
                  <FaCamera size={14} />
                </button>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {formData.fullName || "Thành viên"}
              </h3>
              <p className="text-[#C9A24D] text-sm uppercase tracking-wider mb-4">
                Member
              </p>
            </div>

            {/* --- RIGHT COLUMN: EDIT FORM --- */}
            <div className="md:w-2/3 p-8">
              {/* Alerts */}
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded flex items-center gap-3 text-sm">
                  <FaExclamationCircle /> {error}
                </div>
              )}
              {success && (
                <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded flex items-center gap-3 text-sm">
                  <FaCheckCircle /> {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info Group */}
                <div className="space-y-5">
                  <h4 className="text-white text-sm font-bold uppercase tracking-widest border-l-2 border-[#C9A24D] pl-3 mb-4">
                    Thông tin cá nhân
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup
                      label="Họ và tên"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      icon={<FaUser />}
                    />
                    <InputGroup
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      icon={<FaEnvelope />}
                      disabled={true}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup
                      label="Số điện thoại"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      icon={<FaPhone />}
                    />
                    <InputGroup
                      label="Địa chỉ"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      icon={<FaMapMarkerAlt />}
                    />
                  </div>
                </div>

                {/* Security Group */}
                <div className="space-y-5 pt-4">
                  <h4 className="text-white text-sm font-bold uppercase tracking-widest border-l-2 border-[#C9A24D] pl-3 mb-4">
                    Bảo mật
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup
                      label="Mật khẩu mới"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      icon={<FaLock />}
                      placeholder="••••••••"
                    />
                    <InputGroup
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      icon={<FaLock />}
                      placeholder="••••••••"
                    />
                  </div>
                  <p className="text-xs text-gray-500 italic mt-2">
                    * Để trống nếu không muốn đổi mật khẩu.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center justify-center gap-2 py-3 px-8 bg-[#C9A24D] text-[#0B0F14] font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(201,162,77,0.4)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>Đang xử lý...</>
                    ) : (
                      <>
                        <FaSave /> Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Dark Mode Input Component (Giữ nguyên)
const InputGroup = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  icon,
  placeholder,
  disabled,
}) => (
  <div>
    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#C9A24D] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`appearance-none block w-full pl-10 pr-3 py-3 border border-white/10 rounded bg-[#0F172A] text-white placeholder-gray-600 focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D] transition-all duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        placeholder={placeholder}
      />
    </div>
  </div>
);
