import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaArrowLeft,
  FaExclamationCircle,
  FaTag,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaGift,
  FaSpinner,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

// --- Component Spinner ---
const SpinnerIcon = ({ className = "text-white" }) => (
  <FaSpinner className={`animate-spin ${className}`} />
);

// --- Component InputV2 (Dark Mode) ---
const InputV2 = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  error = "",
  icon,
}) => (
  <div className="group">
    <label
      htmlFor={name}
      className="block text-xs font-bold text-[#C9A24D] uppercase tracking-wider mb-2 ml-1"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-[#C9A24D] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`block w-full bg-[#0B0F14] border rounded-sm py-3 pl-12 pr-4 text-white placeholder-gray-600 transition-all duration-300 focus:outline-none focus:ring-1 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
            : "border-white/20 focus:border-[#C9A24D] focus:ring-[#C9A24D]"
        }`}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1">
        <FaExclamationCircle /> {error}
      </p>
    )}
  </div>
);

// --- Component PaymentOptionV2 (Dark Mode) ---
const PaymentOptionV2 = ({
  value,
  selected,
  onChange,
  icon,
  title,
  children,
}) => (
  <label
    className={`relative flex items-start p-5 border rounded-sm cursor-pointer transition-all duration-300 group ${
      selected === value
        ? "bg-[#0B0F14] border-[#C9A24D] shadow-[0_0_15px_rgba(201,162,77,0.1)]"
        : "bg-[#0B0F14] border-white/10 hover:border-white/30"
    }`}
  >
    <div className="flex items-center h-6">
      <input
        type="radio"
        name="paymentMethod"
        value={value}
        checked={selected === value}
        onChange={() => onChange(value)}
        className="appearance-none h-4 w-4 rounded-full border border-gray-500 checked:border-[#C9A24D] checked:bg-[#C9A24D] focus:outline-none transition duration-200 cursor-pointer"
      />
    </div>
    <div className="ml-4 flex-grow">
      <div className="flex items-center gap-3 mb-1">
        <div
          className={`text-xl ${
            selected === value ? "text-[#C9A24D]" : "text-gray-400"
          }`}
        >
          {icon}
        </div>
        <span
          className={`font-bold text-lg ${
            selected === value ? "text-white" : "text-gray-300"
          }`}
        >
          {title}
        </span>
      </div>
      <p className="text-sm text-gray-500 mt-2 font-light leading-relaxed">
        {children}
      </p>
    </div>
  </label>
);

// --- Component Coupon List (Dark Mode) ---
const CouponList = ({
  availableCoupons,
  onApplyCoupon,
  couponLoading,
  appliedCoupon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (availableCoupons.length === 0) return null;

  return (
    <div className="mt-6 border-t border-white/10 pt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-sm font-bold text-[#C9A24D] hover:text-white transition py-2 uppercase tracking-wider"
      >
        <span className="flex items-center gap-2">
          <FaGift /> Kho ưu đãi ({availableCoupons.length})
        </span>
        <FaChevronRight
          className={`transform transition-transform duration-300 ${
            isOpen ? "rotate-90" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
          {availableCoupons.map((coupon) => (
            <div
              key={coupon.code}
              className={`p-4 rounded-sm flex justify-between items-center border transition duration-300 ${
                appliedCoupon?.code === coupon.code
                  ? "bg-[#C9A24D]/10 border-[#C9A24D]"
                  : "bg-[#0B0F14] border-white/10 hover:border-[#C9A24D]/50"
              }`}
            >
              <div className="flex flex-col">
                <span
                  className={`font-mono font-bold text-base ${
                    appliedCoupon?.code === coupon.code
                      ? "text-[#C9A24D]"
                      : "text-white"
                  }`}
                >
                  {coupon.code}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Giảm{" "}
                  <span className="text-white font-bold">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}%`
                      : coupon.discountAmount.toLocaleString("vi-VN") + " ₫"}
                  </span>{" "}
                  đơn từ {coupon.minPurchase.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {appliedCoupon?.code === coupon.code ? (
                <span className="text-xs font-bold text-[#C9A24D] flex items-center gap-1 bg-[#C9A24D]/10 px-2 py-1 rounded-sm border border-[#C9A24D]/20">
                  <FaCheckCircle /> Đã dùng
                </span>
              ) : (
                <button
                  onClick={() => onApplyCoupon(coupon.code)}
                  disabled={couponLoading}
                  className="text-xs font-bold text-[#0B0F14] bg-[#C9A24D] hover:bg-white hover:text-[#0B0F14] px-4 py-2 rounded-sm transition-all disabled:opacity-50 uppercase tracking-wide"
                >
                  {couponLoading ? (
                    <SpinnerIcon className="text-black" />
                  ) : (
                    "Áp dụng"
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Component Chính CheckoutPage ---
export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [selectedPayment, setSelectedPayment] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [availableCouponsLoading, setAvailableCouponsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // API Call: Fetch Coupons
  const fetchAvailableCoupons = async () => {
    setAvailableCouponsLoading(true);
    setCouponError("");
    try {
      const { data } = await axios.get(`${API_URL}/api/coupons/available`);
      setAvailableCoupons(data);
    } catch (apiError) {
      console.error("Lỗi coupons:", apiError);
    } finally {
      setAvailableCouponsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setShippingInfo((prev) => ({
        fullName: user.fullName || prev.fullName || "",
        phone: user.phone || prev.phone || "",
        address: user.address || prev.address || "",
      }));
    }
    fetchAvailableCoupons();
  }, [user]);

  // Calculations
  const shippingCost = cartTotal > 1000000 ? 0 : 30000;
  const taxAmount = 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = cartTotal + shippingCost + taxAmount - discountAmount;

  // Handlers
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setError("");
  };

  const validateForm = () => {
    let isValid = true;
    const errors = { fullName: "", phone: "", address: "" };
    if (shippingInfo.fullName.trim().length < 2) {
      errors.fullName = "Họ tên quá ngắn.";
      isValid = false;
    }
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(shippingInfo.phone)) {
      errors.phone = "SĐT không hợp lệ (10 số).";
      isValid = false;
    }
    if (shippingInfo.address.trim().length < 10) {
      errors.address = "Địa chỉ quá ngắn.";
      isValid = false;
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleApplyCoupon = async (codeToApply = couponCode) => {
    const finalCode = codeToApply.trim().toUpperCase();
    if (!finalCode) {
      setCouponError("Vui lòng nhập mã");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    setError("");
    try {
      const { data } = await axios.post(`${API_URL}/api/coupons/validate`, {
        code: finalCode,
        cartTotal: cartTotal,
      });
      setAppliedCoupon(data);
      setCouponCode("");
    } catch (apiError) {
      setCouponError(apiError.response?.data?.message || "Mã không hợp lệ");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      setError("Vui lòng kiểm tra lại thông tin.");
      return;
    }
    if (!selectedPayment) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setError("");
    setProcessing(true);

    const orderData = {
      orderItems: cartItems.map((i) => ({
        product: i._id,
        name: i.name,
        qty: i.quantity,
        price: i.price,
        image: i.images?.[0] || "",
      })),
      shippingAddress: shippingInfo,
      paymentMethod: selectedPayment,
      itemsPrice: cartTotal,
      taxPrice: taxAmount,
      shippingPrice: shippingCost,
      discountPrice: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      totalPrice: finalTotal,
    };

    try {
      const { data: createdOrder } = await axios.post(
        `${API_URL}/api/orders`,
        orderData,
        { withCredentials: true }
      );

      if (selectedPayment === "cod") {
        clearCart();
        setProcessing(false);
        navigate(`/order-success`);
      } else if (selectedPayment === "vnpay") {
        const { data: paymentData } = await axios.post(
          `${API_URL}/api/payment/create-vnpay-url`,
          {
            orderId: createdOrder._id,
            amount: createdOrder.totalPrice,
            language: "vn",
          },
          { withCredentials: true }
        );
        if (paymentData && paymentData.paymentUrl) {
          clearCart();
          window.location.href = paymentData.paymentUrl;
        } else {
          throw new Error("Lỗi kết nối VNPAY");
        }
      }
    } catch (apiError) {
      console.error(apiError);
      setError(apiError.response?.data?.message || "Lỗi xử lý đơn hàng.");
      setProcessing(false);
    }
  };

  // --- RENDER ---
  if (cartItems.length === 0 && !processing) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">
            Giỏ hàng trống
          </h2>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#C9A24D] hover:text-white border border-[#C9A24D] px-6 py-3 uppercase text-sm font-bold tracking-widest transition-all"
          >
            <FaArrowLeft /> Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-white">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A24D]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest">
            Thanh Toán Đơn Hàng
          </h1>
          <Link
            to="/cart"
            className="group flex items-center gap-2 text-gray-400 hover:text-[#C9A24D] transition-colors text-sm uppercase tracking-wider font-bold"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
            Quay lại giỏ hàng
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: Forms --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Form */}
            <div className="bg-[#050505] p-6 md:p-8 rounded-sm border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A24D]"></div>

              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wide">
                <FaMapMarkerAlt className="text-[#C9A24D]" /> Thông tin giao
                hàng
              </h2>

              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/50 p-4 rounded-sm flex items-start gap-3">
                  <FaExclamationCircle className="text-red-500 mt-1 flex-shrink-0" />
                  <span className="text-red-400 text-sm font-medium">
                    {error}
                  </span>
                </div>
              )}

              <div className="space-y-6">
                <InputV2
                  label="Họ và tên"
                  name="fullName"
                  value={shippingInfo.fullName}
                  onChange={handleShippingChange}
                  required
                  error={formErrors.fullName}
                  icon={<FaUser />}
                  placeholder="Nhập họ tên người nhận"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputV2
                    label="Số điện thoại"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    required
                    error={formErrors.phone}
                    icon={<FaPhoneAlt />}
                    placeholder="0912xxxxxx"
                  />
                  {/* Giả lập field Email nếu cần, hoặc để trống */}
                  <InputV2
                    label="Địa chỉ chi tiết"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                    error={formErrors.address}
                    icon={<FaMapMarkerAlt />}
                    placeholder="Số nhà, đường, phường, quận..."
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-[#050505] p-6 md:p-8 rounded-sm border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A24D]"></div>

              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-wide">
                <FaCreditCard className="text-[#C9A24D]" /> Phương thức thanh
                toán
              </h2>

              <div className="space-y-4">
                <PaymentOptionV2
                  value="vnpay"
                  selected={selectedPayment}
                  onChange={setSelectedPayment}
                  icon={<FaCreditCard />}
                  title="Thanh toán VNPAY-QR"
                >
                  Quét mã QR hoặc dùng thẻ ATM/Visa/Mastercard qua cổng VNPAY an
                  toàn, nhanh chóng.
                </PaymentOptionV2>

                <PaymentOptionV2
                  value="cod"
                  selected={selectedPayment}
                  onChange={setSelectedPayment}
                  icon={<FaMoneyBillWave />}
                  title="Thanh toán khi nhận hàng (COD)"
                >
                  Thanh toán bằng tiền mặt cho nhân viên giao hàng sau khi kiểm
                  tra sản phẩm.
                </PaymentOptionV2>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Summary --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[#050505] p-6 rounded-sm border border-white/10 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-6 pb-4 border-b border-white/10 flex items-center gap-2 uppercase tracking-widest">
                <FaTag className="text-[#C9A24D]" /> Đơn hàng
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                {!appliedCoupon ? (
                  <div className="flex gap-0">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      placeholder="MÃ GIẢM GIÁ"
                      className="w-full bg-[#0B0F14] border border-white/20 border-r-0 rounded-l-sm py-2 px-3 text-white text-sm focus:outline-none focus:border-[#C9A24D] placeholder-gray-600 font-mono uppercase"
                      disabled={couponLoading}
                    />
                    <button
                      onClick={() => handleApplyCoupon(couponCode)}
                      disabled={couponLoading}
                      className="bg-[#C9A24D] text-[#0B0F14] font-bold px-4 py-2 rounded-r-sm hover:bg-white transition-colors disabled:opacity-50 text-sm uppercase"
                    >
                      {couponLoading ? (
                        <SpinnerIcon className="text-black" />
                      ) : (
                        "Áp dụng"
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#C9A24D]/10 border border-[#C9A24D]/30 p-3 rounded-sm flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[#C9A24D] font-bold text-sm flex items-center gap-2">
                        <FaCheckCircle /> {appliedCoupon.code}
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">
                        Đã giảm{" "}
                        {appliedCoupon.discountAmount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                    <FaExclamationCircle /> {couponError}
                  </p>
                )}

                {/* Coupon List Dropdown */}
                {availableCouponsLoading ? (
                  <div className="mt-4 flex justify-center">
                    <SpinnerIcon className="text-[#C9A24D]" />
                  </div>
                ) : (
                  <CouponList
                    availableCoupons={availableCoupons}
                    onApplyCoupon={handleApplyCoupon}
                    couponLoading={couponLoading}
                    appliedCoupon={appliedCoupon}
                  />
                )}
              </div>

              {/* Calculation */}
              <div className="space-y-3 py-4 border-t border-white/10 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Tạm tính</span>
                  <span className="text-white font-mono">
                    {cartTotal.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Vận chuyển</span>
                  <span
                    className={
                      shippingCost === 0
                        ? "text-[#C9A24D] font-bold uppercase text-xs"
                        : "text-white font-mono"
                    }
                  >
                    {shippingCost === 0
                      ? "Miễn phí"
                      : `${shippingCost.toLocaleString("vi-VN")} ₫`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#C9A24D]">
                    <span>Giảm giá</span>
                    <span className="font-mono">
                      - {discountAmount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-white/10 mt-2 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-white font-bold uppercase tracking-wider">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-[#C9A24D] font-mono">
                    {finalTotal.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handlePayment}
                disabled={processing || cartItems.length === 0}
                className={`w-full py-4 text-sm font-bold uppercase tracking-[0.15em] transition-all duration-300 transform rounded-sm
                    ${
                      processing || cartItems.length === 0
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-[#C9A24D] text-[#0B0F14] hover:bg-white hover:shadow-[0_0_20px_rgba(201,162,77,0.4)]"
                    }`}
              >
                {processing ? (
                  <div className="flex items-center justify-center gap-2">
                    <SpinnerIcon className="text-[#0B0F14]" /> Đang xử lý...
                  </div>
                ) : (
                  "Xác nhận thanh toán"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
