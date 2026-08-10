import type { User } from "./user";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "EMPLOYEE" | "SECURITY";
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}