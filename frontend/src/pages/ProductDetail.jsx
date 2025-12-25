import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductById } from "../services/product";
import { useCart } from "../hooks/useCart";
import {
  FaShieldAlt,
  FaTruck,
  FaSyncAlt,
  FaCheckCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaSpinner,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaUserCircle,
  FaQuoteLeft,
} from "react-icons/fa";

// --- Helper: Lấy URL ảnh ---
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://dummyimage.com/600x600/cccccc/ffffff.png&text=No+Image";
  }
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  const base = "";
  return `${base}${imagePath}`;
};

// --- Helper: Format Ngày tháng ---
const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// --- Helper: Render Sao ---
const renderStars = (rating) => {
  return (
    <div className="flex text-[#C9A24D] text-sm gap-0.5">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return starValue <= rating ? (
          <FaStar key={index} />
        ) : (
          <FaRegStar key={index} className="text-gray-600" />
        );
      })}
    </div>
  );
};

// --- Helper: Component Thông số ---
const SpecItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-white/5 py-3 text-sm last:border-b-0 group hover:bg-white/5 px-2 transition-colors rounded-sm">
    <span className="font-medium text-gray-400 group-hover:text-[#C9A24D] transition-colors">
      {label}:
    </span>
    <span className="text-right font-medium text-white font-mono">
      {value || "N/A"}
    </span>
  </div>
);

// --- Component Spinner ---
const Spinner = () => (
  <FaSpinner className="animate-spin text-4xl text-[#C9A24D]" />
);

// --- Component Chính ---
export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  // States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [addedMessage, setAddedMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch dữ liệu
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProductById(id);
        setProduct(data);

        if (data.images && data.images.length > 0) {
          setMainImage(data.images[0]);
        } else {
          setMainImage(data.image || "");
        }
      } catch (err) {
        console.error("❌ Lỗi tải chi tiết sản phẩm:", err);
        setProduct(null);
        setError("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Hàm xử lý số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) setQuantity(quantity + 1);
  };

  const handleQuantityChange = (event) => {
    let value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) value = 1;
    else if (product && value > product.stock) {
      value = product.stock;
    }
    setQuantity(value);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAddedMessage(`${quantity} "${product.name}" đã được thêm vào giỏ hàng!`);
    setTimeout(() => setAddedMessage(""), 3000);
  };

  // --- Logic hiển thị (Loading, Error) ---
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#12161C] border border-red-500/30 p-8 rounded-sm text-center shadow-2xl">
          <FaExclamationTriangle className="mx-auto text-4xl text-red-500 mb-4" />
          <p className="text-white text-lg font-bold mb-2">Đã xảy ra lỗi</p>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#C9A24D] hover:text-white transition-colors uppercase font-bold text-sm tracking-wider"
          >
            <FaArrowLeft /> Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-gray-400">
        <p className="mb-4 text-xl">Rất tiếc, không tìm thấy sản phẩm này.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#C9A24D] hover:text-white transition-colors uppercase font-bold text-sm tracking-wider"
        >
          <FaArrowLeft /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const reviewCount = product.reviews ? product.reviews.length : 0;

  // --- Render ---
  return (
    <div className="min-h-screen bg-[#0B0F14] text-gray-300 py-12 px-4 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C9A24D]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#C9A24D] transition-colors mb-8 text-sm uppercase tracking-wider font-semibold"
        >
          <FaArrowLeft /> Quay lại mua sắm
        </Link>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-start">
          {/* ----- BÊN TRÁI: THƯ VIỆN ẢNH ----- */}
          <div className="sticky top-24 space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-sm bg-white border-4 border-[#1A1F29] shadow-2xl relative group">
              <img
                src={getImageUrl(mainImage)}
                alt={`Ảnh chính ${product.name}`}
                className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images?.slice(0, 5).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm border-2 bg-white transition-all duration-300 ${
                    mainImage === img
                      ? "border-[#C9A24D] ring-2 ring-[#C9A24D]/30 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100 hover:border-[#C9A24D]"
                  }`}
                >
                  <img
                    src={getImageUrl(img)}
                    alt={`Ảnh ${index + 1}`}
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* ----- BÊN PHẢI: THÔNG TIN & MUA HÀNG ----- */}
          <div>
            {/* Header Info */}
            <span className="mb-2 block text-sm font-bold uppercase tracking-[0.2em] text-[#C9A24D]">
              {product.category?.name || "Premium Watch"}
            </span>
            <h1 className="mb-2 text-3xl md:text-4xl font-bold text-white leading-tight">
              {product.name}
            </h1>

            {/* --- NEW: RATING SECTION --- */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(product.avgRating || 0)}
              </div>
              <span className="text-gray-400 text-sm border-l border-gray-700 pl-3">
                {reviewCount > 0 ? (
                  <>
                    <span className="text-white font-bold">{reviewCount}</span>{" "}
                    đánh giá
                  </>
                ) : (
                  "Chưa có đánh giá"
                )}
              </span>
            </div>
            {/* --------------------------- */}

            <div className="mb-6 flex items-end gap-4 border-b border-white/10 pb-6">
              <p className="text-3xl md:text-4xl font-bold text-[#C9A24D] font-mono">
                {product.price.toLocaleString("vi-VN")} ₫
              </p>

              <div
                className={`flex items-center gap-2 mb-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                  !isOutOfStock
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                <FaCheckCircle size={12} />
                <span>
                  {!isOutOfStock ? `Còn hàng (${product.stock})` : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Controller & Action */}
            <div className="mb-8 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold">
                  Số lượng:
                </span>
                <div className="flex items-center">
                  <button
                    onClick={decreaseQuantity}
                    disabled={isOutOfStock || quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center bg-[#1A1F29] border border-white/10 text-white hover:border-[#C9A24D] hover:text-[#C9A24D] disabled:opacity-30 disabled:hover:border-white/10 transition-colors rounded-l-sm"
                  >
                    <FaMinus size={10} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    disabled={isOutOfStock}
                    className="w-16 h-10 bg-[#0B0F14] border-y border-white/10 text-center text-white font-mono focus:outline-none focus:border-[#C9A24D]"
                  />
                  <button
                    onClick={increaseQuantity}
                    disabled={isOutOfStock || quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center bg-[#1A1F29] border border-white/10 text-white hover:border-[#C9A24D] hover:text-[#C9A24D] disabled:opacity-30 disabled:hover:border-white/10 transition-colors rounded-r-sm"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full md:w-auto min-w-[250px] flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-widest rounded-sm transition-all duration-300 shadow-[0_0_20px_rgba(201,162,77,0.15)] hover:shadow-[0_0_30px_rgba(201,162,77,0.3)] ${
                  !isOutOfStock
                    ? "bg-[#C9A24D] text-[#0B0F14] hover:bg-white hover:text-[#0B0F14]"
                    : "bg-[#1A1F29] text-gray-500 cursor-not-allowed border border-white/5"
                }`}
              >
                <FaShoppingCart />
                {!isOutOfStock ? "Thêm vào giỏ hàng" : "Tạm hết hàng"}
              </button>

              {addedMessage && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-sm text-sm">
                  <FaCheckCircle />
                  {addedMessage}
                  <Link
                    to="/cart"
                    className="font-bold underline ml-1 hover:text-white"
                  >
                    Xem giỏ
                  </Link>
                </div>
              )}
            </div>

            {/* Policies */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-[#12161C] border border-white/5 rounded-sm hover:border-[#C9A24D]/30 transition-colors">
                <FaShieldAlt className="text-[#C9A24D] text-xl flex-shrink-0" />
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  Bảo hành chính hãng
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#12161C] border border-white/5 rounded-sm hover:border-[#C9A24D]/30 transition-colors">
                <FaTruck className="text-[#C9A24D] text-xl flex-shrink-0" />
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  Miễn phí vận chuyển
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#12161C] border border-white/5 rounded-sm hover:border-[#C9A24D]/30 transition-colors">
                <FaSyncAlt className="text-[#C9A24D] text-xl flex-shrink-0" />
                <span className="text-xs text-gray-300 uppercase tracking-wide">
                  Đổi trả dễ dàng
                </span>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-[#12161C] border border-white/5 rounded-sm p-6 mb-8">
              <h4 className="mb-4 text-sm font-bold text-white uppercase tracking-widest border-l-4 border-[#C9A24D] pl-3">
                Thông số kỹ thuật
              </h4>
              <div className="space-y-1">
                <SpecItem label="Thương hiệu" value={product.category?.name} />
                <SpecItem label="Mã SKU" value={product.sku} />
                <SpecItem label="Bộ máy" value={product.movement} />
                <SpecItem label="Chất liệu vỏ" value={product.caseMaterial} />
                <SpecItem label="Chất liệu dây" value={product.strapMaterial} />
                <SpecItem label="Chống nước" value={product.waterResistance} />
                <SpecItem
                  label="Kích thước mặt"
                  value={product.caseSize ? `${product.caseSize} mm` : "N/A"}
                />
                <SpecItem label="Mặt kính" value={product.glassType} />
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="mb-8 text-center text-2xl font-bold text-white uppercase tracking-widest flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#C9A24D]"></span>
              Mô tả chi tiết
              <span className="h-px w-12 bg-[#C9A24D]"></span>
            </h3>

            <div className="prose prose-invert prose-lg max-w-none text-gray-400 leading-relaxed bg-[#12161C] p-8 rounded-sm border border-white/5 shadow-inner">
              {product.description?.split("\n").map(
                (paragraph, index) =>
                  paragraph.trim() && (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  )
              )}
              {!product.description && (
                <p className="text-center italic opacity-50">
                  Đang cập nhật mô tả cho sản phẩm này.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* --- NEW: REVIEWS SECTION --- */}
        <div className="mt-16 pt-10 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="mb-8 text-center text-2xl font-bold text-white uppercase tracking-widest flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-[#C9A24D]"></span>
              Đánh giá từ khách hàng
              <span className="h-px w-12 bg-[#C9A24D]"></span>
            </h3>

            {/* Review Summary & List Container */}
            <div className="bg-[#12161C] p-8 rounded-sm border border-white/5">
              {/* Summary Header */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/5">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="text-5xl font-bold text-[#C9A24D]">
                    {product.avgRating || 0}/5
                  </div>
                  <div>
                    <div className="flex text-lg">
                      {renderStars(product.avgRating || 0)}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">
                      Dựa trên {reviewCount} nhận xét
                    </p>
                  </div>
                </div>

                <span className="px-6 py-2 border border-[#C9A24D] text-[#C9A24D] hover:bg-[#C9A24D] hover:text-[#0B0F14] transition-all uppercase text-sm font-bold tracking-wider rounded-sm">
                  Trải nghiệm của khách hàng
                </span>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review._id} className="group">
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 flex-shrink-0">
                          <FaUserCircle size={24} />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                            <h5 className="text-white font-bold">
                              {review.userName || "Người dùng ẩn danh"}
                            </h5>
                            <span className="text-xs text-gray-500 font-mono mt-1 sm:mt-0">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>

                          <div className="mb-2">
                            {renderStars(review.rating)}
                          </div>

                          <div className="relative pl-4 mt-2 border-l-2 border-[#C9A24D]/30">
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Divider for next item */}
                      <div className="h-px bg-white/5 mt-6 group-last:hidden"></div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FaQuoteLeft className="mx-auto text-3xl text-gray-600 mb-3" />
                    <p className="text-gray-400">
                      Chưa có đánh giá nào cho sản phẩm này.
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Hãy là người đầu tiên chia sẻ cảm nhận!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
