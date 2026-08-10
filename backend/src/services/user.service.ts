import prisma from "../config/prisma";

/**
 * ==========================================================
 * GET ALL EMPLOYEES / HOSTS
 * ==========================================================
 */
export const getUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return users;
};