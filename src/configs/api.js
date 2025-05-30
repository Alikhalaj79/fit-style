import axios from "axios";
import { getNewTokens } from "../utils/getNewTokens";

const API_URL = "https://clothing-store.liara.run";

// Add logout state flag
let isLoggedOut = false;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//get new tokens if refreshToken is in cookie
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Don't attempt token refresh if logged out
    if (isLoggedOut) {
      return Promise.reject(error);
    }

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
        isLoggedOut = true; // Set logout state on refresh failure
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Add logout function to api object
api.logout = async () => {
  try {
    isLoggedOut = true; // Set logout flag
    await api.post("auth/logout");
  } catch (error) {
    throw error;
  } finally {
    // Reset logout flag after a delay to prevent immediate re-login
    setTimeout(() => {
      isLoggedOut = false;
    }, 5000); // 5 second delay
  }
};

// Add login function to reset logout state
api.login = () => {
  isLoggedOut = false;
};

export default api;
