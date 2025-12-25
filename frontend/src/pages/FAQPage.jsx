import React from "react";
import { Plus, Minus } from "lucide-react";

// Component cho 1 câu hỏi (Q&A Item)
const FaqItem = ({ question, children }) => (
  <details className="group border-b border-white/10 last:border-b-0">
    <summary className="cursor-pointer py-6 pr-4 font-bold text-white flex justify-between items-center select-none hover:text-[#C9A24D] transition-colors">
      <span className="text-lg tracking-wide">{question}</span>
      <span className="transform transition-transform duration-300 group-open:rotate-180 text-[#C9A24D]">
        {/* Trick: Chỉ hiện icon tương ứng */}
        <Plus size={20} className="block group-open:hidden" />
        <Minus size={20} className="hidden group-open:block" />
      </span>
    </summary>
    <div className="pb-6 pr-4 text-gray-400 text-sm leading-relaxed font-light pl-4 border-l-2 border-[#C9A24D]/30 ml-1">
      {children}
    </div>
  </details>
);

export default function FAQPage() {
  return (
    <div className="bg-[#0B0F14] min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
            Support Center
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest">
            Câu hỏi thường gặp
          </h1>
        </div>

        <div className="bg-[#12161C] border border-white/5 p-8 rounded-sm shadow-2xl">
          <FaqItem question="Mua hàng tại WatchStore có an toàn không?">
            <p>
              Tuyệt đối an toàn. Chúng tôi cam kết{" "}
              <strong className="text-white">100% sản phẩm chính hãng</strong>.
              Mọi thông tin giao dịch của bạn đều được bảo mật tuyệt đối theo
              tiêu chuẩn quốc tế.
            </p>
          </FaqItem>

          <FaqItem question="Chính sách bảo hành như thế nào?">
            <p>
              Tất cả sản phẩm đều được bảo hành quốc tế theo quy định của hãng
              (thường là 1-2 năm) và gói bảo hành vàng tại WatchStore lên đến 5
              năm. Bạn có thể xem chi tiết tại trang Chính sách bảo hành.
            </p>
          </FaqItem>

          <FaqItem question="Tôi có thể đổi trả sản phẩm không?">
            <p>
              Có. Chúng tôi hỗ trợ đổi trả trong vòng{" "}
              <strong className="text-white">7 ngày</strong> nếu sản phẩm có lỗi
              từ nhà sản xuất hoặc không đúng mẫu mã bạn đặt. Vui lòng giữ sản
              phẩm còn nguyên tem, mác và hóa đơn mua hàng.
            </p>
          </FaqItem>

          <FaqItem question="Thanh toán VNPAY bị lỗi thì phải làm sao?">
            <p>
              Nếu thanh toán thất bại, đơn hàng của bạn sẽ tự động chuyển về
              trạng thái{" "}
              <span className="text-yellow-500">"Chờ thanh toán"</span>. Bạn có
              thể vào mục "Đơn hàng của tôi", chọn đơn hàng đó và thử thanh toán
              lại hoặc liên hệ hotline để chuyển sang hình thức COD.
            </p>
          </FaqItem>
        </div>
      </div>
    </div>
  );
}
