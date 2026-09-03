import axios from "axios";

// توحيد الـ baseURL على localhost ليتطابق تماماً مع متصفحك (localhost:5173)
const api = axios.create({
  baseURL: "https://radiant-illumination-production-c49b.up.railway.app",
  timeout: 15000,
});

// إرفاق الـ Token تلقائياً في كل الطلبات إن وُجد
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// معالجة الأخطاء والـ 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;