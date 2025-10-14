import axios from "axios";
import { BASE_URL, getHeader } from "./apiConfig";

class SupplierService {
    static async addSupplier(supplierData) {
        const response = await axios.post(`${BASE_URL}/suppliers/add`, supplierData, {
            headers: getHeader()
        })
        return response.data;
    }

    static async getAllSuppliers() {
        const response = await axios.get(`${BASE_URL}/suppliers/all`, {
            headers: getHeader()
        })
        return response.data;
    }

    static async getSupplierById(supplierId) {
        const response = await axios.get(`${BASE_URL}/suppliers/${supplierId}`, {
            headers: getHeader()
        })
        return response.data;
    }

    static async updateSupplier(supplierId, supplierData) {
        const response = await axios.put(`${BASE_URL}/suppliers/update/${supplierId}`, supplierData, {
            headers: getHeader()
        })
        return response.data;
    }

    static async deleteSupplier(supplierId) {
        const response = await axios.delete(`${BASE_URL}/suppliers/delete/${supplierId}`, {
            headers: getHeader()
        })
        return response.data;
    }
}

export default SupplierService;
