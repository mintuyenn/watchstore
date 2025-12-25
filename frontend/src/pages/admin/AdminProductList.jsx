import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// 1. Import Toast
import toast, { Toaster } from "react-hot-toast";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";

// --- Helper Functions ---
const getImageUrl = (imagePath) => {
  const fallbackImage =
    "https://dummyimage.com/100x100/f3f4f6/9ca3af.png&text=No+Img";
  if (!imagePath || imagePath.trim() === "") return fallbackImage;
  if (imagePath.startsWith("http")) return imagePath;
  let fixedPath = imagePath.replace(/\\/g, "/");
  if (!fixedPath.startsWith("/")) fixedPath = "/" + fixedPath;
  return fixedPath;
};

// --- Components Con ---
const Spinner = ({ size = "h-5 w-5", color = "text-amber-600" }) => (
  <svg
    className={`animate-spin ${size} ${color}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const StockBadge = ({ stock }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center px-3 py-1 border border-red-500 text-red-600 text-[10px] uppercase font-bold tracking-wider">
        Hết hàng
      </span>
    );
  } else if (stock < 10) {
    return (
      <span className="inline-flex items-center px-3 py-1 border border-amber-500 text-amber-600 text-[10px] uppercase font-bold tracking-wider">
        Sắp hết ({stock})
      </span>
    );
  } else {
    return (
      <span className="inline-flex items-center px-3 py-1 border border-neutral-800 text-neutral-800 text-[10px] uppercase font-bold tracking-wider">
        Sẵn hàng ({stock})
      </span>
    );
  }
};

// --- 2. Custom Modal Component (Luxury Style) ---
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
  confirmText = "Xác nhận",
  type = "danger",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-md shadow-2xl border border-neutral-200 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="bg-neutral-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            {type === "danger" ? (
              <AlertTriangle size={18} className="text-amber-500" />
            ) : (
              <Package size={18} className="text-amber-500" />
            )}
            {title}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-8 text-center">
          <p className="text-neutral-600 text-lg font-light leading-relaxed">
            {message}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="bg-neutral-50 px-6 py-4 flex gap-4 justify-end border-t border-neutral-100">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all flex items-center gap-2
              ${
                type === "danger"
                  ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                  : "bg-neutral-900 hover:bg-amber-600 shadow-amber-500/20"
              }`}
          >
            {isLoading && <Spinner size="h-3 w-3" color="text-white" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Component Chính ---
export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // State cho Modal
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: "danger", // 'danger' | 'info'
    title: "",
    message: "",
    onConfirm: () => {},
    isLoading: false,
    confirmText: "Xác nhận",
  });

  const fetchAdminProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/products`);
      if (Array.isArray(data.products)) setProducts(data.products);
      else if (Array.isArray(data)) setProducts(data);
    } catch (err) {
      toast.error("Không thể tải danh sách sản phẩm.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  // --- Logic Mở Modal Xóa ---
  const openDeleteModal = (id, name) => {
    setModalConfig({
      isOpen: true,
      type: "danger",
      title: "Xác nhận xóa",
      message: `Bạn có chắc chắn muốn xóa sản phẩm "${name}"? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa Ngay",
      isLoading: false,
      onConfirm: async () => {
        // Logic khi bấm nút Xóa trong Modal
        setModalConfig((prev) => ({ ...prev, isLoading: true }));
        try {
          await axios.delete(`${API_URL}/api/products/${id}`);
          toast.success("Đã xóa sản phẩm thành công!");
          fetchAdminProducts();
          closeModal();
        } catch (err) {
          toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
          setModalConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
  };

  // --- Logic Mở Modal Tạo Mới ---
  const openCreateModal = () => {
    setModalConfig({
      isOpen: true,
      type: "info",
      title: "Tạo sản phẩm mới",
      message:
        "Hệ thống sẽ tạo một sản phẩm mẫu. Bạn sẽ được chuyển hướng để chỉnh sửa thông tin chi tiết.",
      confirmText: "Tạo Mới",
      isLoading: false,
      onConfirm: async () => {
        setModalConfig((prev) => ({ ...prev, isLoading: true }));
        try {
          const { data: createdProduct } = await axios.post(
            `${API_URL}/api/products`,
            {}
          );
          if (createdProduct._id) {
            toast.success("Tạo sản phẩm mẫu thành công!");
            navigate(`/admin/products/${createdProduct._id}/edit`);
          }
        } catch (err) {
          toast.error(`Lỗi: ${err.response?.data?.message || err.message}`);
          setModalConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
  };

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans min-h-screen">
      {/* --- 3. TOASTER Component (Nơi hiển thị thông báo) --- */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171717",
            color: "#fff",
            border: "1px solid #333",
            fontFamily: "sans-serif",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#10B981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />

      {/* --- CONFIRM MODAL --- */}
      <ConfirmModal {...modalConfig} onClose={closeModal} />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-3">
            <span className="w-10 h-1 bg-amber-500 block"></span>
            Sản Phẩm
          </h1>
          <p className="text-neutral-500 mt-2 text-sm font-light tracking-wide">
            Quản lý kho hàng cao cấp ({products.length})
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-amber-600 transition-colors" />
            <input
              type="text"
              placeholder="TÌM KIẾM..."
              className="pl-10 pr-4 py-2.5 bg-white border border-neutral-300 text-sm focus:outline-none focus:border-amber-600 focus:ring-0 w-full sm:w-64 transition-all placeholder:text-neutral-300 text-neutral-800 uppercase tracking-wider font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            onClick={openCreateModal} // Thay thế handleCreateProduct cũ
            className="bg-neutral-900 hover:bg-amber-600 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-amber-500/20"
          >
            <Plus size={16} />
            <span>Thêm Mới</span>
          </button>
        </div>
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white border border-neutral-200 shadow-xl shadow-neutral-100/50 animate-fade-in-up">
        {loading ? (
          <div className="text-center py-24">
            <Spinner size="h-10 w-10" color="text-neutral-800" />
            <p className="text-neutral-400 mt-4 text-xs uppercase tracking-widest">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Package
              size={48}
              className="text-neutral-200 mx-auto mb-4 stroke-1"
            />
            <h3 className="text-lg font-medium text-neutral-900 uppercase tracking-wider">
              Chưa có sản phẩm
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-900 text-amber-500">
                <tr>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] w-24 border-b-2 border-amber-600">
                    Ảnh
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Thông tin
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                    Giá Niêm Yết
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-center border-b-2 border-amber-600">
                    Trạng thái
                  </th>
                  <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-right border-b-2 border-amber-600">
                    Tác vụ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-amber-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="h-14 w-14 bg-white border border-neutral-200 p-1 shadow-sm">
                        <img
                          src={getImageUrl(product.images && product.images[0])}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <p
                          className="text-sm font-semibold text-neutral-900 truncate font-serif"
                          title={product.name}
                        >
                          {product.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-1 font-mono uppercase">
                          SKU: {product.sku || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-amber-700 font-mono tracking-tighter">
                        {product.price.toLocaleString("vi-VN")} ₫
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="text-neutral-400 hover:text-neutral-900 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} strokeWidth={1.5} />
                        </Link>
                        <button
                          // Thay thế onClick cũ bằng hàm mở Modal
                          onClick={() =>
                            openDeleteModal(product._id, product.name)
                          }
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
