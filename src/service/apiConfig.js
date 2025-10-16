import axios from "axios";

// Configuration basée sur l'environnement
const BASE_URL = import.meta.env.PROD
  ? "https://ims-java.onrender.com//api"
  : import.meta.env.VITE_API_URL || "http://localhost:5050/api";

export { BASE_URL };

// Get token
export const getToken = () => {
    return localStorage.getItem("token");
}

// Get role
export const getRole = () => {
    return localStorage.getItem("role");
}

// Header with conditional Authorization
export const getHeader = () => {
    const token = getToken();
    if (!token) return { "Content-Type": "application/json" };
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}
