import axios from "axios";

export const ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL || "http://localhost:5005";
export const API_URL = "/api";

const axiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error.response?.status === 401 || error.response?.status === 403) && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname !== "/signin" && pathname !== "/signup" && pathname !== "/") {
        window.location.href = `/signin?callbackUrl=${encodeURIComponent(pathname)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

