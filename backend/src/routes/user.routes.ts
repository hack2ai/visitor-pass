import { Router } from "express";

import { getUsers } from "../controllers/user.controller";
import {
  authenticate,
  authorize,
} from "../middleware/auth.middleware";

const router = Router();

/**
 * ==========================================================
 * GET ALL USERS
 * GET /api/users
 * ==========================================================
 */
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "EMPLOYEE", "SECURITY"),
  getUsers
);

export default router;