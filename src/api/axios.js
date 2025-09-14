// 📂 src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base url
  headers: { "Content-Type": "application/json" },
});

// 🔹 Auto attach token from localStorage
api.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("token");
  const sagToken = localStorage.getItem("sag_token");
  const financeToken = localStorage.getItem("finance_token");

  // priority: finance > sag > user
  const token = financeToken || sagToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
