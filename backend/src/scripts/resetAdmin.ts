import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

async function resetAdmin() {
  try {
    console.log("=================================");
    console.log("RESETTING ADMIN ACCOUNT");
    console.log("=================================");

    const email = "admin@gmail.com";
    const password = "Admin@123";
    const name = "Pankaj Kumar";

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Find existing ADMIN account
    const existingAdmin = await prisma.user.findFirst({
      where: {
        role: "ADMIN",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (existingAdmin) {
      console.log("Existing admin found:");
      console.log("ID:", existingAdmin.id);

      const updatedAdmin = await prisma.user.update({
        where: {
          id: existingAdmin.id,
        },
        data: {
          name,
          email,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log("=================================");
      console.log("ADMIN RESET SUCCESSFULLY");
      console.log("=================================");
      console.log("ID:", updatedAdmin.id);
      console.log("Name:", updatedAdmin.name);
      console.log("Email:", updatedAdmin.email);
      console.log("Role:", updatedAdmin.role);
      console.log("Password: Admin@123");
      console.log("=================================");

      return;
    }

    // If no admin exists, create one
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("=================================");
    console.log("NEW ADMIN CREATED");
    console.log("=================================");
    console.log("ID:", newAdmin.id);
    console.log("Name:", newAdmin.name);
    console.log("Email:", newAdmin.email);
    console.log("Role:", newAdmin.role);
    console.log("Password: Admin@123");
    console.log("=================================");
  } catch (error) {
    console.error("=================================");
    console.error("RESET ADMIN ERROR");
    console.error("=================================");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();