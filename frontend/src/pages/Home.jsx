import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Gift,
  Star,
  Clock,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard"; // Import component đã refactor

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Giữ nguyên logic lấy dữ liệu
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products`);
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Lọc sản phẩm mới nhất
  const listToRender = Array.isArray(products) ? products : [];
  const newArrivals = listToRender.slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F14]">
        <div className="h-12 w-12 border-t-2 border-b-2 border-[#C9A24D] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F14] min-h-screen font-sans text-gray-200 selection:bg-[#C9A24D] selection:text-black">
      {/* ================= 1. HERO SECTION (CINEMATIC LUXURY) ================= */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=2000&auto=format&fit=crop"
            alt="Hero Watch"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Gradient Overlay để text rõ hơn */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent"></div>
        </div>

        {/* Content Layer */}
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="text-[#C9A24D] font-bold tracking-[0.3em] uppercase mb-4 text-sm md:text-base">
              Swiss Made Excellence
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] mb-8 tracking-tight">
              TIMELESS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                MASTERPIECE
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 font-light leading-relaxed border-l-2 border-[#C9A24D] pl-6">
              Khám phá bộ sưu tập đồng hồ cơ khí đỉnh cao. Biểu tượng của sự
              thành công và đẳng cấp quý ông.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/products"
                className="group relative px-8 py-4 bg-[#C9A24D] text-[#0B0F14] font-bold text-sm tracking-widest uppercase overflow-hidden hover:text-white transition-colors duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Mua Ngay <ArrowRight size={18} />
                </span>
                <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out z-0 opacity-10"></div>
              </Link>

              <Link
                to="/products?brand=Rolex"
                className="px-8 py-4 border border-white/20 text-white font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
              >
                Bộ Sưu Tập Rolex
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. MINIMALIST TRUST BAR ================= */}
      <section className="py-12 border-b border-white/5 bg-[#0F172A]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-white/5">
            {[
              {
                icon: ShieldCheck,
                title: "100% Authentic",
                desc: "Cam kết chính hãng trọn đời",
              },
              {
                icon: Truck,
                title: "Global Shipping",
                desc: "Vận chuyển bảo hiểm toàn cầu",
              },
              {
                icon: Clock,
                title: "5-Year Warranty",
                desc: "Bảo hành tiêu chuẩn Thụy Sĩ",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4"
              >
                <div className="p-3 rounded-full border border-[#C9A24D]/30 text-[#C9A24D]">
                  <item.icon size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. NEW ARRIVALS (DARK GRID) ================= */}
      <section className="py-24 bg-[#0B0F14]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
                New Collection 2025
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Sản Phẩm Mới Về
              </h2>
            </div>
            <Link
              to="/products"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm uppercase tracking-widest border-b border-transparent hover:border-white pb-1"
            >
              Xem tất cả <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500 border border-white/5 rounded-lg">
                <p>Đang cập nhật bộ sưu tập mới...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= 4. FEATURED BANNER (PARALLAX FEEL) ================= */}
      <section
        className="relative py-32 bg-fixed bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=2000&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <Star
            className="text-[#C9A24D] mx-auto mb-6 w-8 h-8"
            fill="#C9A24D"
          />
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
            Limited Edition
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-10 text-lg font-light">
            Những thiết kế độc bản dành cho giới sưu tầm. Sự kết hợp hoàn hảo
            giữa nghệ thuật chế tác và công nghệ hiện đại.
          </p>
          <Link
            to="/products?category=Limited"
            className="inline-block px-10 py-4 bg-transparent border border-[#C9A24D] text-[#C9A24D] font-bold uppercase tracking-widest hover:bg-[#C9A24D] hover:text-black transition-all duration-300"
          >
            Khám Phá Ngay
          </Link>
        </div>
      </section>

      {/* ================= 5. BRANDS (MONOCHROME) ================= */}
      {/* ================= 5. BRANDS (Authorized Dealer) ================= */}
      <section className="py-20 bg-[#0F172A] border-t border-white/5">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase mb-12 opacity-70">
            Authorized Dealer
          </p>

          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24">
            {[
              { label: "ROLEX", value: "Rolex" },
              { label: "SEIKO", value: "Seiko" },
              { label: "TISSOT", value: "Tissot" },
              { label: "ORIENT", value: "Orient" },
              { label: "FOSSIL", value: "Fossil" },
            ].map((brand) => (
              <Link
                key={brand.label}
                to={`/products?brand=${brand.value}`} // Link đến trang lọc brand
                className="group"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-white opacity-40 group-hover:opacity-100 group-hover:text-[#C9A24D] transition-all duration-500 font-serif tracking-tighter">
                  {brand.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
