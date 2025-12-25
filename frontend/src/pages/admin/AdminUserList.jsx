import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Trash2,
  Search,
  Users,
  ShieldCheck,
  User,
  Mail,
  AlertTriangle,
  X,
  Lock,
} from "lucide-react";

// --- COMPONENTS CON (REUSABLE) ---

// 1. Spinner Gold
const Spinner = ({ size = "h-4 w-4", color = "text-amber-600" }) => (
  <svg
    className={`animate-spin ${size} ${color}`}
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
);

// 2. Role Badge (Luxury Style)
const RoleBadge = ({ role }) => {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-amber-500 bg-amber-500/5 text-amber-700 text-[10px] uppercase font-bold tracking-widest">
        <ShieldCheck size={12} className="text-amber-600" /> QUẢN TRỊ VIÊN
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-neutral-300 text-neutral-600 text-[10px] uppercase font-bold tracking-widest">
      <User size={12} /> KHÁCH HÀNG
    </span>
  );
};

// 3. Confirm Modal (Đồng bộ với Product List)
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-md shadow-2xl border border-neutral-200 animate-in fade-in zoom-in duration-200">
        <div className="bg-neutral-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> {title}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 text-center">
          <p className="text-neutral-600 text-lg font-light leading-relaxed">
            {message}
          </p>
        </div>
        <div className="bg-neutral-50 px-6 py-4 flex gap-4 justify-end border-t border-neutral-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            {isLoading && <Spinner size="h-3 w-3" color="text-white" />} Xóa
            Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT CHÍNH ---
export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // State Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    userId: null,
    userName: "",
    isLoading: false,
  });

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/users");
      if (Array.isArray(data)) setUsers(data);
    } catch (err) {
      toast.error(
        `Lỗi tải dữ liệu: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  // Logic Mở Modal Xóa
  const confirmDelete = (userId, userName, userRole) => {
    if (userRole === "admin") {
      toast.error("Không thể xóa tài khoản Quản trị viên!");
      return;
    }
    setModalConfig({
      isOpen: true,
      userId,
      userName,
      isLoading: false,
    });
  };

  // Logic Thực hiện Xóa
  const handleDelete = async () => {
    const { userId } = modalConfig;
    if (!userId) return;

    setModalConfig((prev) => ({ ...prev, isLoading: true }));
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("Đã xóa người dùng thành công");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa người dùng");
      setModalConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const closeModal = () => {
    setModalConfig({
      isOpen: false,
      userId: null,
      userName: "",
      isLoading: false,
    });
  };

  // Filter Client-side
  const filteredUsers = users.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans min-h-screen pb-20">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#171717", color: "#fff", fontSize: "14px" },
        }}
      />

      {/* Modal Confirm */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Xác nhận xóa User"
        message={`Bạn có chắc chắn muốn xóa người dùng "${modalConfig.userName}"? Dữ liệu đơn hàng liên quan có thể bị ảnh hưởng.`}
        isLoading={modalConfig.isLoading}
      />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-3">
            <span className="w-10 h-1 bg-amber-500 block"></span>
            Người Dùng
          </h1>
          <p className="text-neutral-500 mt-2 text-sm font-light tracking-wide">
            Quản lý khách hàng & phân quyền ({users.length})
          </p>
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-amber-600 transition-colors" />
          <input
            type="text"
            placeholder="TÌM TÊN HOẶC EMAIL..."
            className="pl-10 pr-4 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-0 w-full sm:w-72 transition-all placeholder:text-neutral-300 text-neutral-800 uppercase tracking-wider font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="bg-white border border-neutral-200 shadow-xl shadow-neutral-100/50">
        {loading ? (
          <div className="text-center py-24">
            <Spinner size="h-10 w-10" color="text-neutral-800" />
            <p className="text-neutral-400 mt-4 text-xs uppercase tracking-widest">
              Đang tải danh sách...
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Users
              size={48}
              className="text-neutral-200 mx-auto mb-4 stroke-1"
            />
            <h3 className="text-lg font-medium text-neutral-900 uppercase tracking-wider">
              Không tìm thấy người dùng
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-900 text-amber-500">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Thông tin cá nhân
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Email / Liên hệ
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-center border-b-2 border-amber-600">
                    Phân quyền
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-right border-b-2 border-amber-600">
                    Tác vụ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar Placeholder */}
                        <div className="w-10 h-10 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-500 font-bold text-sm">
                          {user.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 font-serif">
                            {user.fullName || "Không tên"}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-mono">
                            ID: {user._id.slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-600">
                        <Mail size={14} className="text-amber-600" />
                        <span className="text-sm font-medium">
                          {user.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {user.role === "admin" ? (
                        <span className="text-neutral-300 cursor-not-allowed inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest">
                          <Lock size={12} /> Protected
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            confirmDelete(user._id, user.fullName, user.role)
                          }
                          className="text-neutral-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-sm"
                          title="Xóa người dùng"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
