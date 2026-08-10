import { useState } from "react";
import type { ReactNode } from "react";

import {
  AuthContext,
  type User,
  type AuthContextType,
} from "../context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem("user");

      return storedUser
        ? (JSON.parse(storedUser) as User)
        : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );

  const login = (user: User, token: string) => {
    console.log("========== LOGIN ==========");
    console.log("User:", user);
    console.log("Received Token:", token);

    setUser(user);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("accessToken", token);

    console.log(
      "Stored Access Token:",
      localStorage.getItem("accessToken")
    );
  };

  const logout = () => {
    console.log("========== LOGOUT ==========");

    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    console.log("Local Storage Cleared");
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;