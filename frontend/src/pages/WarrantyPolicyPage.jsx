import React from "react";
import { ShieldCheck, AlertTriangle, MapPin } from "lucide-react";

export default function WarrantyPolicyPage() {
  return (
    <div className="bg-[#0B0F14] min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl bg-[#12161C] border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest mb-10 border-b border-white/10 pb-6 flex items-center gap-3">
          <ShieldCheck className="text-[#C9A24D]" size={36} /> Chính sách bảo
          hành
        </h1>

        <div className="space-y-10 text-gray-400 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-[#C9A24D] pl-4 uppercase tracking-wide">
              1. Thời gian bảo hành
            </h2>
            <p>
              Tất cả sản phẩm đồng hồ bán ra tại WatchStore đều được hưởng chế
              độ:
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1A1F29] p-4 border border-white/5">
                <strong className="block text-[#C9A24D] text-lg mb-1">
                  Bảo hành Quốc tế
                </strong>
                <span className="text-sm">
                  1 - 5 năm tùy thương hiệu (theo quy định hãng).
                </span>
              </div>
              <div className="bg-[#1A1F29] p-4 border border-white/5">
                <strong className="block text-[#C9A24D] text-lg mb-1">
                  Bảo hành WatchStore
                </strong>
                <span className="text-sm">
                  Tặng thêm gói bảo hành độc quyền lên đến{" "}
                  <strong className="text-white">5 năm</strong> tại cửa hàng.
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-green-500 pl-4 uppercase tracking-wide">
              2. Điều kiện bảo hành (Miễn phí)
            </h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-green-500">
              <li>Sản phẩm còn trong thời gian bảo hành ghi trên phiếu/thẻ.</li>
              <li>
                Lỗi kỹ thuật xuất phát từ bộ máy bên trong (đồng hồ chết máy,
                chạy sai giờ, kim rụng không do va đập).
              </li>
              <li>
                Sản phẩm phải có thẻ bảo hành chính hãng và hóa đơn mua hàng
                điện tử tại WatchStore.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red-500 pl-4 uppercase tracking-wide flex items-center gap-2">
              3. Từ chối bảo hành{" "}
              <span className="text-xs font-normal text-gray-500 normal-case ml-2">
                (Sửa chữa tính phí)
              </span>
            </h2>
            <ul className="space-y-3">
              <li className="flex gap-3 items-start">
                <AlertTriangle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-1"
                />
                <span>
                  Các lỗi do người dùng: rơi vỡ, va đập mạnh, trầy xước/vỡ mặt
                  kính, móp vỏ, gãy dây.
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <AlertTriangle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-1"
                />
                <span>
                  Sản phẩm bị vào nước do sử dụng sai thông số (VD: Đeo đồng hồ
                  3ATM đi bơi/tắm).
                </span>
              </li>
              <li className="flex gap-3 items-start">
                <AlertTriangle
                  size={18}
                  className="text-red-500 flex-shrink-0 mt-1"
                />
                <span>
                  Sản phẩm đã bị can thiệp, sửa chữa tại những nơi không phải
                  trung tâm bảo hành ủy quyền.
                </span>
              </li>
            </ul>
          </section>

          <section className="bg-[#1A1F29] p-6 rounded-sm mt-8 border border-white/5">
            <h2 className="text-lg font-bold text-white uppercase tracking-wide mb-3 flex items-center gap-2">
              <MapPin size={20} className="text-[#C9A24D]" /> Địa điểm tiếp nhận
            </h2>
            <p className="text-sm mb-2">
              Quý khách có thể mang sản phẩm đến trực tiếp cửa hàng WatchStore:
            </p>
            <p className="text-[#C9A24D] font-bold">
              87 Bùi Quang Là, Phường 12, Quận Gò Vấp, TP.HCM
            </p>
            <p className="text-sm mt-2 italic text-gray-500">
              Hoặc gửi đến các trung tâm bảo hành chính hãng của thương hiệu tại
              Việt Nam (địa chỉ có trong sổ bảo hành đi kèm).
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
