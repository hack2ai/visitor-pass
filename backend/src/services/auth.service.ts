import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

import * as repo from "../repositories/auth.repository";
import { hashPassword, comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt";

/**
 * Register User
 */
export const register = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  const exists = await repo.findUserByEmail(email);

  if (exists) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await repo.createUser(
    name,
    email,
    hashedPassword,
    role
  );

  const { password: _, ...safeUser } = user;

  return safeUser;
};

/**
 * Login User
 */
export const login = async (
  email: string,
  password: string
) => {
  console.log("\n========== LOGIN ==========");
  console.log("Email:", email);

  const user = await repo.findUserByEmail(email);

  console.log("User Found:", user);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await comparePassword(
    password,
    user.password
  );

  console.log("Password Match:", valid);

  if (!valid) {
    throw new Error("Invalid credentials");
  }

  // Generate Tokens
  const accessToken = generateAccessToken({
    id: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user.id,
    role: user.role,
  });

  console.log("\n========== GENERATED ACCESS TOKEN ==========");
  console.log(accessToken);

  console.log("\n========== DECODED ACCESS TOKEN ==========");
  console.log(jwt.decode(accessToken));

  console.log("\n========== GENERATED REFRESH TOKEN ==========");
  console.log(refreshToken);

  console.log("\n========== DECODED REFRESH TOKEN ==========");
  console.log(jwt.decode(refreshToken));

  const { password: _, ...safeUser } = user;

  console.log("\n========== LOGIN SUCCESS ==========");
  console.log("User ID :", safeUser.id);
  console.log("Role    :", safeUser.role);

  return {
    user: safeUser,
    accessToken,
    refreshToken,
  };
};