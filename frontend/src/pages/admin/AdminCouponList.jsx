import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Ticket,
  Plus,
  Trash2,
  AlertTriangle,
  X,
  Calendar,
  DollarSign,
  Percent,
  Tag,
} from "lucide-react";

// --- 1. COMPONENTS CON (Style Luxury) ---

const Spinner = ({ size = "h-4 w-4", color = "text-amber-600" }) => (
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

// Input Style mới
const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  min,
}) => (
  <div className="w-full">
    <label
      htmlFor={name}
      className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5"
    >
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      min={min}
      className="block w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-800 text-sm focus:outline-none focus:border-amber-600 focus:ring-0 transition-colors placeholder:text-neutral-300 font-medium"
    />
  </div>
);

// Select Style mới
const Select = ({ label, name, value, onChange, children }) => (
  <div className="w-full">
    <label
      htmlFor={name}
      className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5"
    >
      {label}
    </label>
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 text-neutral-800 text-sm focus:outline-none focus:border-amber-600 focus:ring-0 transition-colors appearance-none font-medium"
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
  </div>
);

// Modal Xác nhận Xóa
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/80 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-md shadow-2xl border border-neutral-200 animate-in fade-in zoom-in duration-200">
        <div className="bg-neutral-900 px-6 py-4 flex justify-between items-center">
          <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
            <AlertTriangle size={18} className="text-amber-500" /> {title}
          </h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-neutral-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-8 text-center">
          <p className="text-neutral-600 text-lg font-light leading-relaxed">
            {message}
          </p>
        </div>
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
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            {isLoading && <Spinner size="h-3 w-3" color="text-white" />} Xóa
            Ngay
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper Format
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN");
};
const formatCurrency = (num) => num.toLocaleString("vi-VN") + " ₫";

// --- 2. COMPONENT CHÍNH ---
export default function AdminCouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    expiryDate: "",
    minPurchase: 0,
  });
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    id: null,
    code: "",
    isLoading: false,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/coupons");
      setCoupons(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tải danh sách mã");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setNewCoupon((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    const dataToSend = { ...newCoupon, code: newCoupon.code.toUpperCase() };
    const API_URL = import.meta.env.VITE_API_URL;

    try {
      const { data: createdCoupon } = await axios.post(
        `${API_URL}/api/coupons`,
        dataToSend
      );
      setCoupons([createdCoupon, ...coupons]);
      setNewCoupon({
        code: "",
        discountType: "percentage",
        discountValue: 10,
        expiryDate: "",
        minPurchase: 0,
      });
      toast.success("Tạo mã giảm giá thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi tạo mã");
    } finally {
      setLoadingCreate(false);
    }
  };

  // Logic Xóa
  const openDeleteModal = (id, code) => {
    setModalConfig({ isOpen: true, id, code, isLoading: false });
  };

  const handleDeleteCoupon = async () => {
    const { id } = modalConfig;
    if (!id) return;
    const API_URL = import.meta.env.VITE_API_URL;

    setModalConfig((prev) => ({ ...prev, isLoading: true }));
    try {
      await axios.delete(`${API_URL}/api/coupons/${id}`);
      setCoupons(coupons.filter((c) => c._id !== id));
      toast.success("Đã xóa mã thành công");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa mã");
      setModalConfig((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const closeModal = () =>
    setModalConfig({ isOpen: false, id: null, code: "", isLoading: false });

  return (
    <div className="space-y-8 font-sans min-h-screen pb-20">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#171717", color: "#fff", fontSize: "14px" },
        }}
      />

      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={handleDeleteCoupon}
        title="Xóa Mã Giảm Giá"
        message={`Bạn có chắc chắn muốn xóa mã "${modalConfig.code}"? Khách hàng sẽ không thể sử dụng mã này nữa.`}
        isLoading={modalConfig.isLoading}
      />

      {/* --- HEADER --- */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-bold text-neutral-900 uppercase tracking-widest flex items-center gap-3">
          <span className="w-10 h-1 bg-amber-500 block"></span>
          MÃ KHUYẾN MÃI
        </h1>
        <p className="text-neutral-500 mt-2 text-sm font-light tracking-wide">
          Quản lý các chương trình giảm giá ({coupons.length})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- FORM TẠO MỚI (CỘT TRÁI) --- */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-neutral-200 p-6 shadow-xl shadow-neutral-100/50 sticky top-6">
            <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-3">
              <div className="p-1.5 bg-neutral-900 text-amber-500 rounded-sm">
                <Plus size={16} />
              </div>
              <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-widest">
                Tạo mã mới
              </h2>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-5">
              <Input
                label="Mã Code"
                name="code"
                value={newCoupon.code}
                onChange={handleFormChange}
                placeholder="VD: SALE10"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Loại giảm"
                  name="discountType"
                  value={newCoupon.discountType}
                  onChange={handleFormChange}
                >
                  <option value="percentage">Phần trăm (%)</option>
                  <option value="fixed">Số tiền (₫)</option>
                </Select>
                <Input
                  label="Giá trị"
                  name="discountValue"
                  type="number"
                  value={newCoupon.discountValue}
                  onChange={handleFormChange}
                  required
                  min="0"
                />
              </div>

              <Input
                label="Ngày hết hạn"
                name="expiryDate"
                type="date"
                value={newCoupon.expiryDate}
                onChange={handleFormChange}
                required
              />
              <Input
                label="Đơn tối thiểu (₫)"
                name="minPurchase"
                type="number"
                value={newCoupon.minPurchase}
                onChange={handleFormChange}
                min="0"
              />

              <button
                type="submit"
                disabled={loadingCreate}
                className="w-full mt-2 bg-neutral-900 hover:bg-amber-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70"
              >
                {loadingCreate ? (
                  <Spinner size="h-4 w-4" color="text-white" />
                ) : (
                  <Tag size={16} />
                )}
                {loadingCreate ? "Đang xử lý..." : "Tạo Mã Ngay"}
              </button>
            </form>
          </div>
        </div>

        {/* --- DANH SÁCH MÃ (CỘT PHẢI) --- */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-neutral-200 shadow-xl shadow-neutral-100/50">
            {loading ? (
              <div className="text-center py-24">
                <Spinner size="h-10 w-10" color="text-neutral-800" />
                <p className="text-neutral-400 mt-4 text-xs uppercase tracking-widest">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-20 px-4">
                <Ticket
                  size={48}
                  className="text-neutral-200 mx-auto mb-4 stroke-1"
                />
                <h3 className="text-lg font-medium text-neutral-900 uppercase tracking-wider">
                  Chưa có mã giảm giá
                </h3>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-neutral-900 text-amber-500">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                        Mã Code
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                        Giảm
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                        Đơn tối thiểu
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] border-b-2 border-amber-600">
                        Hạn dùng
                      </th>
                      <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-[0.15em] text-right border-b-2 border-amber-600">
                        Xóa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {coupons.map((coupon) => (
                      <tr
                        key={coupon._id}
                        className="hover:bg-amber-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-amber-700 font-bold font-mono text-sm tracking-tight border border-amber-200 bg-amber-50 px-2 py-1 inline-block rounded-sm border-dashed">
                            <Ticket size={14} /> {coupon.code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                            {coupon.discountType === "percentage" ? (
                              <Percent size={14} className="text-neutral-400" />
                            ) : (
                              <DollarSign
                                size={14}
                                className="text-neutral-400"
                              />
                            )}
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}%`
                              : formatCurrency(coupon.discountValue)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-neutral-600 font-mono">
                          {formatCurrency(coupon.minPurchase)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-neutral-500 text-xs uppercase font-medium">
                            <Calendar size={14} />{" "}
                            {formatDate(coupon.expiryDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              openDeleteModal(coupon._id, coupon.code)
                            }
                            className="text-neutral-300 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-sm"
                            title="Xóa mã"
                          >
                            <Trash2 size={18} strokeWidth={1.5} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
