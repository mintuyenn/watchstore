import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaLongArrowAltRight,
  FaShoppingBag,
} from "react-icons/fa";

const getImageUrl = (imagePath) => {
  if (!imagePath)
    return "https://dummyimage.com/600x600/0b0f14/c9a24d.png&text=No+Image";
  if (imagePath.startsWith("http")) return imagePath;
  const base = "";
  return `${base}${imagePath}`;
};

export default function Cart() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pt-20 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A24D]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* --- HEADER ĐÃ CHỈNH SỬA --- */}
        <div className="mb-12 text-center">
          <span className="text-[#C9A24D] text-xs font-bold tracking-[0.3em] uppercase block mb-3">
            Shopping Cart
          </span>
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest">
              Giỏ Hàng
            </h1>
            {/* Dấu gạch đứng trang trí */}
            <div className="hidden md:block w-px h-6 bg-white/20 rotate-12"></div>

            <span className="text-gray-400 text-lg">
              Hiện có{" "}
              <span className="text-[#C9A24D] font-mono font-bold text-xl mx-1">
                {cartCount}
              </span>{" "}
              vật phẩm
            </span>
          </div>
        </div>

        {/* --- CONTENT --- */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-[#050505] border border-white/10 rounded-lg shadow-2xl">
            <div className="w-24 h-24 bg-[#0F172A] rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(201,162,77,0.1)]">
              <FaShoppingBag className="text-[#C9A24D] text-4xl opacity-50" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">
              Giỏ hàng trống
            </h2>
            <p className="text-gray-400 mb-8 font-light">
              Chưa có tuyệt tác thời gian nào được chọn.
            </p>
            <Link
              to="/"
              className="group flex items-center gap-3 bg-transparent border border-[#C9A24D] text-[#C9A24D] px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-[#C9A24D] hover:text-black transition-all duration-300"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />{" "}
              Quay lại cửa hàng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* List sản phẩm */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#050505] border border-white/5 rounded-md hover:border-[#C9A24D]/30 transition-all duration-300"
                >
                  <Link
                    to={`/product/${item._id}`}
                    className="block flex-shrink-0 w-28 h-28 overflow-hidden rounded-sm border border-white/10"
                  >
                    <img
                      src={getImageUrl(item.images && item.images[0])}
                      alt={item.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </Link>

                  <div className="flex-1 text-center sm:text-left w-full">
                    <Link
                      to={`/product/${item._id}`}
                      className="block text-lg font-bold text-white hover:text-[#C9A24D] transition-colors uppercase tracking-wide mb-1"
                    >
                      {item.name}
                    </Link>
                    <div className="text-[#C9A24D] font-mono text-lg font-medium mb-2">
                      {item.price.toLocaleString("vi-VN")} ₫
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      <div className="flex items-center border border-white/20 rounded-sm bg-[#0B0F14]">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 transition-colors"
                        >
                          <FaMinus size={10} />
                        </button>
                        <input
                          type="number"
                          readOnly
                          value={item.quantity}
                          className="w-10 text-center bg-transparent text-white text-sm font-bold focus:outline-none appearance-none m-0"
                        />
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.quantity + 1)
                          }
                          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                      <span className="text-xs text-gray-500 font-mono hidden sm:block">
                        Total:{" "}
                        <span className="text-gray-300">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}{" "}
                          ₫
                        </span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-3 text-gray-500 hover:text-red-500 transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                    title="Xóa sản phẩm"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors"
                >
                  <FaArrowLeft size={12} /> Tiếp tục mua sắm
                </Link>
                <button
                  onClick={clearCart}
                  className="text-red-500/70 hover:text-red-500 text-sm font-medium flex items-center gap-2 transition-colors uppercase tracking-wider"
                >
                  <FaTrash size={12} /> Xóa tất cả
                </button>
              </div>
            </div>

            {/* Tóm tắt đơn hàng */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-[#050505] border border-white/10 p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10">
                  Tổng đơn hàng
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Tạm tính</span>
                    <span className="text-white font-mono">
                      {cartTotal.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm">
                    <span>Vận chuyển</span>
                    <span className="text-[#C9A24D] text-xs uppercase font-bold tracking-wider">
                      Miễn phí
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-end py-4 border-t border-white/10 mb-6">
                  <span className="text-white font-bold uppercase">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-[#C9A24D] font-mono">
                    {cartTotal.toLocaleString("vi-VN")} ₫
                  </span>
                </div>

                <Link
                  to="/checkout"
                  className="w-full flex items-center justify-center gap-2 bg-[#C9A24D] text-[#0B0F14] py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:shadow-[0_0_20px_rgba(201,162,77,0.5)] transition-all duration-300"
                >
                  Thanh toán <FaLongArrowAltRight />
                </Link>

                <div className="mt-6 flex items-center justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                    className="h-3"
                    alt="visa"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                    className="h-4"
                    alt="mastercard"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
