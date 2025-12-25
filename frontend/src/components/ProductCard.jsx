import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { FaStar } from "react-icons/fa"; // Import icon ngôi sao
import { useCart } from "../hooks/useCart";

// --- Hàm lấy URL ảnh ---
const getImageUrl = (imagePath) => {
  const fallbackImage =
    "https://dummyimage.com/400x400/1a1a1a/555555.png&text=Luxury+Watch";
  if (!imagePath || imagePath.trim() === "") return fallbackImage;
  if (imagePath.startsWith("http")) return imagePath;
  let fixedPath = imagePath.replace(/\\/g, "/");
  if (!fixedPath.startsWith("/")) fixedPath = "/" + fixedPath;
  return `${fixedPath}`;
};

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const { _id, name, images, price, oldPrice, stock, avgRating } = product; // Lấy thêm avgRating

  // Lấy ảnh đầu tiên
  const imageUrl = getImageUrl(images && images.length > 0 ? images[0] : null);

  // Tính toán giảm giá
  let discountPercent = 0;
  if (oldPrice && oldPrice > 0 && oldPrice > price) {
    discountPercent = Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) addToCart(product, 1);
  };

  return (
    <div className="group relative flex flex-col h-full w-full bg-[#111827] rounded-none border border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-1">
      {/* Link bao bọc */}
      <Link
        to={`/product/${_id}`}
        className="flex flex-col flex-grow relative overflow-hidden"
      >
        {/* --- BADGES --- */}
        <div className="absolute top-0 left-0 w-full flex justify-between p-3 z-20">
          {discountPercent > 0 ? (
            <span className="bg-amber-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              -{discountPercent}%
            </span>
          ) : (
            <span className="bg-white/10 backdrop-blur-sm text-gray-300 text-[10px] font-bold px-3 py-1 uppercase tracking-widest border border-white/10">
              New
            </span>
          )}

          {stock === 0 && (
            <span className="bg-red-900/80 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
              Sold Out
            </span>
          )}
        </div>

        {/* --- IMAGE AREA --- */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#0B0F14]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-60 z-10" />

          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="relative z-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
          />

          {/* Action Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/20 backdrop-blur-[2px]">
            {stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="mx-2 flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A24D] text-white shadow-lg transition-transform duration-300 hover:bg-white hover:text-black hover:scale-110"
                title="Thêm vào giỏ"
              >
                <ShoppingCart size={20} />
              </button>
            )}
            <div className="mx-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 hover:bg-[#C9A24D] hover:text-white hover:scale-110">
              <Eye size={20} />
            </div>
          </div>
        </div>

        {/* --- INFO AREA --- */}
        <div className="flex flex-col flex-grow p-5 text-center bg-[#111827]">
          {/* Brand Name */}
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24D] mb-2 opacity-80">
            {product.category?.name || "Exclusive Timepiece"}
          </p>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 leading-relaxed group-hover:text-[#C9A24D] transition-colors">
            {name}
          </h3>

          {/* --- RATING SECTION (Mới thêm) --- */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  size={10}
                  className={
                    index < Math.round(avgRating || 0)
                      ? "text-[#C9A24D]"
                      : "text-gray-700"
                  }
                />
              ))}
            </div>
            {avgRating > 0 && (
              <span className="text-[10px] text-gray-500 font-mono">
                ({avgRating})
              </span>
            )}
          </div>
          {/* --------------------------------- */}

          {/* Divider */}
          <div className="w-8 h-[1px] bg-white/10 mx-auto mb-3"></div>

          {/* Price */}
          <div className="mt-auto flex flex-col items-center gap-1">
            {discountPercent > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xs line-through font-light">
                  {oldPrice.toLocaleString("vi-VN")} ₫
                </span>
                <span className="text-base font-bold text-white">
                  {price.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-white">
                {price.toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
