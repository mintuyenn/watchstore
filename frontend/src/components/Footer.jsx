import React from "react";

// Sử dụng thẻ <a> thay vì <Link> để tránh lỗi "missing Router context"
// khi component này được render độc lập.
// import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Xóa 'mt-16' để loại bỏ khoảng trắng bên trên.
    // Đổi màu nền sang hệ màu tối (Dark Mode) để khớp với ProductDetail.
    <footer className="w-full bg-[#111827] text-gray-400 border-t border-white/5">
      {/* Container: Grid 3 cột */}
      <div className="container mx-auto grid grid-cols-1 gap-12 px-4 py-16 md:grid-cols-3 lg:px-8">
        {/* Cột 1: Thông tin thương hiệu */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-2xl font-bold text-white tracking-widest uppercase flex items-center gap-2">
            Watch<span className="text-[#C9A24D]">Store</span>
          </h4>
          <p className="text-sm leading-relaxed max-w-xs text-gray-400">
            Chuyên cung cấp đồng hồ chính hãng từ các thương hiệu hàng đầu thế
            giới. Cam kết chất lượng và sự hài lòng tuyệt đối.
          </p>
        </div>

        {/* Cột 2: Liên kết Mua sắm */}
        <div>
          <h5 className="mb-6 text-sm font-bold text-white uppercase tracking-widest border-b border-[#C9A24D] pb-2 inline-block">
            Mua sắm
          </h5>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="/"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Trang chủ
              </a>
            </li>
            <li>
              <a
                href="/products"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Tất cả sản phẩm
              </a>
            </li>
            <li>
              <a
                href="/products?movement=Automatic"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Đồng hồ Automatic
              </a>
            </li>
            <li>
              <a
                href="/products?brand=G-Shock"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Thương hiệu Rolex
              </a>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên kết Hỗ trợ */}
        <div>
          <h5 className="mb-6 text-sm font-bold text-white uppercase tracking-widest border-b border-[#C9A24D] pb-2 inline-block">
            Hỗ trợ khách hàng
          </h5>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href="/contact"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Liên hệ & Góp ý
              </a>
            </li>
            <li>
              <a
                href="/faq"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a
                href="/policy/warranty"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a
                href="/policy/return"
                className="transition-colors hover:text-[#C9A24D] hover:translate-x-1 inline-block"
              >
                Chính sách đổi trả
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#0B0F14] py-6 border-t border-white/5">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 uppercase tracking-wider">
          <p>© {currentYear} WatchStore. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-[#C9A24D] cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-[#C9A24D] cursor-pointer transition-colors">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
