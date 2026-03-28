import axios from "axios";
import { router } from "expo-router";
import { clearAuthData } from "../utils/storage";

const DEFAULT_API_URL = "http://3.110.216.101:3000/api/";
const apiUrl = process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;

const client = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = String(error?.config?.url ?? "");
    const isAuthRequest = requestUrl.includes("/auth/");

    if (error?.response?.status === 401 && !isAuthRequest) {
      await clearAuthData();
      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  }
);

export default client;
