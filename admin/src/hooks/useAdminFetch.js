import { useCallback } from "react";
import { useAuth } from "@clerk/react";

export default function useAdminFetch() {
  const { getToken, isLoaded } = useAuth();

  return useCallback(
    async (input, init = {}) => {
      if (!isLoaded) {
        throw new Error("Authentication is still loading");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Sign in with the configured admin account");
      }

      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);

      return fetch(input, { ...init, headers });
    },
    [getToken, isLoaded],
  );
}
