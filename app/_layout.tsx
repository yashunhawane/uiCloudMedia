import { router, Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { AppState } from "react-native";
import { clearAuthData, getTokenExpiry } from "../src/utils/storage";

function SessionManager() {
  const pathname = usePathname();

  useEffect(() => {
    let expiryTimer: ReturnType<typeof setTimeout> | null = null;

    const redirectToLogin = async () => {
      await clearAuthData();

      if (!pathname.startsWith("/(auth)")) {
        router.replace("/(auth)/login");
      }
    };

    const scheduleExpiryCheck = async () => {
      if (expiryTimer) {
        clearTimeout(expiryTimer);
        expiryTimer = null;
      }

      const expiresAt = await getTokenExpiry();
      if (!expiresAt) {
        return;
      }

      const remainingTime = expiresAt - Date.now();

      if (remainingTime <= 0) {
        await redirectToLogin();
        return;
      }

      expiryTimer = setTimeout(() => {
        void redirectToLogin();
      }, remainingTime);
    };

    void scheduleExpiryCheck();

    const appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void scheduleExpiryCheck();
      }
    });

    return () => {
      appStateSubscription.remove();

      if (expiryTimer) {
        clearTimeout(expiryTimer);
      }
    };
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  return (
    <>
      <SessionManager />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
