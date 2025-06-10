import { useAuth, useClerk } from "@clerk/nextjs";
import { createAxiosInstance } from "../apiClient/axios";

const useAxios = () => {
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  const handleAuthError = () => {
    signOut();
    window.location.href = "/sign-in";
  };

  const getTokenWrapper = async () => {
    const token = await getToken();
    return token ?? null;
  };

  const axiosInstance = createAxiosInstance(getTokenWrapper, handleAuthError);

  return {
    axiosInstance
  };
};

export default useAxios;
