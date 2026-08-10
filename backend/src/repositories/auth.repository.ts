import prisma from "../config/prisma";
import { UserRole } from "@prisma/client";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role,
    },
  });
};