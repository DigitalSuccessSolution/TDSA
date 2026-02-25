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
      if (savedUser) setUser(savedUser);
      fetchEnrollments(token);
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
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setEnrollments([]);
  };

  return (
    <AuthContext.Provider value={{ user, token, enrollments, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
