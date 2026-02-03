//@ts-nocheck
import { createContext, useContext, useEffect, useState } from "react";
import { PageLoading } from "@/components/shared/PageLoading";
import { useCurrentUser } from "@/queries/hooks/auth/useAuth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const {
    data: fetchedUser,
    isLoading: queryLoading,
    isFetching,
    isError,
    error,
  } = useCurrentUser();

  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set user only on first fetch (initial load)
  useEffect(() => {
    if (!queryLoading) {
      setUser(fetchedUser ?? null);
      setIsLoading(false);
    }
  }, [queryLoading, fetchedUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,         // ✅ allow manual updates
        clearUser: () => setUser(null), // ✅ allow logout
        isLoading,
        isFetching,
        isError,
        error,
      }}
    >
      {isLoading ? <PageLoading /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
