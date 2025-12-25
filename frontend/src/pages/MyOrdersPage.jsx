import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaChevronRight,
  FaShoppingBag,
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTruck,
  FaClock,
} from "react-icons/fa";

// --- Component Spinner ---
const Spinner = () => (
  <FaSpinner className="animate-spin text-3xl text-[#C9A24D]" />
);

// --- Helper định dạng ngày giờ ---
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

// --- Helper định dạng tiền ---
const formatCurrency = (amount) => amount.toLocaleString("vi-VN") + " ₫";

// --- Helper lấy trạng thái đơn hàng (Dark Mode Optimized) ---
const getUserOrderStatus = (order) => {
  if (order.isDelivered) {
    return {
      text: "Đã giao hàng",
      className: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: <FaCheckCircle />,
    };
  }
  if (order.isPaid || order.paymentMethod === "cod") {
    return {
      text: "Đang xử lý",
      className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: <FaTruck />,
    };
  }
  return {
    text: "Chờ thanh toán",
    className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: <FaClock />,
  };
};

// --- Component Chính ---
export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(`${API_URL}/api/orders/myorders`, {
          withCredentials: true,
        });
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Lỗi không xác định.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white py-12 px-4 relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A24D]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
          <div className="p-3 bg-[#C9A24D]/10 rounded-sm text-[#C9A24D]">
            <FaBoxOpen size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest text-white">
              Lịch sử đơn hàng
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Quản lý và theo dõi trạng thái đơn hàng của bạn
            </p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/30 p-4 rounded-sm flex items-center gap-3 text-red-400">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Spinner />
            <p className="text-gray-400 animate-pulse">Đang tải dữ liệu...</p>
          </div>
        ) : orders.length === 0 && !error ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-[#12161C] border border-white/5 rounded-sm">
            <div className="w-20 h-20 bg-[#1A1F29] rounded-full flex items-center justify-center text-gray-600 mb-4">
              <FaShoppingBag size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-400 mb-6">
              Bạn chưa mua sắm sản phẩm nào tại cửa hàng.
            </p>
            <Link
              to="/"
              className="bg-[#C9A24D] text-[#0B0F14] px-6 py-3 font-bold uppercase tracking-wider rounded-sm hover:bg-white transition-all duration-300"
            >
              Bắt đầu mua sắm
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getUserOrderStatus(order);
              return (
                <div
                  key={order._id}
                  className="group bg-[#12161C] border border-white/5 rounded-sm overflow-hidden hover:border-[#C9A24D]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_15px_rgba(201,162,77,0.05)]"
                >
                  {/* Order Header */}
                  <div className="bg-[#1A1F29] px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs uppercase tracking-wider">
                          Mã đơn hàng
                        </span>
                        <span className="font-mono text-[#C9A24D] font-bold">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <FaCalendarAlt />
                        {formatDateTime(order.createdAt)}
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border text-xs font-bold uppercase tracking-wide ${status.className}`}
                    >
                      {status.icon}
                      {status.text}
                    </div>
                  </div>

                  {/* Order Items (Preview) */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-[#0B0F14] border border-white/10 rounded-sm flex-shrink-0 overflow-hidden">
                            <img
                              src={
                                item.image.startsWith("http")
                                  ? item.image
                                  : `/${item.image}`
                              }
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-sm font-medium text-white truncate group-hover:text-[#C9A24D] transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Số lượng:{" "}
                              <span className="text-gray-300">{item.qty}</span>
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-mono text-gray-300">
                              {formatCurrency(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="px-6 py-4 bg-[#1A1F29]/50 border-t border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-gray-500" />
                      <span className="text-gray-400 text-sm">Tổng tiền:</span>
                      <span className="text-lg font-bold text-[#C9A24D] font-mono">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>

                    <Link
                      to={`/order/${order._id}`}
                      className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#C9A24D] transition-colors uppercase tracking-wider"
                    >
                      Chi tiết <FaChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
