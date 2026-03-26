import client from "./client";

export const loginApi = (data: { email: string; password: string }) => {
  return client.post("/auth/login", data);
};

export const signupApi = (data: {
  email: string;
  password: string;
  userName: string;
}) => {
  return client.post("/auth/signup", data);
};