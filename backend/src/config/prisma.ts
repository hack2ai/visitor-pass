import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function checkConnection() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT current_database(), current_schema();
  `);

  console.log("DATABASE:", result);
}

checkConnection();

export default prisma;