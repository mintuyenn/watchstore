import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // loading = true để chờ check session với server xong mới render UI
  const [loading, setLoading] = useState(true);

  // 1. CHECK SESSION KHI RELOAD TRANG
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Gọi endpoint profile. Vì cookie tự động gửi kèm,
        // nếu cookie hợp lệ backend sẽ trả về user info.
        const res = await fetch("/api/users/profile");

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null); // Cookie lỗi hoặc hết hạn
        }
      } catch (error) {
        console.error("Lỗi kiểm tra phiên đăng nhập:", error);
        setUser(null);
      } finally {
        setLoading(false); // Dù thành công hay thất bại cũng tắt loading
      }
    };

    checkUserLoggedIn();
  }, []);

  // 2. LOGIN (Chỉ cần cập nhật State, Cookie do Backend tự set)
  const login = (userData) => {
    setUser(userData);
  };

  // 3. LOGOUT (Gọi Backend xóa Cookie + Xóa State)
  const logout = async () => {
    try {
      await fetch("/api/users/logout", { method: "POST" });
      setUser(null);
      // Nếu muốn chuyển trang thì xử lý ở component gọi hàm này
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading: loading,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook custom để dùng cho gọn
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
