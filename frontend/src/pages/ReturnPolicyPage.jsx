import React from "react";

export default function ReturnPolicyPage() {
  return (
    <div className="bg-[#0B0F14] min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl bg-[#12161C] border border-white/5 p-8 md:p-12 rounded-sm shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-widest mb-8 border-b border-white/10 pb-6">
          Chính sách đổi trả
        </h1>

        {/* Nội dung chính với typography tối ưu cho dark mode */}
        <div className="space-y-8 text-gray-400 font-light leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#C9A24D] uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-2xl">01.</span> Thời gian đổi trả
            </h2>
            <p>
              WatchStore hỗ trợ đổi trả sản phẩm miễn phí trong vòng{" "}
              <strong className="text-white font-bold">7 ngày</strong> kể từ
              ngày quý khách nhận được hàng (căn cứ theo dấu bưu điện hoặc xác
              nhận của đơn vị vận chuyển).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A24D] uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-2xl">02.</span> Điều kiện đổi trả
            </h2>
            <p className="mb-4">
              Chúng tôi chỉ chấp nhận đổi trả khi sản phẩm đáp ứng đầy đủ các
              điều kiện sau:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-[#C9A24D]">
              <li>Sản phẩm bị lỗi kỹ thuật được xác nhận từ nhà sản xuất.</li>
              <li>
                Sản phẩm giao không đúng mẫu mã, màu sắc so với đơn hàng đã đặt.
              </li>
              <li>
                Sản phẩm phải còn mới{" "}
                <strong className="text-white">100%</strong>, chưa qua sử dụng,
                không trầy xước.
              </li>
              <li>
                Sản phẩm phải còn đầy đủ tem, mác, hộp, sách hướng dẫn, thẻ bảo
                hành và hóa đơn mua hàng.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#C9A24D] uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="text-2xl">03.</span> Trường hợp từ chối
            </h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-red-500">
              <li>
                Sản phẩm đã qua sử dụng, bị trầy xước bề mặt, dây da bị gập, móp
                méo vỏ.
              </li>
              <li>
                Sản phẩm bị hỏng hóc do lỗi của người dùng (rơi vỡ, vào nước sai
                quy định).
              </li>
              <li>Sản phẩm không còn nguyên vẹn bao bì và phụ kiện đi kèm.</li>
            </ul>
          </section>

          <div className="bg-[#1A1F29] p-6 rounded-sm border-l-4 border-[#C9A24D] mt-8">
            <h3 className="text-white font-bold uppercase mb-2">
              Quy trình thực hiện
            </h3>
            <p className="text-sm">
              Vui lòng liên hệ hotline{" "}
              <span className="text-[#C9A24D] font-mono font-bold">
                0364.389.055
              </span>{" "}
              hoặc nhắn tin qua Fanpage để nhân viên xác nhận tình trạng và
              hướng dẫn gửi hàng về kho.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
