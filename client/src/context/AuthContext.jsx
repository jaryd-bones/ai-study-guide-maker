import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest } from "../services/authApi.js";
import { setAuthToken } from "../services/apiClient.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem("sgmToken"));
  const [isLoading, setIsLoading] = useState(false);

  // Store user and token in state and localStorage
  const applyAuth = ({ user: userData, token: rawToken }) => {
    if (!rawToken) {
      console.warn("applyAuth called without a token:", { userData, rawToken });
    }

    setUser(userData || null);
    setTokenState(rawToken || null);
    setAuthToken(rawToken || null);

    if (userData) {
      localStorage.setItem("sgmUser", JSON.stringify(userData));
    } else {
      localStorage.removeItem("sgmUser");
    }

    if (rawToken) {
      localStorage.setItem("sgmToken", rawToken);
    } else {
      localStorage.removeItem("sgmToken");
    }
  };

  // Restore auth state on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("sgmUser");
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthToken(token);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("sgmUser");
        localStorage.removeItem("sgmToken");
      }
    }
  }, [token]);

  // Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const data = await loginRequest(email, password);
      const resolvedToken = data.accessToken;

      // Temporary minimal user
      const resolvedUser = {
        email,
      };

      applyAuth({ user: resolvedUser, token: resolvedToken });
    } finally {
      setIsLoading(false);
    }
  };


  const register = async ({ email, password, firstName, lastName }) => {
    setIsLoading(true);
    try {
      const createdUser = await registerRequest({
        email,
        password,
        firstName,
        lastName,
      });

      // Auto login
      const loginData = await loginRequest(email, password);
      const resolvedToken = loginData.accessToken;

      const resolvedUser = {
        id: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
      };

      applyAuth({ user: resolvedUser, token: resolvedToken });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setAuthToken(null);
    localStorage.removeItem("sgmUser");
    localStorage.removeItem("sgmToken");
  };

  const value = { user, token, isLoading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return ctx;
};
