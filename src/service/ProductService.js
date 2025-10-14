import axios from "axios";
import { BASE_URL, getHeader } from "./apiConfig";

class ProductService {
    static async addProduct(formData) {
        const response = await axios.post(`${BASE_URL}/products/add`, formData, {
            headers: {
                ...getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async updateProduct(formData) {
        const response = await axios.put(`${BASE_URL}/products/update`, formData, {
            headers: {
                ...getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await axios.get(`${BASE_URL}/products/all`, {
            headers: getHeader()
        });
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${BASE_URL}/products/${productId}`, {
            headers: getHeader()
        });
        return response.data;
    }

    static async searchProduct(searchValue) {
        const response = await axios.get(`${BASE_URL}/products/search`, {
            params: { searchValue },
            headers: getHeader()
        });
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await axios.delete(`${BASE_URL}/products/delete/${productId}`, {
            headers: getHeader()
        });
        return response.data;
    }
}

export default ProductService;
