import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot backend
});

// attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers["Authorization"] = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
