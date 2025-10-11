// src/hooks/useAuth.js
import { useState, useEffect } from "react";

// Custom hook to get auth info (token, role, userId)
export const useAuth = () => {
  const [auth, setAuth] = useState({
    token: null,
    role: null,
    userId: null,
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken) {
      setAuth({
        token: storedToken,
        role: storedRole,
        userId: storedUserId,
      });
    }
  }, []);

  return auth;
};
