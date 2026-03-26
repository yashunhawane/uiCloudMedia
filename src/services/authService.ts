import { loginApi, signupApi } from "../api/authApi";
import { saveToken } from "../utils/storage";

export const loginUser = async (data: any) => {
  const res = await loginApi(data);
  await saveToken(res.data.token);
  return res.data;
};

export const signupUser = async (data: any) => {
  const res = await signupApi(data);
  return res.data;
};