import axios from "axios";
import { getNewTokens } from "../utils/getNewTokens";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//get new tokens if refreshToken is in cookie
api.interceptors.response.use(
  (response) => {
    // console.log(response);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      try {
        await getNewTokens(); //get new tokens

        return api(originalRequest);
      } catch (refreshError) {

        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
