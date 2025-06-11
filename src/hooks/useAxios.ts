import { useAuth, useClerk } from "@clerk/nextjs";
import { createAxiosInstance } from "../apiClient/axios";
import { useCallback, useMemo, useRef } from "react";

// Singleton axios instance for memory efficiency
let globalAxiosInstance: any = null;

const useAxios = () => {
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  // Use refs to maintain stable references and prevent re-renders
  const getTokenRef = useRef(getToken);
  const signOutRef = useRef(signOut);

  // Update refs on each render without causing re-renders
  getTokenRef.current = getToken;
  signOutRef.current = signOut;

  // Stable auth error handler that doesn't change between renders
  const handleAuthError = useCallback(() => {
    signOutRef.current();
    window.location.href = "/sign-in";
  }, []); // No dependencies - stable reference

  // Simple token getter without caching
  const getTokenWrapper = useCallback(async (): Promise<string | null> => {
    try {
      const token = await getTokenRef.current();
      return token || null;
    } catch (error) {
      console.error("Failed to get token:", error);
      return null;
    }
  }, []); // No dependencies - stable reference

  // Create or reuse singleton axios instance for memory efficiency
  const axiosInstance = useMemo(() => {
    if (!globalAxiosInstance) {
      globalAxiosInstance = createAxiosInstance(
        getTokenWrapper,
        handleAuthError
      );
    }
    return globalAxiosInstance;
  }, []); // Empty dependencies - only create once

  return {
    axiosInstance
  };
};

export default useAxios;
