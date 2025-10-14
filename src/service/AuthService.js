import axios from "axios";
import { BASE_URL } from "./apiConfig";


class AuthService {
    static async registerUser(registerData) {
        const response = await axios.post(`${BASE_URL}/auth/register`, registerData)
        return response.data;
    }

    static async loginUser(loginData) {
        const response = await axios.post(`${BASE_URL}/auth/login`, loginData)
        return response.data;
    }

    static logout(){
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static isAuthenticated(){
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin(){
        const role = localStorage.getItem("role");
        return role === "ADMIN";
    }

    // Save token (plain)
    static saveToken(token) {
        localStorage.setItem("token", token);
    }

    // Save role (plain)
    static saveRole(role) {
        localStorage.setItem("role", role);
    }

}

export default AuthService;
