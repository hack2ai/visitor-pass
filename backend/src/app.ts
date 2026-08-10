import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import visitorRoutes from "./routes/visitor.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import reportsRoutes from "./routes/reports.routes";

const app = express();

/**
 * ==========================================
 * Disable ETag (Prevents 304 Not Modified)
 * ==========================================
 */
app.disable("etag");

/**
 * ==========================================
 * Middleware
 * ==========================================
 */

app.use(cors());

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/**
 * ==========================================
 * Upload Folder
 * ==========================================
 */

const uploadsPath = path.resolve(
  process.cwd(),
  "uploads"
);

console.log("=================================");
console.log("Uploads Folder :", uploadsPath);
console.log("Folder Exists  :", fs.existsSync(uploadsPath));

const qrPath = path.join(
  uploadsPath,
  "qrcodes"
);

console.log("QR Folder      :", qrPath);
console.log("QR Exists      :", fs.existsSync(qrPath));

if (fs.existsSync(qrPath)) {
  console.log("QR Files:");
  console.log(fs.readdirSync(qrPath));
}

console.log("=================================");

/**
 * ==========================================
 * Static Uploads
 * ==========================================
 */

app.use(
  "/uploads",

  (req, _res, next) => {
    console.log("=================================");
    console.log("STATIC FILE REQUEST");
    console.log("URL      :", req.originalUrl);
    console.log("Method   :", req.method);

    const requestedFile = path.join(
      uploadsPath,
      req.path.replace(/^\/+/, "")
    );

    console.log("Resolved :", requestedFile);
    console.log("Exists   :", fs.existsSync(requestedFile));
    console.log("=================================");

    next();
  },

  express.static(uploadsPath, {
    etag: false,
    lastModified: false,
    cacheControl: false,
    maxAge: 0,
  })
);

/**
 * ==========================================
 * Test Route
 * ==========================================
 */

app.get("/test-image", (_req, res) => {
  try {
    const folder = path.join(
      uploadsPath,
      "qrcodes"
    );

    console.log("Folder:", folder);

    console.log(
      "Folder Exists:",
      fs.existsSync(folder)
    );

    if (!fs.existsSync(folder)) {
      return res
        .status(404)
        .send("QR Folder Not Found");
    }

    const files = fs.readdirSync(folder);

    console.log("QR Files:");
    console.log(files);

    if (files.length === 0) {
      return res
        .status(404)
        .send("No QR files found");
    }

    const image = path.join(folder, files[0]);

    console.log("Serving:", image);

    return res.sendFile(image);
  } catch (err) {
    console.error(err);

    return res.status(500).send(err);
  }
});

/**
 * ==========================================
 * Health Check
 * ==========================================
 */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    project: "AI Visitor Pass Management System",
    version: "1.0.0",
    status: "Running",
  });
});

/**
 * ==========================================
 * API Routes
 * ==========================================
 */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/visitors", visitorRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportsRoutes);

/**
 * ==========================================
 * 404 Handler
 * ==========================================
 */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/**
 * ==========================================
 * Global Error Handler
 * ==========================================
 */

app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Global Error:", err);

    res.status(500).json({
      success: false,
      message:
        err?.message || "Internal Server Error",
    });
  }
);

export default app;