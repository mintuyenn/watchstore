import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchProducts = async (params = {}) => {
  try {
    // params có thể là { keyword: 'rolex', brand: 'Seiko' }
    const { data } = await axios.get(`${API_URL}/api/products`, {
      params: params, // Gửi các tham số này lên backend
    });
    return data; // API trả về { products: [...] }
  } catch (error) {
    console.error(
      "Lỗi khi tải sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/products/${id}`);
    return data;
  } catch (error) {
    console.error(
      "Lỗi khi tải chi tiết sản phẩm:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
};
