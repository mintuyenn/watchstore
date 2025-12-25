import React, { useState } from "react";
import axios from "axios";
import { Star, X } from "lucide-react";
import toast from "react-hot-toast";

const ProductReviewModal = ({ isOpen, onClose, product, onReviewSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`/api/products/${product.product}/reviews`, {
        rating,
        comment,
      });
      toast.success("Cảm ơn bạn đã đánh giá!");
      onReviewSuccess(); // Callback để reload hoặc đóng modal
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi gửi đánh giá");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative animate-fadeIn">
        {/* Header */}
        <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg">Đánh giá sản phẩm</h3>
          <button onClick={onClose} className="hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={
                product.image?.startsWith("http")
                  ? product.image
                  : `/${product.image}`
              }
              alt={product.name}
              className="w-12 h-12 object-cover rounded border"
            />
            <p className="font-medium text-gray-800 line-clamp-2">
              {product.name}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Chọn sao */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chất lượng sản phẩm
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Bình luận */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nhận xét của bạn
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {loading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewModal;
