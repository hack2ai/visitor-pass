import fs from "fs";
import path from "path";

import {
  VisitorStatus,
} from "@prisma/client";

import prisma from "../config/prisma";
import * as visitorRepository from "../repositories/visitor.repository";

import {
  generateVisitorQRCode,
} from "../utils/qr.util";

import {
  generateVisitorPass,
} from "../utils/pdf.util";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface CreateVisitorInput {
  fullName: string;
  email?: string;
  phone: string;
  company?: string;
  purpose: string;
  hostId: string;
  faceImage?: string;
}

interface VisitorQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: VisitorStatus;
  hostId?: string;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const LOG_LINE =
  "======================================================";

const IS_DEV =
  process.env.NODE_ENV === "development";

// ─────────────────────────────────────────────────────────────
// FILE HELPERS
// ─────────────────────────────────────────────────────────────

const ensureFileExists = (
  relativePath: string,
  fileName: string
) => {
  const absolutePath = path.join(
    process.cwd(),
    relativePath.replace(/^\/+/, "")
  );

  if (!fs.existsSync(absolutePath)) {
    throw new Error(
      `${fileName} was not generated successfully.`
    );
  }

  return {
    absolutePath,
    size: fs.statSync(absolutePath).size,
  };
};

const deleteFileIfExists = async (
  relativePath: string,
  label: string
): Promise<void> => {
  const absolutePath = path.join(
    process.cwd(),
    relativePath.replace(/^\/+/, "")
  );

  try {
    await fs.promises.access(absolutePath);
    await fs.promises.unlink(absolutePath);

    if (IS_DEV) {
      console.log(`✅ ${label} deleted.`);
    }
  } catch {
    // File doesn't exist — nothing to do.
  }
};

// ─────────────────────────────────────────────────────────────
// LOG HELPERS
// ─────────────────────────────────────────────────────────────

const printLog = (title: string) => {
  if (IS_DEV) {
    console.log(`\n${LOG_LINE}`);
    console.log(title);
    console.log(LOG_LINE);
  }
};

const printSuccess = (message: string) => {
  if (IS_DEV) {
    console.log(`✅ ${message}`);
  }
};

const printError = (message: string) => {
  console.error(`❌ ${message}`);
};

// ─────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────

const validateVisitorData = (data: {
  fullName: string;
  phone: string;
  purpose: string;
  hostId: string;
}) => {
  if (!data.fullName.trim()) {
    throw new Error("Visitor name is required.");
  }

  if (data.fullName.trim().length < 3) {
    throw new Error(
      "Visitor name must be at least 3 characters."
    );
  }

  if (!data.phone.trim()) {
    throw new Error("Visitor phone number is required.");
  }

  if (!/^[0-9]{10}$/.test(data.phone.trim())) {
    throw new Error(
      "Invalid phone number. Must be exactly 10 digits."
    );
  }

  if (!data.purpose.trim()) {
    throw new Error("Purpose is required.");
  }

  if (!data.hostId.trim()) {
    throw new Error("Host ID is required.");
  }
};

// ─────────────────────────────────────────────────────────────
// CREATE VISITOR
// ─────────────────────────────────────────────────────────────

export const createVisitor = async (
  data: CreateVisitorInput
) => {
  let generatedQrPath: string | undefined;
  let generatedPdfPath: string | undefined;

  try {
    printLog("CREATE VISITOR SERVICE");

    validateVisitorData({
      fullName: data.fullName,
      phone: data.phone,
      purpose: data.purpose,
      hostId: data.hostId,
    });

    printSuccess("Input validation completed.");

    const updatedVisitor = await prisma.$transaction(
      async (tx) => {
        // hostId → host.connect.id (required by Prisma.VisitorCreateInput)
        const visitor = await visitorRepository.createVisitor(
          {
            fullName: data.fullName,
            email: data.email ?? null,
            phone: data.phone,
            company: data.company ?? null,
            purpose: data.purpose,
            faceImage: data.faceImage ?? null,

            host: {
              connect: {
                id: data.hostId,
              },
            },
          },
          tx
        );

        printSuccess("Visitor record created.");

        console.table({
          VisitorID: visitor.id,
          Name: visitor.fullName,
          Host: visitor.host.name,      // host.name — not host.fullName
          Status: visitor.status,
        });

        // ── QR CODE ──────────────────────────────────────────

        generatedQrPath = await generateVisitorQRCode({
          visitorId: visitor.id,
          fullName: visitor.fullName,
          purpose: visitor.purpose,
          status: visitor.status,
          host: visitor.host.name,      // host.name — not host.fullName
        });

        printSuccess("QR Code generated.");

        ensureFileExists(generatedQrPath, "QR Code");

        // ── VISITOR PASS PDF ──────────────────────────────────

        generatedPdfPath = await generateVisitorPass({
          id: visitor.id,
          fullName: visitor.fullName,
          email: visitor.email ?? "",
          phone: visitor.phone,
          company: visitor.company ?? "",
          purpose: visitor.purpose,
          host: visitor.host.name,      // host.name — not host.fullName
          status: visitor.status,
          qrCode: generatedQrPath,
          faceImage: visitor.faceImage ?? "",
        });

        printSuccess("Visitor Pass generated.");

        ensureFileExists(generatedPdfPath, "Visitor Pass PDF");

        // ── SAVE FILE PATHS ───────────────────────────────────

        const result = await visitorRepository.updateVisitor(
          visitor.id,
          {
            qrCode: generatedQrPath,
            pdfPath: generatedPdfPath,
          },
          tx
        );

        printSuccess("Visitor updated with file paths.");

        return result;
      },
      {
        timeout: 30_000,
      }
    );

    printLog("VISITOR CREATED SUCCESSFULLY");

    return updatedVisitor;
  } catch (error) {
    printLog("CREATE VISITOR ERROR");

    printError(
      error instanceof Error ? error.message : "Unknown Error"
    );

    console.error(error);

    if (generatedQrPath) {
      await deleteFileIfExists(generatedQrPath, "QR Code");
    }

    if (generatedPdfPath) {
      await deleteFileIfExists(generatedPdfPath, "Visitor Pass PDF");
    }

    throw error;
  }
};

// ─────────────────────────────────────────────────────────────
// GET ALL VISITORS
// ─────────────────────────────────────────────────────────────

export const getAllVisitors = async (
  options: VisitorQueryOptions = {}
) => {
  try {
    printLog("GET ALL VISITORS");

    const result = await visitorRepository.getAllVisitors(options);

    printSuccess(`${result.data.length} visitor(s) found.`);

    return result;
  } catch (error) {
    printLog("GET ALL VISITORS ERROR");

    printError(
      error instanceof Error ? error.message : "Unknown Error"
    );

    throw error;
  }
};

// ─────────────────────────────────────────────────────────────
// GET VISITOR BY ID
// ─────────────────────────────────────────────────────────────

export const getVisitorById = async (id: string) => {
  if (!id?.trim()) {
    throw new Error("Visitor ID is required.");
  }

  const visitor = await visitorRepository.getVisitorById(id);

  if (!visitor) {
    throw new Error("Visitor not found.");
  }

  return visitor;
};

// ─────────────────────────────────────────────────────────────
// UPDATE VISITOR
// ─────────────────────────────────────────────────────────────

export const updateVisitor = async (
  id: string,
  data: Partial<{
    fullName: string;
    email: string;
    phone: string;
    company: string;
    purpose: string;
    faceImage: string;
    qrCode: string;
    pdfPath: string;
    status: VisitorStatus;
    checkIn: Date;
    checkOut: Date;
  }>
) => {
  if (!id?.trim()) {
    throw new Error("Visitor ID is required.");
  }

  await getVisitorById(id);

  return visitorRepository.updateVisitor(id, data);
};

// ─────────────────────────────────────────────────────────────
// UPDATE VISITOR STATUS
// ─────────────────────────────────────────────────────────────

export const updateVisitorStatus = async (
  id: string,
  status: VisitorStatus
) => {
  if (!id?.trim()) {
    throw new Error("Visitor ID is required.");
  }

  const visitor = await getVisitorById(id);

  if (visitor.status === status) {
    throw new Error(
      `Visitor is already marked as ${status}.`
    );
  }

  const updateData: {
    status: VisitorStatus;
    checkIn?: Date;
    checkOut?: Date;
  } = { status };

  if (status === VisitorStatus.CHECKED_IN) {
    updateData.checkIn = new Date();
  }

  if (status === VisitorStatus.CHECKED_OUT) {
    updateData.checkOut = new Date();
  }

  return visitorRepository.updateVisitorStatus(id, updateData);
};

// ─────────────────────────────────────────────────────────────
// DELETE VISITOR
// ─────────────────────────────────────────────────────────────

export const deleteVisitor = async (id: string) => {
  if (!id?.trim()) {
    throw new Error("Visitor ID is required.");
  }

  const visitor = await getVisitorById(id);

  await Promise.all([
    visitor.qrCode
      ? deleteFileIfExists(visitor.qrCode, "QR Code")
      : Promise.resolve(),

    visitor.pdfPath
      ? deleteFileIfExists(visitor.pdfPath, "Visitor Pass")
      : Promise.resolve(),

    visitor.faceImage
      ? deleteFileIfExists(visitor.faceImage, "Visitor Image")
      : Promise.resolve(),
  ]);

  await visitorRepository.deleteVisitor(id);

  return {
    success: true,
    message: "Visitor deleted successfully.",
  };
};

// ─────────────────────────────────────────────────────────────
// GET VISITOR PASS PATH
// ─────────────────────────────────────────────────────────────

export const getVisitorPassPath = async (id: string) => {
  const visitor = await getVisitorById(id);

  if (!visitor.pdfPath) {
    throw new Error("Visitor pass not found.");
  }

  ensureFileExists(visitor.pdfPath, "Visitor Pass");

  return visitor.pdfPath;
};

// ─────────────────────────────────────────────────────────────
// GET VISITOR QR CODE PATH
// ─────────────────────────────────────────────────────────────

export const getVisitorQRCodePath = async (id: string) => {
  const visitor = await getVisitorById(id);

  if (!visitor.qrCode) {
    throw new Error("QR Code not found.");
  }

  ensureFileExists(visitor.qrCode, "QR Code");

  return visitor.qrCode;
};

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

export const getVisitorStats = async () => {
  const [
    total,
    pending,
    approved,
    rejected,
    checkedIn,
    checkedOut,
  ] = await Promise.all([
    prisma.visitor.count(),

    prisma.visitor.count({
      where: {
        status: VisitorStatus.PENDING,
      },
    }),

    prisma.visitor.count({
      where: {
        status: VisitorStatus.APPROVED,
      },
    }),

    prisma.visitor.count({
      where: {
        status: VisitorStatus.REJECTED,
      },
    }),

    prisma.visitor.count({
      where: {
        status: VisitorStatus.CHECKED_IN,
      },
    }),

    prisma.visitor.count({
      where: {
        status: VisitorStatus.CHECKED_OUT,
      },
    }),
  ]);

  return {
    total,
    pending,
    approved,
    rejected,
    checkedIn,
    checkedOut,
  };
};