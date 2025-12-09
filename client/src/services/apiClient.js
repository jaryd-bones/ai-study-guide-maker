import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
});

// Add and removes auth token
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("sgm_token", token);
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
    localStorage.removeItem("sgm_token");
  }
}

// Initialize token from local storage
const existingToken = localStorage.getItem("sgm_token");
if (existingToken) {
  setAuthToken(existingToken);
}

// Redirect to login if missing or invalid token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      localStorage.removeItem("sgm_token");  // Clear token
      delete apiClient.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
