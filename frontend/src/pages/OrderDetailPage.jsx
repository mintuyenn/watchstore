import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import {
  FaArrowLeft,
  FaUser,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaCheckCircle,
  FaClock,
  FaBoxOpen,
  FaTruck,
  FaMoneyBillWave,
  FaStar,
  FaSpinner,
  FaExclamationTriangle,
  FaReceipt,
} from "react-icons/fa";
import ProductReviewModal from "../components/ProductReviewModal";

// --- Helper định dạng ngày giờ ---
const formatDateTime = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  try {
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Ngày không hợp lệ";
  }
};

// --- Helper định dạng tiền ---
const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    return "0 ₫";
  }
  return amount.toLocaleString("vi-VN") + " ₫";
};

// --- Component Spinner ---
const Spinner = () => (
  <FaSpinner className="animate-spin text-4xl text-[#C9A24D]" />
);

// --- Component Chính ---
export default function OrderDetailPage() {
  const { id: orderId } = useParams();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  // --- REVIEW STATE ---
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenReview = (item) => {
    setSelectedProduct(item);
    setIsReviewModalOpen(true);
  };

  // --- NOTIFICATION EFFECT ---
  useEffect(() => {
    const paymentStatus = searchParams.get("payment_status");
    if (paymentStatus === "success") {
      toast.success("Thanh toán VNPAY thành công!");
      navigate(".", { replace: true });
    } else if (paymentStatus === "success_cod") {
      toast.success(
        "Đặt hàng COD thành công! Bạn sẽ thanh toán khi nhận hàng."
      );
      navigate(".", { replace: true });
    } else if (paymentStatus === "fail") {
      toast.error("Thanh toán thất bại hoặc đã bị hủy.");
      navigate(".", { replace: true });
    }
  }, [searchParams, navigate]);

  // --- FETCH ORDER EFFECT ---
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const { data } = await axios.get(`${API_URL}/api/orders/${orderId}`, {
          withCredentials: true,
        });
        setOrder(data);
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || "Lỗi không xác định.";
        setError(`Không thể tải chi tiết đơn hàng: ${message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  // --- RENDER: LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner />
          <p className="text-gray-400 tracking-wider text-sm animate-pulse">
            ĐANG TẢI DỮ LIỆU...
          </p>
        </div>
      </div>
    );
  }

  // --- RENDER: ERROR ---
  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-[#12161C] border border-red-500/30 p-8 rounded-sm text-center shadow-2xl">
          <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Đã xảy ra lỗi</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to={user?.role === "admin" ? "/admin/orders" : "/my-orders"}
            className="inline-flex items-center gap-2 bg-[#C9A24D] text-[#0B0F14] px-6 py-2 rounded-sm font-bold hover:bg-white transition-colors"
          >
            <FaArrowLeft /> Quay lại
          </Link>
        </div>
      </div>
    );
  }

  // --- RENDER: NOT FOUND ---
  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <p className="text-white text-xl">Không tìm thấy đơn hàng.</p>
      </div>
    );
  }

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    shippingPrice,
    discountPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  // Status Styling Logic
  const paymentStatus = isPaid
    ? {
        text: `Đã thanh toán`,
        subText: formatDateTime(paidAt),
        className: "bg-green-500/10 text-green-400 border-green-500/20",
        icon: <FaCheckCircle />,
      }
    : paymentMethod === "cod"
    ? {
        text: "Thanh toán khi nhận hàng",
        subText: "Chưa thanh toán",
        className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        icon: <FaMoneyBillWave />,
      }
    : {
        text: "Chờ thanh toán",
        subText: "Vui lòng thanh toán",
        className: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        icon: <FaClock />,
      };

  const deliveryStatus = isDelivered
    ? {
        text: `Đã giao hàng`,
        subText: formatDateTime(deliveredAt),
        className: "bg-green-500/10 text-green-400 border-green-500/20",
        icon: <FaCheckCircle />,
      }
    : {
        text: "Đang xử lý / Vận chuyển",
        subText: "Dự kiến 3-5 ngày",
        className: "bg-[#C9A24D]/10 text-[#C9A24D] border-[#C9A24D]/20",
        icon: <FaTruck />,
      };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-300 py-12 px-4 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24D]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            to={user?.role === "admin" ? "/admin/orders" : "/my-orders"}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C9A24D] transition-colors mb-4 text-sm uppercase tracking-wider font-semibold"
          >
            <FaArrowLeft /> Quay lại danh sách
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest flex items-center gap-3">
                <FaBoxOpen className="text-[#C9A24D]" /> Chi tiết đơn hàng
              </h1>
              <p className="mt-2 text-gray-400 font-mono">
                Mã đơn:{" "}
                <span className="text-[#C9A24D]">
                  #{order._id.toUpperCase()}
                </span>
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Ngày đặt hàng
              </p>
              <p className="text-white font-mono">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Info & Status */}
          <div className="lg:col-span-1 space-y-6">
            {/* 1. Trạng thái đơn hàng */}
            <div className="bg-[#12161C] border border-white/5 rounded-sm p-6 shadow-lg">
              <h2 className="text-white font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaReceipt className="text-[#C9A24D]" /> Trạng thái
              </h2>
              <div className="space-y-4">
                {/* Payment Status */}
                <div
                  className={`p-4 rounded-sm border ${paymentStatus.className} flex items-start gap-3`}
                >
                  <div className="mt-1 text-lg">{paymentStatus.icon}</div>
                  <div>
                    <p className="font-bold text-sm uppercase">
                      {paymentStatus.text}
                    </p>
                    <p className="text-xs opacity-80 mt-1 font-mono">
                      {paymentStatus.subText}
                    </p>
                  </div>
                </div>
                {/* Delivery Status */}
                <div
                  className={`p-4 rounded-sm border ${deliveryStatus.className} flex items-start gap-3`}
                >
                  <div className="mt-1 text-lg">{deliveryStatus.icon}</div>
                  <div>
                    <p className="font-bold text-sm uppercase">
                      {deliveryStatus.text}
                    </p>
                    <p className="text-xs opacity-80 mt-1 font-mono">
                      {deliveryStatus.subText}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Thông tin người nhận */}
            <div className="bg-[#12161C] border border-white/5 rounded-sm p-6 shadow-lg">
              <h2 className="text-white font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <FaUser className="text-[#C9A24D]" /> Người nhận
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-[#1A1F29] rounded-full text-gray-400 group-hover:text-[#C9A24D] transition-colors">
                    <FaUser size={14} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Họ tên</p>
                    <p className="text-white font-medium">
                      {shippingAddress.fullName}
                    </p>
                  </div>
                </div>

                {order.user?.email && (
                  <div className="flex items-start gap-3 group">
                    <div className="p-2 bg-[#1A1F29] rounded-full text-gray-400 group-hover:text-[#C9A24D] transition-colors">
                      <FaEnvelope size={14} />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase">Email</p>
                      <p className="text-white font-medium">
                        {order.user.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-[#1A1F29] rounded-full text-gray-400 group-hover:text-[#C9A24D] transition-colors">
                    <FaPhoneAlt size={14} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">
                      Số điện thoại
                    </p>
                    <p className="text-white font-medium font-mono">
                      {shippingAddress.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group">
                  <div className="p-2 bg-[#1A1F29] rounded-full text-gray-400 group-hover:text-[#C9A24D] transition-colors">
                    <FaMapMarkerAlt size={14} />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase">Địa chỉ</p>
                    <p className="text-white font-medium leading-relaxed">
                      {shippingAddress.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Items & Total */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#12161C] border border-white/5 rounded-sm p-6 shadow-lg">
              <h2 className="text-white font-bold uppercase tracking-wider mb-6 pb-4 border-b border-white/5">
                Sản phẩm đã đặt ({orderItems.length})
              </h2>

              <div className="space-y-6">
                {orderItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex flex-col sm:flex-row items-center gap-4 group"
                  >
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-[#0B0F14] border border-white/10 rounded-sm overflow-hidden flex-shrink-0">
                      <Link to={`/product/${item.product}`}>
                        <img
                          src={
                            item.image?.startsWith("http")
                              ? item.image
                              : `/${item.image?.replace(/\\/g, "/")}`
                          }
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="flex-grow text-center sm:text-left">
                      <Link
                        to={`/product/${item.product}`}
                        className="text-white font-medium hover:text-[#C9A24D] transition-colors line-clamp-2 mb-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-500">
                        Đơn giá:{" "}
                        <span className="font-mono text-gray-300">
                          {formatCurrency(item.price)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Số lượng:{" "}
                        <span className="font-mono text-white">
                          x{item.qty}
                        </span>
                      </p>
                    </div>

                    {/* Price & Action */}
                    <div className="flex flex-col items-center sm:items-end gap-2 min-w-[120px]">
                      <span className="font-bold text-[#C9A24D] font-mono text-lg">
                        {formatCurrency(item.price * item.qty)}
                      </span>

                      {/* Button Review */}
                      {order.isDelivered && (
                        <button
                          onClick={() => handleOpenReview(item)}
                          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide border border-[#C9A24D] text-[#C9A24D] px-4 py-1.5 rounded-sm hover:bg-[#C9A24D] hover:text-[#0B0F14] transition-all duration-300"
                        >
                          <FaStar size={10} /> Đánh giá
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tạm tính</span>
                  <span className="text-white font-mono">
                    {formatCurrency(itemsPrice)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Phí vận chuyển</span>
                  <span className="text-white font-mono">
                    {formatCurrency(shippingPrice)}
                  </span>
                </div>
                {discountPrice > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>
                      Giảm giá {order.couponCode ? `(${order.couponCode})` : ""}
                    </span>
                    <span className="font-mono">
                      - {formatCurrency(discountPrice)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-dashed border-white/10 mt-4">
                  <span className="text-lg font-bold text-white uppercase">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-[#C9A24D] font-mono">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Đánh giá Sản phẩm */}
        <ProductReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          product={selectedProduct}
          onReviewSuccess={() => {
            // Có thể reload data hoặc hiển thị thông báo
            setIsReviewModalOpen(false);
          }}
        />
      </div>
    </div>
  );
}
