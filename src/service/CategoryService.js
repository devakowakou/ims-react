import axios from "axios";
import { BASE_URL, getHeader } from "./apiConfig";

class CategoryService {
    static async createCategory(category) {
        const response = await axios.post(`${BASE_URL}/categories/add`, category, {
            headers: getHeader()
        })
        return response.data;
    }

    static async getAllCategory() {
        const response = await axios.get(`${BASE_URL}/categories/all`, {
            headers: getHeader()
        })
        return response.data;
    }

    static async getCategoryById(categoryId) {
        const response = await axios.get(`${BASE_URL}/categories/${categoryId}`, {
            headers: getHeader()
        })
        return response.data;
    }

    static async updateCategory(categoryId, categoryData) {
        const response = await axios.put(`${BASE_URL}/categories/update/${categoryId}`, categoryData, {
            headers: getHeader()
        })
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${BASE_URL}/categories/delete/${categoryId}`, {
            headers: getHeader()
        })
        return response.data;
    }
}

export default CategoryService;
