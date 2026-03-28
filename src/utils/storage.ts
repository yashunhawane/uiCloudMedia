import * as SecureStore from "expo-secure-store";

const memoryStorage = new Map<string, string>();
const TOKEN_KEY = "token";
const USER_KEY = "user";
const AUTH_EXPIRES_AT_KEY = "authExpiresAt";

export const SESSION_DURATION_MS = 60 * 60 * 1000;

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
  await setItem(TOKEN_KEY, token);
  await setItem(AUTH_EXPIRES_AT_KEY, String(Date.now() + SESSION_DURATION_MS));
};

export const getToken = async () => {
  const expiresAt = await getTokenExpiry();

  if (expiresAt && Date.now() >= expiresAt) {
    await clearAuthData();
    return null;
  }

  return getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await removeItem(TOKEN_KEY);
  await removeItem(AUTH_EXPIRES_AT_KEY);
};

export const saveUser = async (user: unknown) => {
  await setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const user = await getItem(USER_KEY);
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
  return removeItem(USER_KEY);
};

export const getTokenExpiry = async () => {
  const expiresAt = await getItem(AUTH_EXPIRES_AT_KEY);

  if (!expiresAt) {
    return null;
  }

  const parsedExpiry = Number(expiresAt);
  return Number.isNaN(parsedExpiry) ? null : parsedExpiry;
};

export const clearAuthData = async () => {
  await Promise.all([
    removeItem(TOKEN_KEY),
    removeItem(USER_KEY),
    removeItem(AUTH_EXPIRES_AT_KEY),
  ]);
};
