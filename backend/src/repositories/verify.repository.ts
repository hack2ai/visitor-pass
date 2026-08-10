import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

const verificationInclude =
  Prisma.validator<Prisma.VisitorInclude>()({
    host: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
  });

const getDb = (
  tx?: Prisma.TransactionClient
) => tx ?? prisma;

// ======================================================
// FIND VISITOR BY ID
// ======================================================

export const findVisitorForVerification = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findUnique({
    where: {
      id: visitorId,
    },
    include: verificationInclude,
  });
};

// ======================================================
// CHECK IF VISITOR EXISTS
// ======================================================

export const visitorExists = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const db = getDb(tx);

  const visitor = await db.visitor.findUnique({
    where: {
      id: visitorId,
    },
    select: {
      id: true,
    },
  });

  return !!visitor;
};

// ======================================================
// FIND VISITOR BY QR TOKEN
// ======================================================

export const findVisitorByVerificationToken = async (
  verificationToken: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findFirst({
    where: {
      qrCode: verificationToken,
    },
    include: verificationInclude,
  });
};

// ======================================================
// VERIFY VISITOR CHECK-IN
// ======================================================

export const verifyCheckIn = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.update({
    where: {
      id: visitorId,
    },
    data: {
      status: "CHECKED_IN",
      checkIn: new Date(),
    },
    include: verificationInclude,
  });
};

// ======================================================
// VERIFY VISITOR CHECK-OUT
// ======================================================

export const verifyCheckOut = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.update({
    where: {
      id: visitorId,
    },
    data: {
      status: "CHECKED_OUT",
      checkOut: new Date(),
    },
    include: verificationInclude,
  });
};

export default {
  findVisitorForVerification,
  visitorExists,
  findVisitorByVerificationToken,
  verifyCheckIn,
  verifyCheckOut,
};