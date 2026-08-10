import { createContext, useContext } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SECURITY" | "EMPLOYEE";
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext =
  createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};