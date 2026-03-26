import client from "./client";

const handleApiError = (err: any) => {
  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    (err.request
      ? "Network error. Please check your internet connection."
      : "Something went wrong. Please try again.");

  throw new Error(message);
};

export const loginApi = async (data: { email: string; password: string }) => {
  try {
    return await client.post("/auth/login", data);
  } catch (err) {
    console.error("Login API error:", err);
    handleApiError(err);
  }
};

export const signupApi = async (data: {
  email: string;
  password: string;
  userName: string;
}) => {
  try {
    return await client.post("/auth/signup", data);
  } catch (err) {
    console.error("Login API error:", err);
    handleApiError(err);
  }
};