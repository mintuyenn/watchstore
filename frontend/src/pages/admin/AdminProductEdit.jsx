import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Upload,
  Trash2,
  AlertCircle,
  Info,
  Image as ImageIcon,
  Layers,
  Settings,
  DollarSign,
} from "lucide-react";

// --- 1. Custom Components (Luxury Style) ---

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

const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5"
  >
    {children} {required && <span className="text-red-500">*</span>}
  </label>
);

const Input = ({ label, name, type = "text", error = "", ...props }) => (
  <div className="w-full">
    <Label htmlFor={name} required={props.required}>
      {label}
    </Label>
    <input
      type={type}
      id={name}
      name={name}
      {...props}
      className={`block w-full px-4 py-2.5 bg-neutral-50 border ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-neutral-200 focus:border-amber-600"
      } text-neutral-800 text-sm focus:outline-none focus:ring-0 transition-colors placeholder:text-neutral-300 font-medium`}
    />
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

const Select = ({ label, name, children, error = "", ...props }) => (
  <div className="w-full">
    <Label htmlFor={name} required={props.required}>
      {label}
    </Label>
    <div className="relative">
      <select
        id={name}
        name={name}
        {...props}
        className={`block w-full px-4 py-2.5 bg-neutral-50 border ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-neutral-200 focus:border-amber-600"
        } text-neutral-800 text-sm focus:outline-none focus:ring-0 transition-colors appearance-none font-medium`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500">
        <svg
          className="h-4 w-4 fill-current"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

const Textarea = ({ label, name, rows = 4, error = "", ...props }) => (
  <div className="w-full">
    <Label htmlFor={name} required={props.required}>
      {label}
    </Label>
    <textarea
      id={name}
      name={name}
      rows={rows}
      {...props}
      className={`block w-full px-4 py-2.5 bg-neutral-50 border ${
        error
          ? "border-red-500 focus:border-red-500"
          : "border-neutral-200 focus:border-amber-600"
      } text-neutral-800 text-sm focus:outline-none focus:ring-0 transition-colors placeholder:text-neutral-300 font-medium`}
    ></textarea>
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={10} /> {error}
      </p>
    )}
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 mb-5">
    <div className="p-1.5 bg-neutral-900 text-amber-500 rounded-sm">
      <Icon size={16} />
    </div>
    <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
      {title}
    </h2>
  </div>
);

// --- 2. Component Chính ---
export default function AdminProductEdit() {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: 0,
    stock: 0,
    category: "",
    description: "",
    images: [],
    movement: "",
    caseMaterial: "",
    strapMaterial: "",
    waterResistance: "",
    caseSize: "",
    glassType: "",
  });

  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Categories
        const catRes = await axios.get(`${API_URL}/api/categories`);
        if (Array.isArray(catRes.data)) setCategories(catRes.data);

        // Fetch Product
        const prodRes = await axios.get(`${API_URL}/api/products/${productId}`);
        const data = prodRes.data;

        setFormData({
          name: data.name || "",
          sku: data.sku || "",
          price: data.price || 0,
          stock: data.stock || 0,
          category: data.category?._id || data.category || "",
          description: data.description || "",
          images: data.images || [],
          movement: data.movement || "",
          caseMaterial: data.caseMaterial || "",
          strapMaterial: data.strapMaterial || "",
          waterResistance: data.waterResistance || "",
          caseSize: data.caseSize || "",
          glassType: data.glassType || "",
        });
      } catch (err) {
        toast.error(
          "Không thể tải dữ liệu: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadFormData = new FormData();
    uploadFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(
        `${API_URL}/api/upload`,
        uploadFormData,
        config
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, data.image],
      }));
      toast.success("Đã tải ảnh lên");
    } catch (err) {
      toast.error("Lỗi upload ảnh");
    } finally {
      setLoadingUpload(false);
      e.target.value = null;
    }
  };

  const handleDeleteImage = (imageToDelete) => {
    if (window.confirm("Xóa ảnh này khỏi danh sách?")) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((img) => img !== imageToDelete),
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim() || formData.name === "Tên sản phẩm mẫu")
      errors.name = "Tên sản phẩm là bắt buộc.";
    if (!formData.sku.trim() || formData.sku.startsWith("SKU_MAU_"))
      errors.sku = "Mã SKU là bắt buộc.";
    if (!formData.category) errors.category = "Vui lòng chọn danh mục.";
    if (formData.price <= 0) errors.price = "Giá bán phải lớn hơn 0.";
    if (formData.stock < 0) errors.stock = "Tồn kho không được âm.";
    if (!formData.images || formData.images.length === 0)
      errors.images = "Cần có ít nhất 1 ảnh.";

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Vui lòng kiểm tra lại các trường thông tin");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoadingSave(true);
    try {
      await axios.put(`${API_URL}/api/products/${productId}`, formData);
      toast.success("Cập nhật sản phẩm thành công!");
      // Chờ 1 chút để user thấy thông báo rồi mới chuyển trang
      setTimeout(() => navigate("/admin/products"), 1000);
    } catch (err) {
      toast.error(
        "Lỗi cập nhật: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoadingSave(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Spinner size="h-10 w-10" color="text-neutral-900" />
        <p className="mt-4 text-neutral-500 text-xs uppercase tracking-widest">
          Đang tải dữ liệu...
        </p>
      </div>
    );

  return (
    <div className="font-sans pb-20">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#171717", color: "#fff", fontSize: "14px" },
        }}
      />

      {/* --- Header & Back Button --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-amber-600 uppercase tracking-widest transition-colors mb-2"
          >
            <ArrowLeft size={14} /> Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-wide">
            {formData.name === "Tên sản phẩm mẫu"
              ? "Thêm Mới Sản Phẩm"
              : "Chỉnh Sửa Sản Phẩm"}
          </h1>
        </div>

        {/* Actions Button Group (Desktop) */}
        <div className="hidden md:flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2.5 border border-neutral-300 text-neutral-600 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loadingSave}
            className="bg-neutral-900 hover:bg-amber-600 text-white px-8 py-2.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all disabled:opacity-70"
          >
            {loadingSave ? (
              <Spinner size="h-4 w-4" color="text-white" />
            ) : (
              <Save size={16} />
            )}
            <span>Lưu Thay Đổi</span>
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* --- CỘT TRÁI (Thông tin chính) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Box 1: Thông tin cơ bản */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 group-hover:bg-amber-500 transition-colors"></div>
            <SectionHeader icon={Info} title="Thông tin chung" />

            <div className="space-y-5">
              <Input
                label="Tên sản phẩm"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={formErrors.name}
                placeholder="Nhập tên sản phẩm đầy đủ..."
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input
                  label="Mã SKU"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  error={formErrors.sku}
                  placeholder="VD: ROLEX-12345"
                />
                <Select
                  label="Thương hiệu (Danh mục)"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  error={formErrors.category}
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>
              <Textarea
                label="Mô tả sản phẩm"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                error={formErrors.description}
                placeholder="Mô tả chi tiết về sản phẩm..."
              />
            </div>
          </div>

          {/* Box 2: Hình ảnh */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 group-hover:bg-amber-500 transition-colors"></div>
            <SectionHeader icon={ImageIcon} title="Thư viện ảnh" />

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
              {formData.images.map((img, index) => (
                <div
                  key={index}
                  className="relative group/img aspect-square border border-neutral-200 bg-neutral-50 p-2 flex items-center justify-center"
                >
                  <img
                    src={
                      img.startsWith("http")
                        ? img
                        : `/${img.replace(/\\/g, "/")}`
                    }
                    alt={`Ảnh ${index}`}
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {/* Upload Button */}
              <label className="aspect-square border-2 border-dashed border-neutral-300 hover:border-amber-500 bg-neutral-50 hover:bg-white flex flex-col items-center justify-center cursor-pointer transition-all group/upload">
                {loadingUpload ? (
                  <Spinner />
                ) : (
                  <Upload
                    size={24}
                    className="text-neutral-400 group-hover/upload:text-amber-500 transition-colors"
                  />
                )}
                <span className="text-[10px] uppercase font-bold text-neutral-400 mt-2 group-hover/upload:text-amber-600">
                  Tải ảnh lên
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleUploadImage}
                  disabled={loadingUpload}
                />
              </label>
            </div>
            {formErrors.images && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={10} /> {formErrors.images}
              </p>
            )}
          </div>

          {/* Box 3: Thông số kỹ thuật */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 group-hover:bg-amber-500 transition-colors"></div>
            <SectionHeader icon={Settings} title="Thông số kỹ thuật" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Bộ máy (Movement)"
                name="movement"
                value={formData.movement}
                onChange={handleChange}
                placeholder="VD: Automatic Swiss Made"
              />
              <Input
                label="Chất liệu vỏ"
                name="caseMaterial"
                value={formData.caseMaterial}
                onChange={handleChange}
                placeholder="VD: Thép không gỉ 316L"
              />
              <Input
                label="Chất liệu dây"
                name="strapMaterial"
                value={formData.strapMaterial}
                onChange={handleChange}
                placeholder="VD: Da cá sấu"
              />
              <Input
                label="Kích thước mặt"
                name="caseSize"
                value={formData.caseSize}
                onChange={handleChange}
                placeholder="VD: 40 mm"
              />
              <Input
                label="Mặt kính"
                name="glassType"
                value={formData.glassType}
                onChange={handleChange}
                placeholder="VD: Sapphire nguyên khối"
              />
              <Input
                label="Độ chịu nước"
                name="waterResistance"
                value={formData.waterResistance}
                onChange={handleChange}
                placeholder="VD: 5 ATM"
              />
            </div>
          </div>
        </div>

        {/* --- CỘT PHẢI (Giá & Cấu hình) --- */}
        <div className="lg:col-span-1 space-y-8">
          {/* Box 4: Giá bán & Kho */}
          <div className="bg-white border border-neutral-200 p-6 shadow-sm relative overflow-hidden group hover:border-amber-500/30 transition-colors sticky top-6">
            <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 group-hover:bg-amber-500 transition-colors"></div>
            <SectionHeader icon={DollarSign} title="Giá & Kho hàng" />

            <div className="space-y-5">
              <div>
                <Input
                  label="Giá Niêm Yết (VNĐ)"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  error={formErrors.price}
                  placeholder="0"
                />
                <p className="text-[10px] text-neutral-400 mt-1 italic text-right">
                  Hiển thị:{" "}
                  {formData.price ? formData.price.toLocaleString("vi-VN") : 0}{" "}
                  ₫
                </p>
              </div>

              <Input
                label="Số lượng tồn kho"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                error={formErrors.stock}
              />

              <div className="p-4 bg-neutral-50 border border-neutral-100 rounded-sm">
                <h4 className="text-xs font-bold text-neutral-900 uppercase mb-2">
                  Trạng thái hiển thị
                </h4>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.stock > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <span className="text-xs text-neutral-600 font-medium">
                    {formData.stock > 0
                      ? "Đang kinh doanh"
                      : "Hết hàng (Tạm ẩn)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Action Button */}
            <div className="mt-8 pt-4 border-t border-neutral-100 md:hidden">
              <button
                onClick={handleSubmit}
                disabled={loadingSave}
                className="w-full bg-neutral-900 hover:bg-amber-600 text-white px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70"
              >
                {loadingSave ? (
                  <Spinner size="h-4 w-4" color="text-white" />
                ) : (
                  <Save size={16} />
                )}
                <span>Lưu Sản Phẩm</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
