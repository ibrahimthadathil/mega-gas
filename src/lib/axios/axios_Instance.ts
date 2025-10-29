import axios from "axios";

const apiInstance = axios.create({
  baseURL: "/api",
  withCredentials: true, // to send refresh-token cookie if backend sets it
});

apiInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
