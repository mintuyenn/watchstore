import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertCircle,
  Calendar,
  BarChart2,
  Filter,
  RefreshCw,
} from "lucide-react";

// --- IMPORT BIỂU ĐỒ CỘT (BAR) ---
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// --- ĐĂNG KÝ BAR ELEMENT ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// --- (Các helper) ---
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0 ₫";
  return amount.toLocaleString("vi-VN") + " ₫";
};
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

// Spinner Gold
const Spinner = () => (
  <svg
    className="animate-spin h-8 w-8 text-[#C9A24D]"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    {" "}
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>{" "}
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>{" "}
  </svg>
);

// Component thẻ thống kê (KPI Card - Dark Mode)
const StatCard = ({ title, value, icon, iconBgClass, iconColorClass }) => (
  <div className="bg-[#12161C] p-6 rounded-sm border border-white/5 flex items-start gap-4 transition-all duration-300 hover:border-[#C9A24D]/50 hover:shadow-[0_0_15px_rgba(201,162,77,0.1)] group">
    <div
      className={`p-3 rounded-full ${iconBgClass} ${iconColorClass} group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl font-bold text-white mt-1 font-mono">{value}</p>
    </div>
  </div>
);

// --- COMPONENT DASHBOARD CHÍNH ---
export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());

  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  // Hàm gọi API
  const fetchStats = async (start, end) => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (start) params.append("startDate", start.toISOString());
      if (end) params.append("endDate", end.toISOString());

      const { data } = await axios.get(
        `${API_URL}/api/orders/stats?${params.toString()}`
      );

      setKpiData(data.kpi);
      setChartData(data.chartData);
      setTopProducts(data.topProducts);
      setRecentOrders(data.recentOrders);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(startDate, endDate);
  }, []);

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    fetchStats(startDate, endDate);
  };

  const clearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    fetchStats(null, null);
  };

  // Helper tạo URL Filter cho Đơn hàng
  const buildOrderFilterUrl = () => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());
    params.append("view", "revenue");
    return `/admin/orders?${params.toString()}`;
  };

  // --- CẤU HÌNH BIỂU ĐỒ (DARK MODE) ---
  const barChartData = {
    labels: chartData?.map((d) => formatDateTime(d._id)) || [],
    datasets: [
      {
        label: "Doanh thu",
        data: chartData?.map((d) => d.dailyRevenue) || [],
        backgroundColor: "#C9A24D", // Màu vàng kim
        hoverBackgroundColor: "#E0B969",
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#9CA3AF" }, // Chữ legend màu xám sáng
      },
      title: { display: false },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#fff",
        bodyColor: "#C9A24D",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#6B7280" }, // Màu trục Y
        grid: { color: "rgba(255, 255, 255, 0.05)" }, // Lưới mờ
      },
      x: {
        ticks: { color: "#6B7280" }, // Màu trục X
        grid: { display: false },
      },
    },
  };

  // --- (RENDER) ---
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">
            Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Tổng quan tình hình kinh doanh
          </p>
        </div>
      </div>

      {/* --- BỘ LỌC NGÀY (DARK THEME) --- */}
      <div className="bg-[#12161C] p-4 rounded-sm border border-white/5 flex flex-wrap items-center gap-4 shadow-lg">
        <div className="flex items-center gap-2 text-[#C9A24D]">
          <Filter size={20} />
          <span className="font-bold text-sm uppercase tracking-wide">
            Bộ lọc:
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#0B0F14] px-3 py-2 rounded-sm border border-white/10">
          <Calendar size={16} className="text-gray-500" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Ngày bắt đầu"
            className="bg-transparent text-sm text-white focus:outline-none w-28 placeholder-gray-600"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <span className="text-gray-500">-</span>

        <div className="flex items-center gap-2 bg-[#0B0F14] px-3 py-2 rounded-sm border border-white/10">
          <Calendar size={16} className="text-gray-500" />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="Ngày kết thúc"
            className="bg-transparent text-sm text-white focus:outline-none w-28 placeholder-gray-600"
            dateFormat="dd/MM/yyyy"
          />
        </div>

        <button
          onClick={handleFilter}
          disabled={loading}
          className="bg-[#C9A24D] text-[#0B0F14] px-5 py-2 rounded-sm text-sm font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
        >
          {loading ? "Đang tải..." : "Áp dụng"}
        </button>
        <button
          onClick={clearFilter}
          disabled={loading}
          className="bg-[#1F2937] text-gray-300 border border-white/10 px-4 py-2 rounded-sm text-sm font-bold hover:bg-white hover:text-black transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-sm flex items-center gap-2">
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Spinner />
        </div>
      )}

      {!loading && !error && kpiData && (
        <>
          {/* --- HÀNG 1: Các thẻ KPI --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Doanh Thu (Đã TT)"
              value={formatCurrency(kpiData.totalRevenue)}
              icon={<DollarSign size={24} />}
              iconBgClass="bg-emerald-500/10"
              iconColorClass="text-emerald-500"
            />

            <Link to={buildOrderFilterUrl()} className="block">
              <StatCard
                title="Đơn Hàng (Đã TT)"
                value={kpiData.totalOrders.toLocaleString("vi-VN")}
                icon={<ShoppingCart size={24} />}
                iconBgClass="bg-blue-500/10"
                iconColorClass="text-blue-500"
              />
            </Link>

            <Link to="/admin/users" className="block">
              <StatCard
                title="Khách Hàng"
                value={kpiData.totalUsers.toLocaleString("vi-VN")}
                icon={<Users size={24} />}
                iconBgClass="bg-purple-500/10"
                iconColorClass="text-purple-500"
              />
            </Link>

            <StatCard
              title="Sản Phẩm"
              value={kpiData.totalProducts.toLocaleString("vi-VN")}
              icon={<Package size={24} />}
              iconBgClass="bg-[#C9A24D]/10"
              iconColorClass="text-[#C9A24D]"
            />
          </div>

          {/* --- HÀNG 2: Biểu đồ --- */}
          <div className="bg-[#12161C] p-6 rounded-sm border border-white/5 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-wide border-l-4 border-[#C9A24D] pl-3">
              <BarChart2 size={20} className="text-[#C9A24D]" /> Biểu đồ doanh
              thu
            </h2>
            <div style={{ height: "350px" }}>
              {chartData && chartData.length > 0 ? (
                <Bar options={barChartOptions} data={barChartData} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 italic">
                  Không có dữ liệu doanh thu trong khoảng thời gian này.
                </div>
              )}
            </div>
          </div>

          {/* Hàng 3: 2 Bảng (Đơn gần đây & Top SP) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Đơn hàng gần đây */}
            <div className="bg-[#12161C] p-6 rounded-sm border border-white/5 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide border-l-4 border-blue-500 pl-3">
                Đơn hàng mới
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="px-4 py-3 text-left font-medium uppercase text-xs">
                        Khách hàng
                      </th>
                      <th className="px-4 py-3 text-left font-medium uppercase text-xs">
                        Ngày đặt
                      </th>
                      <th className="px-4 py-3 text-left font-medium uppercase text-xs">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentOrders.length > 0 ? (
                      recentOrders.map((order) => (
                        <tr
                          key={order._id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-white">
                            {order.user?.fullName || "[Đã xóa]"}
                          </td>
                          <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                            {formatDateTime(order.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            {order.isPaid || order.isDelivered ? (
                              <span className="text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                {order.isDelivered
                                  ? "Hoàn thành"
                                  : "Đã Thanh Toán"}
                              </span>
                            ) : (
                              <span className="text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded text-xs font-bold uppercase">
                                Chờ Thanh Toán
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-8 text-gray-500 italic"
                        >
                          Không có đơn hàng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top sản phẩm bán chạy */}
            <div className="bg-[#12161C] p-6 rounded-sm border border-white/5 shadow-lg">
              <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-wide border-l-4 border-[#C9A24D] pl-3">
                Top Bán Chạy
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="px-4 py-3 text-left font-medium uppercase text-xs">
                        Sản phẩm
                      </th>
                      <th className="px-4 py-3 text-right font-medium uppercase text-xs">
                        Đã bán
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {topProducts.length > 0 ? (
                      topProducts.map((product, index) => (
                        <tr
                          key={product._id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                            {/* Badge Top 1,2,3 */}
                            {index === 0 && (
                              <span className="text-yellow-500 text-xs">
                                🥇
                              </span>
                            )}
                            {index === 1 && (
                              <span className="text-gray-400 text-xs">🥈</span>
                            )}
                            {index === 2 && (
                              <span className="text-orange-700 text-xs">
                                🥉
                              </span>
                            )}
                            <span className="truncate max-w-[200px]">
                              {product.name || "[SP đã xóa]"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#C9A24D] font-mono font-bold text-right">
                            {product.totalQuantitySold}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="2"
                          className="text-center py-8 text-gray-500 italic"
                        >
                          Không có dữ liệu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
