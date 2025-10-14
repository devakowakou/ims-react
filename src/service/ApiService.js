import { getToken } from "./apiConfig";

const ApiService = {
  isAuthenticated: () => {
    const token = getToken();
    return !!token;
  },
};

export default ApiService;
