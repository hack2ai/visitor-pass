import { Router } from "express";

import {
  createVisitor,
  getAllVisitors,
  getVisitorById,
  updateVisitor,
  updateVisitorStatus,
  deleteVisitor,
  downloadVisitorPass,
  downloadVisitorQRCode,
} from "../controllers/visitor.controller";

import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

/**
 * ==========================================================
 * Visitor Management Routes
 * ==========================================================
 */

/**
 * Create Visitor
 * POST /api/visitors
 */
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "EMPLOYEE"),
  createVisitor
);

/**
 * Get All Visitors
 * GET /api/visitors
 */
router.get(
  "/",
  authenticate,
  getAllVisitors
);

/**
 * Get Visitor By ID
 * GET /api/visitors/:id
 */
router.get(
  "/:id",
  authenticate,
  getVisitorById
);

/**
 * Update Visitor
 * PUT /api/visitors/:id
 */
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "EMPLOYEE"),
  updateVisitor
);

/**
 * Update Visitor Status
 * PATCH /api/visitors/:id/status
 */
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SECURITY"),
  updateVisitorStatus
);

/**
 * Delete Visitor
 * DELETE /api/visitors/:id
 */
router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  deleteVisitor
);

/**
 * Download Visitor Pass
 * GET /api/visitors/:id/pass
 */
router.get(
  "/:id/pass",
  authenticate,
  downloadVisitorPass
);

/**
 * Download Visitor QR Code
 * GET /api/visitors/:id/qrcode
 */
router.get(
  "/:id/qrcode",
  authenticate,
  downloadVisitorQRCode
);

export default router;