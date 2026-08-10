export type UserRole =
  | "ADMIN"
  | "EMPLOYEE"
  | "SECURITY";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;

  createdAt?: string;
  updatedAt?: string;
}