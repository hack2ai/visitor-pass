import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  console.log("========== AXIOS REQUEST ==========");
  console.log("URL:", config.url);
  console.log("Token exists:", !!token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "Authorization:",
    config.headers.Authorization
      ? "Bearer ********"
      : "MISSING"
  );

  return config;
});

export default api;