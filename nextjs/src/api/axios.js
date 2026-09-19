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

export default axiosInstance;

