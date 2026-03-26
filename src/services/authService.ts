import { loginApi, signupApi } from "../api/authApi";
import { saveToken } from "../utils/storage";

export const loginUser = async (data: any) => {
  const res = await loginApi(data);
  console.log("Login response:", res?.data);

  if (!res?.data?.data?.token) {
    throw new Error("Invalid server response");
  }

  await saveToken(res.data.data.token);
  return res.data;
};

export const signupUser = async (data: any) => {
  const res = await signupApi(data);
  return res?.data;
};