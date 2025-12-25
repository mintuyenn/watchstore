import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom"; // 1. Thêm useNavigate
import { fetchProducts } from "../services/product";
import ProductCard from "../components/ProductCard";
import { Filter, SearchX, ChevronDown } from "lucide-react";

// Hàm helper lấy query string
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Bộ Sưu Tập");
  const [subTitle, setSubTitle] = useState(
    "Khám phá những tuyệt tác thời gian"
  );

  const query = useQuery();
  const location = useLocation();
  const navigate = useNavigate(); // 2. Hook điều hướng

  // 3. Hàm xử lý khi chọn Sort
  const handleSortChange = (e) => {
    const value = e.target.value;
    const searchParams = new URLSearchParams(location.search);

    if (value) {
      searchParams.set("sort", value);
    } else {
      searchParams.delete("sort"); // Nếu chọn mặc định thì xóa param sort cho gọn URL
    }

    // Cập nhật URL -> useEffect sẽ tự chạy lại để fetch dữ liệu mới
    navigate({ search: searchParams.toString() });
  };

  useEffect(() => {
    // 4. Phân tích URL
    const keyword = query.get("keyword");
    const brand = query.get("brand");
    const movement = query.get("movement");
    const gender = query.get("gender");
    const sort = query.get("sort"); // Lấy tham số sort

    const params = {};

    // Cập nhật Title & Params
    if (keyword) {
      params.keyword = keyword;
      setTitle(`Tìm kiếm: "${keyword}"`);
      setSubTitle("Kết quả phù hợp với từ khóa của bạn");
    } else if (brand) {
      params.brand = brand;
      setTitle(`Thương hiệu ${brand}`);
      setSubTitle(`Đẳng cấp và di sản từ ${brand}`);
    } else if (movement) {
      params.movement = movement;
      setTitle(`Đồng hồ ${movement}`);
      setSubTitle("Cỗ máy thời gian bền bỉ");
    } else if (gender) {
      params.gender = gender;
      setTitle(gender === "male" ? "Đồng Hồ Nam" : "Đồng Hồ Nữ");
      setSubTitle(
        gender === "male" ? "Bản lĩnh phái mạnh" : "Thanh lịch phái đẹp"
      );
    } else {
      setTitle("Tất Cả Sản Phẩm");
      setSubTitle("Khám phá bộ sưu tập đầy đủ của chúng tôi");
    }

    // 5. Đưa sort vào params gọi API
    if (sort) {
      params.sort = sort;
    }

    // Gọi API
    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(params);

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải trang sản phẩm:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]); // Chạy lại khi URL thay đổi

  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-200 font-sans selection:bg-[#C9A24D] selection:text-black pt-8 pb-20">
      <div className="container mx-auto px-6">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/5 pb-6 gap-4">
          <div>
            <span className="text-[#C9A24D] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
              Exclusive Collection
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-wide">
              {title}
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-light">{subTitle}</p>
          </div>

          {/* --- FILTER & SORT SECTION --- */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {!loading && products.length > 0 && (
              <div className="text-gray-400 text-xs tracking-widest uppercase hidden sm:block">
                {products.length} sản phẩm
              </div>
            )}

            {/* SORT DROPDOWN */}
            <div className="relative group">
              <select
                onChange={handleSortChange}
                value={query.get("sort") || ""}
                className="appearance-none bg-[#0F172A] border border-white/10 text-gray-300 text-sm py-2 pl-4 pr-10 hover:border-[#C9A24D] focus:border-[#C9A24D] focus:outline-none transition-colors cursor-pointer w-full sm:w-auto"
              >
                <option value="">Mới nhất</option>
                <option value="price_asc">Giá: Thấp đến Cao</option>
                <option value="price_desc">Giá: Cao đến Thấp</option>
                <option value="oldest">Cũ nhất</option>
              </select>
              {/* Icon mũi tên tùy chỉnh cho select */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#C9A24D] transition-colors">
                <ChevronDown size={14} />
              </div>
            </div>

            {/* Nút bộ lọc (Placeholder cho tính năng nâng cao sau này) */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 bg-[#0F172A] hover:border-[#C9A24D] text-sm text-gray-300 hover:text-[#C9A24D] transition-colors">
              <Filter size={14} />{" "}
              <span className="hidden sm:inline">Bộ lọc</span>
            </button>
          </div>
        </div>

        {/* --- CONTENT SECTION --- */}
        {loading ? (
          // Loading State
          <div className="min-h-[400px] flex flex-col items-center justify-center">
            <div className="h-10 w-10 border-t-2 border-b-2 border-[#C9A24D] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-xs tracking-widest uppercase animate-pulse">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              // Product Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="min-h-[400px] flex flex-col items-center justify-center text-center border border-white/5 bg-[#0F172A] p-10 rounded-sm">
                <div className="bg-[#0B0F14] p-4 rounded-full mb-4">
                  <SearchX
                    size={48}
                    className="text-gray-600"
                    strokeWidth={1}
                  />
                </div>
                <h3 className="text-xl text-white font-bold mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-400 max-w-md mx-auto mb-8 font-light">
                  Rất tiếc, chúng tôi không tìm thấy mẫu đồng hồ nào phù hợp với
                  tiêu chí của bạn.
                </p>
                <Link
                  to="/products"
                  className="px-8 py-3 bg-[#C9A24D] text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                >
                  Xem tất cả bộ sưu tập
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
