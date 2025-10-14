import axios from "axios";
import { BASE_URL, getHeader } from "./apiConfig";

class TransactionService {
    static async purchaseProduct(body) {
        const response = await axios.post(`${BASE_URL}/transactions/purchase`, body, {
            headers: getHeader()
        })
        return response.data;
    }

    static async sellProduct(body) {
        const response = await axios.post(`${BASE_URL}/transactions/sell`, body, {
            headers: getHeader()
        })
        return response.data;
    }

    static async returnToSupplier(body) {
        const response = await axios.post(`${BASE_URL}/transactions/return`, body, {
            headers: getHeader()
        })
        return response.data;
    }

    static async getAllTransactions(filter) {
        const response = await axios.get(`${BASE_URL}/transactions/all`, {
            headers: getHeader(),
            params: {filter}
        })
        return response.data;
    }

    static async geTransactionsByMonthAndYear(month, year) {
        const response = await axios.get(`${BASE_URL}/transactions/by-month-year`, {
            headers: getHeader(),
            params: {
                month:month,
                year:year

            }
        })
        return response.data;
    }

    static async getTransactionById(transactionId) {
        const response = await axios.get(`${BASE_URL}/transactions/${transactionId}`, {
            headers: getHeader()
        })
        return response.data;
    }

    static async updateTransactionStatus(transactionId, status) {
        const response = await axios.put(`${BASE_URL}/transactions/${transactionId}`, status, {
            headers: getHeader()
        })
        return response.data;
    }
}

export default TransactionService;
