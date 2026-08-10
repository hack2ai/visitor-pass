import { Request, Response, NextFunction } from "express";
import jwt, {
  JsonWebTokenError,
  TokenExpiredError,
} from "jsonwebtoken";

interface JwtPayload {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * ==========================================================
 * AUTHENTICATE USER
 * ==========================================================
 */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("\n======================================");
  console.log("AUTH MIDDLEWARE");
  console.log("======================================");
  console.log("URL:", req.originalUrl);
  console.log("Method:", req.method);
  console.log("Authorization Header:", req.headers.authorization);
  console.log("All Headers:", req.headers);

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log("❌ Authorization header is missing.");

      res.status(401).json({
        success: false,
        message: "Access token missing.",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      console.log("❌ Authorization header does not start with Bearer.");

      res.status(401).json({
        success: false,
        message: "Invalid authorization format.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    console.log("Received Token:");
    console.log(token);

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.log("❌ JWT_SECRET not found.");

      res.status(500).json({
        success: false,
        message: "JWT_SECRET not configured.",
      });
      return;
    }

    console.log("JWT_SECRET Loaded: YES");

    const decoded = jwt.verify(token, secret) as JwtPayload;

    console.log("Token Verified Successfully");
    console.log(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log("❌ JWT Verification Failed");

    if (error instanceof TokenExpiredError) {
      console.log("Reason: Token Expired");

      res.status(401).json({
        success: false,
        message: "Token has expired.",
      });
      return;
    }

    if (error instanceof JsonWebTokenError) {
      console.log("Reason:", error.message);

      res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * ==========================================================
 * ROLE AUTHORIZATION
 * ==========================================================
 */
export const authorize =
  (...roles: string[]) =>
  (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): void => {
    console.log("\n======================================");
    console.log("AUTHORIZE MIDDLEWARE");
    console.log("======================================");

    if (!req.user) {
      console.log("❌ req.user is undefined");

      res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
      return;
    }

    console.log("Current User:");
    console.log(req.user);

    console.log("Current Role:", req.user.role);
    console.log("Allowed Roles:", roles);

    if (!roles.includes(req.user.role)) {
      console.log("❌ Role not allowed");

      res.status(403).json({
        success: false,
        message:
          "Forbidden. You don't have permission to access this resource.",
      });
      return;
    }

    console.log("✅ Authorization Successful");

    next();
  };