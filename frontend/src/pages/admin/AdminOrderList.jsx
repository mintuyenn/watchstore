import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle,
  Truck,
  Eye,
  Clock,
  Trash2,
  Filter,
  Search,
  ShoppingBag,
  AlertTriangle,
  X,
  CreditCard,
  Package,
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

// 2. Status Badge (Luxury Style: Outline)
const StatusBadge = ({ order }) => {
  if (order.isDelivered) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-emerald-500 text-emerald-600 text-[10px] uppercase font-bold tracking-widest bg-emerald-50">
        <CheckCircle size={12} /> Hoàn Thành
      </span>
    );
  }
  if (order.isPaid) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-blue-500 text-blue-600 text-[10px] uppercase font-bold tracking-widest bg-blue-50">
        <CreditCard size={12} /> Đã Thanh Toán
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-amber-500 text-amber-600 text-[10px] uppercase font-bold tracking-widest bg-amber-50">
      <Clock size={12} /> Chờ Xử Lý
    </span>
  );
};

// 3. Confirm Modal
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  confirmText = "Xác nhận",
  type = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-md shadow-2xl border border-neutral-200 animate-in fade-in zoom-in duration-200">
        <div className="bg-neutral-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            {type === "danger" ? (
              <AlertTriangle size={18} className="text-amber-500" />
            ) : (
              <Package size={18} className="text-emerald-500" />
            )}
            {title}
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
            className={`text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-2 transition-all
              ${
                type === "danger"
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
              }
            `}
          >
            {isLoading && <Spinner size="h-3 w-3" color="text-white" />}{" "}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- HELPER FORMAT ---
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// --- COMPONENT CHÍNH ---
export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filterActive, setFilterActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "danger", // 'danger' | 'success'
    actionType: "", // 'delete' | 'deliver'
    orderId: null,
    title: "",
    message: "",
    confirmText: "",
    isLoading: false,
  });

  // Fetch Orders
  const fetchAdminOrders = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams(searchParams);
      const startDate = params.get("startDate");
      const endDate = params.get("endDate");
      const isPaid = params.get("isPaid");
      const view = params.get("view");

      setFilterActive(!!(startDate || endDate || isPaid || view));

      const { data } = await axios.get("/api/orders", {
        params: Object.fromEntries(params),
      });

      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      toast.error(
        `Lỗi tải đơn hàng: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, [searchParams]);

  // --- LOGIC MODAL & ACTIONS ---

  const openDeliverModal = (orderId) => {
    setModalConfig({
      isOpen: true,
      type: "success",
      actionType: "deliver",
      orderId,
      title: "Xác nhận giao hàng",
      message: "Xác nhận đơn hàng này đã được giao thành công đến khách hàng?",
      confirmText: "Hoàn Tất Đơn",
      isLoading: false,
    });
  };

  const openDeleteModal = (orderId) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      actionType: "delete",
      orderId,
      title: "Xóa đơn hàng",
      message:
        "Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng này? Hành động này không thể hoàn tác.",
      confirmText: "Xóa Vĩnh Viễn",
      isLoading: false,
    });
  };

  const handleConfirmAction = async () => {
    const { actionType, orderId } = modalConfig;
    setModalConfig((prev) => ({ ...prev, isLoading: true }));
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      if (actionType === "deliver") {
        await axios.put(`${API_URL}/api/orders/${orderId}/deliver`);
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                  ...o,
                  isDelivered: true,
                  deliveredAt: new Date().toISOString(),
                }
              : o
          )
        );
        toast.success("Cập nhật trạng thái giao hàng thành công!");
      } else if (actionType === "delete") {
        await axios.delete(`${API_URL}/api/orders/${orderId}`);
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
        toast.success("Đã xóa đơn hàng thành công!");
      }
      closeModal();
    } catch (err) {
      toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
      setModalConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Client-side Filter (Search by ID or Customer Name)
  const filteredOrders = orders.filter(
    (order) =>
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.fullName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans min-h-screen pb-20">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#171717", color: "#fff", fontSize: "14px" },
        }}
      />

      <ConfirmModal
        {...modalConfig}
        onClose={closeModal}
        onConfirm={handleConfirmAction}
      />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-3">
            <span className="w-10 h-1 bg-amber-500 block"></span>
            Đơn Hàng
          </h1>
          <p className="text-neutral-500 mt-2 text-sm font-light tracking-wide">
            Quản lý vận đơn & doanh thu ({orders.length})
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              placeholder="MÃ ĐƠN / TÊN KHÁCH..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-0 w-full sm:w-72 transition-all placeholder:text-neutral-300 text-neutral-800 uppercase tracking-wider font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- FILTER ALERT --- */}
      {filterActive && !loading && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 flex items-center justify-between gap-4 animate-fade-in-down">
          <div className="flex items-center gap-2 text-amber-800">
            <Filter size={18} />
            <p className="text-sm font-medium">
              Đang hiển thị danh sách đã lọc (theo ngày/trạng thái).
            </p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold uppercase tracking-wider text-amber-900 underline hover:text-amber-600"
            onClick={() => setFilterActive(false)}
          >
            Xóa bộ lọc
          </Link>
        </div>
      )}

      {/* --- TABLE CONTENT --- */}
      <div className="bg-white border border-neutral-200 shadow-xl shadow-neutral-100/50">
        {loading ? (
          <div className="text-center py-24">
            <Spinner size="h-10 w-10" color="text-neutral-800" />
            <p className="text-neutral-400 mt-4 text-xs uppercase tracking-widest">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 px-4">
            <ShoppingBag
              size={48}
              className="text-neutral-200 mx-auto mb-4 stroke-1"
            />
            <h3 className="text-lg font-medium text-neutral-900 uppercase tracking-wider">
              Chưa có đơn hàng
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-900 text-amber-500">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Mã ĐH
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Khách Hàng
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Thời gian
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-right border-b-2 border-amber-600">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-center border-b-2 border-amber-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-right border-b-2 border-amber-600">
                    Tác vụ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-neutral-500 group-hover:text-amber-600 transition-colors">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-neutral-900 font-serif">
                        {order.user?.fullName || (
                          <span className="text-neutral-400 italic font-sans font-light">
                            Khách vãng lai
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-neutral-500 font-mono">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-bold text-neutral-900 font-mono">
                        {order.totalPrice.toLocaleString("vi-VN")} ₫
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StatusBadge order={order} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút Xem chi tiết */}
                        <Link
                          to={`/order/${order._id}`}
                          className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-sm transition-all"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} strokeWidth={1.5} />
                        </Link>

                        {/* Nút Giao hàng (Chỉ hiện khi chưa giao) */}
                        {!order.isDelivered && (
                          <button
                            onClick={() => openDeliverModal(order._id)}
                            className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-sm transition-all"
                            title="Xác nhận giao hàng"
                          >
                            <Truck size={18} strokeWidth={1.5} />
                          </button>
                        )}

                        {/* Nút Xóa */}
                        <button
                          onClick={() => openDeleteModal(order._id)}
                          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all"
                          title="Xóa đơn hàng"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>
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
