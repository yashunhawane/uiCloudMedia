import AsyncStorage from "@react-native-async-storage/async-storage";

const memoryStorage = new Map<string, string>();

const isMissingNativeStorageError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("Native module is null");
};

const getItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      console.warn("AsyncStorage native module unavailable, using memory fallback.");
      return memoryStorage.get(key) ?? null;
    }

    throw error;
  }
};

const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    memoryStorage.set(key, value);
  } catch (error) {
    if (isMissingNativeStorageError(error)) {
      console.warn("AsyncStorage native module unavailable, using memory fallback.");
      memoryStorage.set(key, value);
      return;
    }

    throw error;
  }
};

const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    if (!isMissingNativeStorageError(error)) {
      throw error;
    }

    console.warn("AsyncStorage native module unavailable, using memory fallback.");
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
