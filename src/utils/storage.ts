import * as SecureStore from "expo-secure-store";

const memoryStorage = new Map<string, string>();

const isMissingNativeStorageError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("Native module is null") ||
    error.message.includes("NativeModule") ||
    error.message.includes("not available")
  );
};

const getItem = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) {
      memoryStorage.set(key, value);
    }
    return value;
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      console.warn("SecureStore native module unavailable, using memory fallback.");
      return memoryStorage.get(key) ?? null;
    }

    throw error;
  }
};

const setItem = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
    memoryStorage.set(key, value);
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      console.warn("SecureStore native module unavailable, using memory fallback.");
      memoryStorage.set(key, value);
      return;
    }

    throw error;
  }
};

const removeItem = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    if (!isMissingNativeStorageError(error)) {
      throw error;
    }

    console.warn("SecureStore native module unavailable, using memory fallback.");
  } finally {
    memoryStorage.delete(key);
  }
};

export const saveToken = async (token: string) => {
  await setItem("token", token);
};

export const getToken = async () => {
  return getItem("token");
};

export const removeToken = async () => {
  return removeItem("token");
};

export const saveUser = async (user: unknown) => {
  await setItem("user", JSON.stringify(user));
};

export const getUser = async () => {
  const user = await getItem("user");
  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.warn("Failed to parse stored user data.", error);
    return null;
  }
};

export const removeUser = async () => {
  return removeItem("user");
};
