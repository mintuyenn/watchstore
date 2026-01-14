import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const ContactPage = () => {
  return (
    <div className="bg-[#0B0F14] min-h-screen text-gray-300">
      {/* --- PHẦN 1: HERO BANNER --- */}
      <div className="relative py-20 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-[#C9A24D]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 container mx-auto px-4">
          <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wide">
            Liên hệ WatchStore
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn kiến tạo phong cách.
            Hãy ghé thăm cửa hàng hoặc liên hệ qua các kênh trực tuyến.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* --- PHẦN 2: CÁC THẺ THÔNG TIN (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ContactCard
            icon={<MapPin size={24} />}
            title="Địa chỉ cửa hàng"
            content={
              <>
                112 Hồ Văn Huê, Phường 9,
                <br />
                Quận Phú Nhuận, TP. Hồ Chí Minh
              </>
            }
          />
          <ContactCard
            icon={<Phone size={24} />}
            title="Hotline hỗ trợ"
            content={
              <>
                Mua hàng:{" "}
                <span className="text-white font-mono">0336887995</span>
                <br />
                Khiếu nại:{" "}
                <span className="text-white font-mono">0336887995</span>
              </>
            }
          />
          <ContactCard
            icon={<Mail size={24} />}
            title="Email liên hệ"
            content={
              <>
                support@watchstore.vn
                <br />
                sales@watchstore.vn
              </>
            }
          />
          <ContactCard
            icon={<Clock size={24} />}
            title="Giờ mở cửa"
            content={
              <>
                T2 - T6:{" "}
                <span className="text-white font-mono">8:00 - 21:00</span>
                <br />
                T7 - CN:{" "}
                <span className="text-white font-mono">9:00 - 22:00</span>
              </>
            }
          />
        </div>

        {/* --- PHẦN 3: BẢN ĐỒ & MẠNG XÃ HỘI --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột Trái: Social & FAQ Link */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#12161C] border border-white/5 rounded-sm p-8 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider border-l-4 border-[#C9A24D] pl-3">
                Kết nối
              </h3>
              <div className="space-y-4">
                <SocialLink
                  href=""
                  icon={<Facebook size={20} />}
                  text="Fanpage WatchStore"
                />
                <SocialLink
                  href="https://www.instagram.com/bincaoo/"
                  icon={<Instagram size={20} />}
                  text="@watchstore.official"
                />
                <SocialLink
                  href="https://zalo.me/0336887995"
                  icon={<MessageCircle size={20} />}
                  text="Zalo Official"
                />
              </div>
            </div>

            <div className="bg-[#12161C] border border-white/5 rounded-sm p-8 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-wider border-l-4 border-[#C9A24D] pl-3">
                Câu hỏi thường gặp
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 mb-4">
                <li className="flex gap-2 items-center">
                  <ArrowRight size={14} className="text-[#C9A24D]" /> Chính sách
                  bảo hành ra sao?
                </li>
                <li className="flex gap-2 items-center">
                  <ArrowRight size={14} className="text-[#C9A24D]" /> Đổi trả
                  trong bao lâu?
                </li>
              </ul>
              <a
                href="/faq"
                className="text-[#C9A24D] text-sm font-bold uppercase tracking-wider hover:text-white transition-colors inline-flex items-center gap-2"
              >
                Xem tất cả FAQ <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Cột Phải: Bản đồ */}
          <div className="lg:col-span-2 bg-[#12161C] border border-white/5 rounded-sm overflow-hidden h-[400px] lg:h-auto shadow-lg relative group">
            {/* Lớp phủ hover hiệu ứng */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none z-10 group-hover:bg-transparent transition-colors"></div>

            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.8102884851874!2d106.63066308132308!3d10.749099732381218!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ffaeb1a0f7d%3A0x463ba93fe910c917!2zU2hvcCDEkOG7k25nIEjhu5MgTmFtIE7hu68gQ2jDrW5oIEjDo25n!5e0!3m2!1svi!2s!4v1768392128747!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{
                border: 0,
                // Filter mới: Đậm hơn, độ tương phản cao hơn, bớt nhợt nhạt
                filter:
                  "grayscale(100%) invert(100%) contrast(90%) brightness(95%)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---
const ContactCard = ({ icon, title, content }) => (
  <div className="bg-[#12161C] border border-white/5 p-8 text-center hover:-translate-y-1 transition-all duration-300 hover:border-[#C9A24D]/30 group">
    <div className="w-14 h-14 bg-[#1A1F29] text-[#C9A24D] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#C9A24D] group-hover:text-black transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-3 uppercase tracking-wide">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">{content}</p>
  </div>
);

const SocialLink = ({ icon, text, href }) => (
  <a
    href={href}
    rel="noopener noreferrer"
    className="flex items-center gap-4 p-3 bg-[#1A1F29] border border-white/5 hover:border-[#C9A24D] text-gray-300 hover:text-white transition-all group"
  >
    <span className="text-[#C9A24D] group-hover:scale-110 transition-transform">
      {icon}
    </span>
    <span className="text-sm font-medium">{text}</span>
  </a>
);

export default ContactPage;
