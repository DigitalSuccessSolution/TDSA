import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [enrollments, setEnrollments] = useState([]);

  const fetchEnrollments = async (tokenToUse) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/enrollments`,
        {
          headers: { Authorization: `Bearer ${tokenToUse}` },
        },
      );
      setEnrollments(res.data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
    }
  };

  useEffect(() => {
    if (token) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (savedUser) {
        setUser(savedUser);
        // Only fetch enrollments if it's NOT an admin
        if (savedUser.id !== 'admin_user_id' && savedUser.role !== 'admin') {
          fetchEnrollments(token);
        }
      }
    }
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
    fetchEnrollments(authToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken"); // NEW: Clear refresh token
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setEnrollments([]);
  };

  // --- SILENT REFRESH LOGIC ---
  useEffect(() => {
    // Axios Interceptor to handle 401 errors globally
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Agar 401 error aata hai aur wo login/refresh request nahi hai
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const storedRefreshToken = localStorage.getItem("refreshToken");

          if (storedRefreshToken) {
            try {
              // Refresh Token call
              const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
                refreshToken: storedRefreshToken
              });

              const { accessToken, refreshToken: newRefreshToken } = res.data;

              // Update Storage & State
              localStorage.setItem("token", accessToken);
              localStorage.setItem("refreshToken", newRefreshToken);
              setToken(accessToken);

              // Retry original request with new token
              originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
              return axios(originalRequest);
            } catch (refreshError) {
              console.error("Refresh token expired or invalid");
              logout(); // Sab khatam, login again
            }
          } else {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, enrollments, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
