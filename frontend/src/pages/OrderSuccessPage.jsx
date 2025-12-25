import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaArrowRight,
  FaShoppingBag,
  FaBoxOpen,
} from "react-icons/fa";

export default function OrderSuccessPage() {
  // Lấy ID đơn hàng từ URL (nếu router của bạn cấu hình là /order-success/:id)
  const { id } = useParams();

  // Scroll lên đầu trang khi load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-[#C9A24D]/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="relative z-10 max-w-lg w-full bg-[#12161C] border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl text-center">
        {/* Success Icon Animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#C9A24D] rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="relative bg-[#1A1F29] rounded-full p-6 border border-[#C9A24D]/30">
              <FaCheckCircle className="text-5xl text-[#C9A24D]" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest mb-4">
          Đặt hàng thành công!
        </h1>

        <p className="text-gray-400 mb-6 leading-relaxed">
          Cảm ơn bạn đã tin tưởng và mua sắm tại{" "}
          <span className="text-white font-semibold">WatchStore</span>. Đơn hàng
          của bạn đã được hệ thống ghi nhận và đang tiến hành xử lý.
        </p>

        {/* Order ID Badge (Optional) */}
        {id && (
          <div className="mb-8 inline-block bg-[#1A1F29] border border-dashed border-gray-700 px-4 py-2 rounded-sm">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
              Mã đơn hàng
            </p>
            <p className="text-[#C9A24D] font-mono font-bold text-lg">
              #{id.toUpperCase()}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* Nút xem đơn hàng (chỉ hiện nếu có ID) */}
          {id && (
            <Link
              to={`/order/${id}`}
              className="w-full flex items-center justify-center gap-2 bg-[#C9A24D] text-[#0B0F14] px-6 py-3.5 font-bold uppercase tracking-wider rounded-sm hover:bg-white transition-all duration-300 group"
            >
              <FaBoxOpen className="text-lg" />
              Xem chi tiết đơn hàng
            </Link>
          )}

          {/* Nút về trang chủ */}
          <Link
            to="/"
            className={`w-full flex items-center justify-center gap-2 border border-white/10 text-white px-6 py-3.5 font-bold uppercase tracking-wider rounded-sm hover:border-[#C9A24D] hover:text-[#C9A24D] transition-all duration-300 ${
              !id
                ? "bg-[#C9A24D] !text-[#0B0F14] !border-[#C9A24D] hover:!bg-white"
                : ""
            }`}
          >
            <FaShoppingBag />
            Tiếp tục mua sắm
            {!id && <FaArrowRight size={12} />}
          </Link>
        </div>
      </div>
    </div>
  );
}
