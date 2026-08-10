import prisma from "./src/config/prisma";

async function main() {
  const users = await prisma.user.findMany();

  console.log(users);

  const id = users[0].id;

  console.log("ID:", id);

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  console.log("findUnique:", user);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });