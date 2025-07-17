import axios from "axios";

const API_BASE = "http://localhost:8000/api";  // Change this for production

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    throw error;
  }
);

export default api;
