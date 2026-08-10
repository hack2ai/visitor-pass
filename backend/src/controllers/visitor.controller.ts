import fs from "fs";
import path from "path";

import { Request, Response } from "express";
import { VisitorStatus } from "@prisma/client";
import { ZodError } from "zod";

import { AuthRequest } from "../middleware/auth.middleware";
import * as visitorService from "../services/visitor.service";

import {
  createVisitorSchema,
  updateVisitorSchema,
  updateVisitorStatusSchema,
} from "../validations/visitor.validation";

import type {
  VisitorQueryOptions,
} from "../repositories/visitor.repository";

type VisitorParams = {
  id: string;
};

const LOG_LINE =
  "======================================================";

// ======================================================
// LOGGING
// ======================================================

const log = (title: string): void => {
  console.log("\n" + LOG_LINE);
  console.log(title);
  console.log(LOG_LINE);
};

// ======================================================
// RESPONSE HELPERS
// ======================================================

const success = (
  res: Response,
  status: number,
  message: string,
  data?: unknown,
  meta?: unknown
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    meta,
    timestamp: new Date().toISOString(),
  });
};

const failure = (
  res: Response,
  status: number,
  message: string,
  error?: unknown
) => {
  return res.status(status).json({
    success: false,
    message,
    error:
      process.env.NODE_ENV === "development"
        ? error
        : undefined,
    timestamp: new Date().toISOString(),
  });
};

// ======================================================
// ERROR HANDLER
// ======================================================

const handleError = (
  res: Response,
  error: unknown
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return failure(
      res,
      422,
      "Validation failed.",
      error.flatten()
    );
  }

  if (error instanceof Error) {
    const message = error.message;

    if (
      message.toLowerCase().includes("unauthorized")
    ) {
      return failure(
        res,
        401,
        message
      );
    }

    if (
      message.toLowerCase().includes("not found")
    ) {
      return failure(
        res,
        404,
        message
      );
    }

    if (
      message.toLowerCase().includes("already")
    ) {
      return failure(
        res,
        409,
        message
      );
    }

    return failure(
      res,
      400,
      message
    );
  }

  return failure(
    res,
    500,
    "Internal Server Error"
  );
};

// ======================================================
// CREATE VISITOR
// ======================================================

export const createVisitor = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  log("CREATE VISITOR CONTROLLER");

  try {
    if (!req.user) {
      failure(
        res,
        401,
        "Unauthorized"
      );
      return;
    }

    const payload =
      createVisitorSchema.parse(
        req.body
      );

    const visitor =
      await visitorService.createVisitor({
        ...payload,
        hostId: req.user.id,
      });

    success(
      res,
      201,
      "Visitor created successfully.",
      visitor
    );
  } catch (error) {
    handleError(res, error);
  }
};

// ======================================================
// GET ALL VISITORS
// ======================================================

export const getAllVisitors = async (
  req: Request<
    Record<string, never>,
    unknown,
    unknown,
    {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      sort?: string;
      order?: "asc" | "desc";
    }
  >,
  res: Response
): Promise<void> => {
  log("GET ALL VISITORS");

  try {
    const page = Math.max(
      Number(req.query.page ?? 1) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(req.query.limit ?? 10) || 10,
        1
      ),
      100
    );

    // --------------------------------------------------
    // Validate status
    // --------------------------------------------------

    let status: VisitorStatus | undefined;

    if (req.query.status) {
      const requestedStatus =
        req.query.status
          .trim()
          .toUpperCase();

      if (
        Object.values(
          VisitorStatus
        ).includes(
          requestedStatus as VisitorStatus
        )
      ) {
        status =
          requestedStatus as VisitorStatus;
      } else {
        throw new Error(
          `Invalid visitor status: ${req.query.status}`
        );
      }
    }

    // --------------------------------------------------
    // Validate sort field
    // --------------------------------------------------

    const allowedSortFields = [
      "id",
      "fullName",
      "email",
      "phone",
      "company",
      "purpose",
      "status",
      "createdAt",
      "updatedAt",
      "checkIn",
      "checkOut",
    ] as const;

    type SortField =
      (typeof allowedSortFields)[number];

    const requestedSort =
      req.query.sort?.trim();

    const sortBy: SortField =
      requestedSort &&
      (
        allowedSortFields as readonly string[]
      ).includes(requestedSort)
        ? (requestedSort as SortField)
        : "createdAt";

    // --------------------------------------------------
    // Order
    // --------------------------------------------------

    const order =
      req.query.order === "asc"
        ? "asc"
        : "desc";

    // --------------------------------------------------
    // Build repository-compatible options
    // --------------------------------------------------

    const options: VisitorQueryOptions = {
      page,
      limit,

      search:
        req.query.search?.trim() ||
        undefined,

      status,

      sortBy,

      order,
    };

    const result =
      await visitorService.getAllVisitors(
        options
      );

    success(
      res,
      200,
      "Visitors fetched successfully.",
      result.data,
      result.pagination
    );
  } catch (error) {
    handleError(res, error);
  }
};

// ======================================================
// GET VISITOR BY ID
// ======================================================

export const getVisitorById = async (
  req: AuthRequest & {
    params: VisitorParams;
  },
  res: Response
): Promise<void> => {
  log("GET VISITOR");

  try {
    const visitor =
      await visitorService.getVisitorById(
        req.params.id
      );

    success(
      res,
      200,
      "Visitor fetched successfully.",
      visitor
    );
  } catch (error) {
    handleError(res, error);
  }
};

// ======================================================
// UPDATE VISITOR
// ======================================================

export const updateVisitor = async (
  req: AuthRequest & {
    params: VisitorParams;
  },
  res: Response
): Promise<void> => {
  log("UPDATE VISITOR");

  try {
    const payload =
      updateVisitorSchema.parse(
        req.body
      );

    const visitor =
      await visitorService.updateVisitor(
        req.params.id,
        payload
      );

    success(
      res,
      200,
      "Visitor updated successfully.",
      visitor
    );
  } catch (error) {
    handleError(res, error);
  }
};

// ======================================================
// UPDATE VISITOR STATUS
// ======================================================

export const updateVisitorStatus =
  async (
    req: AuthRequest & {
      params: VisitorParams;
    },
    res: Response
  ): Promise<void> => {
    log("UPDATE VISITOR STATUS");

    try {
      const { status } =
        updateVisitorStatusSchema.parse(
          req.body
        );

      const visitor =
        await visitorService.updateVisitorStatus(
          req.params.id,
          status
        );

      success(
        res,
        200,
        "Visitor status updated successfully.",
        visitor
      );
    } catch (error) {
      handleError(res, error);
    }
  };

// ======================================================
// DELETE VISITOR
// ======================================================

export const deleteVisitor = async (
  req: AuthRequest & {
    params: VisitorParams;
  },
  res: Response
): Promise<void> => {
  log("DELETE VISITOR");

  try {
    const result =
      await visitorService.deleteVisitor(
        req.params.id
      );

    success(
      res,
      200,
      result.message,
      result
    );
  } catch (error) {
    handleError(res, error);
  }
};

// ======================================================
// DOWNLOAD VISITOR PASS
// ======================================================

export const downloadVisitorPass =
  async (
    req: AuthRequest & {
      params: VisitorParams;
    },
    res: Response
  ): Promise<void> => {
    log("DOWNLOAD VISITOR PASS");

    try {
      const relativePath =
        await visitorService.getVisitorPassPath(
          req.params.id
        );

      const visitor =
        await visitorService.getVisitorById(
          req.params.id
        );

      const filePath = path.resolve(
        process.cwd(),
        relativePath.replace(/^\/+/, "")
      );

      if (!fs.existsSync(filePath)) {
        throw new Error(
          "Visitor pass file not found."
        );
      }

      res.setHeader(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );

      res.setHeader(
        "Pragma",
        "no-cache"
      );

      res.setHeader(
        "Expires",
        "0"
      );

      const safeName =
        visitor.fullName
          .replace(/[^a-zA-Z0-9-_ ]/g, "")
          .trim()
          .replace(/\s+/g, "_");

      return void res.download(
        filePath,
        `${safeName}_Visitor_Pass.pdf`,
        (err) => {
          if (
            err &&
            !res.headersSent
          ) {
            handleError(
              res,
              err
            );
          }
        }
      );
    } catch (error) {
      handleError(res, error);
    }
  };

// ======================================================
// DOWNLOAD QR CODE
// ======================================================

export const downloadVisitorQRCode =
  async (
    req: AuthRequest & {
      params: VisitorParams;
    },
    res: Response
  ): Promise<void> => {
    log("DOWNLOAD QR CODE");

    try {
      const relativePath =
        await visitorService.getVisitorQRCodePath(
          req.params.id
        );

      const visitor =
        await visitorService.getVisitorById(
          req.params.id
        );

      const filePath = path.resolve(
        process.cwd(),
        relativePath.replace(/^\/+/, "")
      );

      if (!fs.existsSync(filePath)) {
        throw new Error(
          "QR Code file not found."
        );
      }

      const safeName =
        visitor.fullName
          .replace(/[^a-zA-Z0-9-_ ]/g, "")
          .trim()
          .replace(/\s+/g, "_");

      return void res.download(
        filePath,
        `${safeName}_QRCode.png`,
        (err) => {
          if (
            err &&
            !res.headersSent
          ) {
            handleError(
              res,
              err
            );
          }
        }
      );
    } catch (error) {
      handleError(res, error);
    }
  };

// ======================================================
// DASHBOARD STATS
// ======================================================

export const getDashboardStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  log("GET DASHBOARD STATS");

  try {
    const stats =
      await visitorService.getVisitorStats();

    success(
      res,
      200,
      "Dashboard statistics fetched successfully.",
      stats
    );
  } catch (error) {
    handleError(res, error);
  }
};

// ======================================================
// EXPORTS
// ======================================================

export default {
  createVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  updateVisitorStatus,
  deleteVisitor,
  downloadVisitorPass,
  downloadVisitorQRCode,
  getDashboardStats,
};