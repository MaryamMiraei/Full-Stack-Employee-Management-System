"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";
import { getSession } from "@/features/auth/api/session";
import { logoutUser } from "@/features/auth/api/logout";

interface IAuthContext {
  user: IUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: (signal?: AbortSignal) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

interface IAuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await getSession(signal);

      setUser(response.user);
    } catch (error) {
      if (axios.isCancel(error)) return;

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setUser(null);
      } else {
        console.error("Session error:", error);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    refreshSession(controller.signal);

    return () => {
      controller.abort();
    };
  }, [refreshSession]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
