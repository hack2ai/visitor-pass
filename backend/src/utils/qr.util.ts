import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export interface QRPayload {
  visitorId: string;
  fullName: string;
  purpose: string;
  status: string;
  host: string;
}

export const generateVisitorQRCode = async (
  payload: QRPayload
): Promise<string> => {
  try {
    // Backend root
    const backendRoot = process.cwd();

    // uploads/qrcodes
    const uploadDir = path.join(
      backendRoot,
      "uploads",
      "qrcodes"
    );

    console.log("========== QR DEBUG ==========");
    console.log("Backend Root :", backendRoot);
    console.log("Upload Folder:", uploadDir);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });

      console.log("Created uploads/qrcodes folder");
    }

    const fileName = `${payload.visitorId}.png`;

    const filePath = path.join(uploadDir, fileName);

    console.log("QR File:", filePath);

    await QRCode.toFile(
      filePath,
      JSON.stringify(payload),
      {
        errorCorrectionLevel: "H",
        width: 400,
        margin: 2,
      }
    );

    console.log("QR Generated Successfully");
    console.log("=============================");

    return `/uploads/qrcodes/${fileName}`;
  } catch (err) {
    console.error("QR GENERATION FAILED");
    console.error(err);

    throw err;
  }
};