import prisma from "./config/prisma";

async function test() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    });

    console.log("\n========== USERS ==========");
    console.dir(users, { depth: null });
    console.log("===========================\n");
  } catch (error) {
    console.error("Database error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();