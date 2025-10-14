import axios from "axios";

export const BASE_URL = "http://localhost:5050/api";

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
