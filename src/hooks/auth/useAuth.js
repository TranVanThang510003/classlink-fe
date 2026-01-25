// hooks/useAuth.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserInf } from "../../services/authService";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      if (!token) return null;
      const data = await getUserInf(token);
      return data;
    },
    enabled: !!token,
    retry: false,
  });

  const isLoggedIn = !!user && !isError;

  const logout = () => {
    localStorage.removeItem("access_Token");
    queryClient.removeQueries(["currentUser"]);
  };

  return { user, isLoggedIn, isLoading, logout };
};
