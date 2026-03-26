import { useRouter } from "expo-router";
import { useEffect } from "react";
import { getToken } from "../src/utils/storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (token) {
        router.replace("/home");
      } else {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  return null;
}