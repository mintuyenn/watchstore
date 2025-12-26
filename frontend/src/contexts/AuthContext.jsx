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
  // loading = true mặc định để chờ check session với server
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // 1. CHECK SESSION KHI RELOAD TRANG
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Gọi endpoint profile. Cookie sẽ tự động gửi kèm.
        const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
          credentials: "include",
        });
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
        setLoading(false); // Quan trọng: Tắt loading sau khi check xong
      }
    };

    checkUserLoggedIn();
  }, [BACKEND_URL]);

  // 2. LOGIN
  const login = (userData) => {
    setUser(userData);
  };

  // 3. LOGOUT (Đã sửa lỗi cú pháp fetch)
  const logout = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/users/logout`, {
        method: "POST", // Gộp method và credentials vào 1 object
        credentials: "include",
      });
      setUser(null);
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
      isLoading: loading, // Export biến này ra để các trang khác dùng
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Hook custom
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
