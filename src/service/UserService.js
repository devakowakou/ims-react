import axios from "axios";
import { BASE_URL, getHeader } from "./apiConfig";

class UserService {
    static async getAllUsers() {
        const response = await axios.get(`${BASE_URL}/users/all`, {
            headers: getHeader()
        });
        return response.data;
    }

    static async getLoggedInUsesInfo() {
        const response = await axios.get(`${BASE_URL}/users/current`, {
            headers: getHeader()
        });
        return response.data;
    }

    static async getUserById(userId) {
        const response = await axios.get(`${BASE_URL}/users/${userId}`, {
            headers: getHeader()
        });
        return response.data;
    }

    static async updateUser(userId, userData) {
        const response = await axios.put(`${BASE_URL}/users/update/${userId}`, userData, {
            headers: getHeader()
        });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${BASE_URL}/users/delete/${userId}`, {
            headers: getHeader()
        });
        return response.data;
    }
}

export default UserService;
