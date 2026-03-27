import client from "./client";

const handleApiError = (err: any) => {
  const isTimeout = err.code === "ECONNABORTED";
  const isNetworkIssue =
    err.message === "Network Error" || !err.response;
  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    (isTimeout
      ? "Server is not responding. Please try again in a moment."
      : isNetworkIssue
        ? "Unable to reach the server. Please make sure the backend is running."
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
