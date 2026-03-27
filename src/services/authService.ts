import { loginApi, signupApi } from "../api/authApi";
import { saveToken, saveUser } from "../utils/storage";

export const loginUser = async (data: any) => {
  const res = await loginApi(data);
  console.log("Login response:", res?.data);

  if (!res?.data?.data?.token) {
    throw new Error("Invalid server response");
  }

  await saveToken(res.data.data.token);
  const user =
    res?.data?.data?.user ??
    res?.data?.user ??
    res?.data?.data?.userData ??
    res?.data?.data?.profile;

  if (user) {
    await saveUser(user);
  }

  return res.data;
};

export const signupUser = async (data: any) => {
  const res = await signupApi(data);
  return res?.data;
};
