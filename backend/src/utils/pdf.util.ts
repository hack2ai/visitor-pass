import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export interface VisitorPassData {
  id: string;
  fullName: string;
  email?: string;
  phone: string;
  company?: string;
  purpose: string;
  host: string;
  status: string;
  qrCode?: string;
  faceImage?: string;
}

const COLORS = {
  primary: "#1E40AF",
  secondary: "#2563EB",
  success: "#16A34A",
  warning: "#F59E0B",
  danger: "#DC2626",
  dark: "#111827",
  gray: "#6B7280",
  light: "#F3F4F6",
  border: "#D1D5DB",
  white: "#FFFFFF",
};

function statusColor(status: string) {
  switch (status.toUpperCase()) {
    case "APPROVED":
      return COLORS.success;

    case "PENDING":
      return COLORS.warning;

    case "REJECTED":
      return COLORS.danger;

    case "CHECKED_IN":
      return COLORS.secondary;

    case "CHECKED_OUT":
      return COLORS.gray;

    default:
      return COLORS.dark;
  }
}

function drawRoundedBox(
  doc: PDFKit.PDFDocument,
  x: number,
  y: number,
  width: number,
  height: number
) {
  doc
    .roundedRect(x, y, width, height, 8)
    .fillAndStroke(COLORS.white, COLORS.border);
}

function divider(
  doc: PDFKit.PDFDocument,
  y: number
) {
  doc
    .moveTo(30, y)
    .lineTo(565, y)
    .strokeColor(COLORS.border)
    .lineWidth(1)
    .stroke();
}

function drawLabel(
  doc: PDFKit.PDFDocument,
  label: string,
  value: string,
  x: number,
  y: number
) {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .fillColor(COLORS.dark)
    .text(label, x, y);

  doc
    .font("Helvetica")
    .fillColor(COLORS.gray)
    .text(value, x + 110, y);
}

function drawStatusBadge(
  doc: PDFKit.PDFDocument,
  status: string,
  x: number,
  y: number
) {
  const color = statusColor(status);

  doc
    .roundedRect(x, y, 110, 24, 12)
    .fill(color);

  doc
    .fillColor("white")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text(status, x, y + 7, {
      width: 110,
      align: "center",
    });
}

export const generateVisitorPass = async (
  visitor: VisitorPassData
): Promise<string> => {
  try {
    console.log("\n======================================");
    console.log("GENERATING PROFESSIONAL VISITOR PASS");
    console.log("======================================");

    const outputDir = path.join(
      process.cwd(),
      "uploads",
      "passes"
    );

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, {
        recursive: true,
      });
    }

    const pdfFile = `${visitor.id}.pdf`;

    const absolutePdfPath = path.join(
      outputDir,
      pdfFile
    );

    const logoPath = path.join(
      process.cwd(),
      "public",
      "assets",
      "company-logo.png"
    );

    const defaultAvatar = path.join(
      process.cwd(),
      "public",
      "assets",
      "default-avatar.png"
    );

    const visitorPhoto =
      visitor.faceImage &&
      fs.existsSync(
        path.join(
          process.cwd(),
          visitor.faceImage.replace(/^\/+/, "")
        )
      )
        ? path.join(
            process.cwd(),
            visitor.faceImage.replace(/^\/+/, "")
          )
        : defaultAvatar;

    const qrPath =
      visitor.qrCode &&
      fs.existsSync(
        path.join(
          process.cwd(),
          visitor.qrCode.replace(/^\/+/, "")
        )
      )
        ? path.join(
            process.cwd(),
            visitor.qrCode.replace(/^\/+/, "")
          )
        : null;

    const doc = new PDFDocument({
      size: "A4",

      margin: 30,

      info: {
        Title: "Visitor Pass",

        Author: "AI Visitor Pass Management System",

        Subject: "Visitor Pass",

        Creator: "PMSD",

        Keywords: "Visitor Pass Security QR",
      },
    });

    const stream =
      fs.createWriteStream(
        absolutePdfPath
      );

    doc.pipe(stream);

    // Background

    doc
      .rect(0, 0, 595, 842)
      .fill("#F8FAFC");

    doc.fillColor("black");

    // ===========================
    // HEADER
    // ===========================

    doc
      .rect(0, 0, 595, 100)
      .fill(COLORS.primary);

    if (fs.existsSync(logoPath)) {
      doc.image(
        logoPath,
        40,
        18,
        {
          fit: [60, 60],
        }
      );
    }

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(26)
      .text(
        "AI Visitor Pass",
        120,
        24
      );

    doc
      .fontSize(12)
      .font("Helvetica")
      .text(
        "Visitor Management System",
        120,
        58
      );

    doc
      .fontSize(10)
      .text(
        "Secure • Smart • Digital",
        120,
        76
      );

    // ===========================
    // VISITOR CARD
    // ===========================

    drawRoundedBox(
      doc,
      30,
      120,
      535,
      240
    );

    // PHOTO

    if (
      fs.existsSync(visitorPhoto)
    ) {
      doc.image(
        visitorPhoto,
        50,
        145,
        {
          fit: [110, 130],
          align: "center",
        }
      );
    }

    doc
      .roundedRect(
        50,
        145,
        110,
        130,
        6
      )
      .stroke(COLORS.border);

    doc
      .fontSize(10)
      .fillColor(COLORS.gray)
      .text(
        "Visitor Photo",
        62,
        283
      );

    // TITLE

    doc
      .fillColor(COLORS.dark)
      .font("Helvetica-Bold")
      .fontSize(18)
      .text(
        "Visitor Information",
        190,
        140
      );

    drawStatusBadge(
      doc,
      visitor.status,
      425,
      140
    );

    divider(doc, 175);

    drawLabel(
      doc,
      "Visitor ID",
      visitor.id,
      190,
      195
    );

    drawLabel(
      doc,
      "Full Name",
      visitor.fullName,
      190,
      220
    );

    drawLabel(
      doc,
      "Email",
      visitor.email || "-",
      190,
      245
    );

    drawLabel(
      doc,
      "Phone",
      visitor.phone,
      190,
      270
    );

    drawLabel(
      doc,
      "Company",
      visitor.company || "-",
      190,
      295
    );

    drawLabel(
      doc,
      "Host",
      visitor.host,
      190,
      320
    );

    drawLabel(
      doc,
      "Purpose",
      visitor.purpose,
      190,
      345
    );
      // ===========================
    // QR VERIFICATION SECTION
    // ===========================

    drawRoundedBox(
      doc,
      30,
      385,
      535,
      220
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(COLORS.dark)
      .text(
        "QR Verification",
        50,
        405
      );

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.gray)
      .text(
        "Scan this QR code to verify visitor authenticity.",
        50,
        430
      );

    divider(doc, 455);

    // ===========================
    // QR CODE
    // ===========================

    if (qrPath && fs.existsSync(qrPath)) {
      doc.image(qrPath, 60, 470, {
        fit: [150, 150],
      });

      doc
        .roundedRect(
          60,
          470,
          150,
          150,
          6
        )
        .stroke(COLORS.border);
    } else {
      doc
        .roundedRect(
          60,
          470,
          150,
          150,
          6
        )
        .stroke(COLORS.border);

      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor(COLORS.gray)
        .text(
          "QR Code\nUnavailable",
          90,
          535,
          {
            width: 90,
            align: "center",
          }
        );
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.dark)
      .text(
        "SCAN TO VERIFY",
        65,
        628,
        {
          width: 140,
          align: "center",
        }
      );
    // ===========================
    // QR VERIFICATION SECTION
    // ===========================

    drawRoundedBox(
      doc,
      30,
      385,
      535,
      220
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(18)
      .fillColor(COLORS.dark)
      .text(
        "QR Verification",
        50,
        405
      );

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.gray)
      .text(
        "Scan this QR code to verify visitor authenticity.",
        50,
        430
      );

    divider(doc, 455);

    // ===========================
    // QR CODE
    // ===========================

    if (qrPath && fs.existsSync(qrPath)) {
      doc.image(qrPath, 60, 470, {
        fit: [150, 150],
      });

      doc
        .roundedRect(
          60,
          470,
          150,
          150,
          6
        )
        .stroke(COLORS.border);
    } else {
      doc
        .roundedRect(
          60,
          470,
          150,
          150,
          6
        )
        .stroke(COLORS.border);

      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor(COLORS.gray)
        .text(
          "QR Code\nUnavailable",
          90,
          535,
          {
            width: 90,
            align: "center",
          }
        );
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(COLORS.dark)
      .text(
        "SCAN TO VERIFY",
        65,
        628,
        {
          width: 140,
          align: "center",
        }
      );

    // ===========================
    // PASS INFORMATION
    // ===========================

    drawLabel(
      doc,
      "Issue Date",
      new Date().toLocaleDateString(),
      255,
      485
    );

    drawLabel(
      doc,
      "Issue Time",
      new Date().toLocaleTimeString(),
      255,
      515
    );

    drawLabel(
      doc,
      "Pass Type",
      "Corporate Visitor",
      255,
      545
    );

    drawLabel(
      doc,
      "Verification",
      "Digital QR Verification",
      255,
      575
    );

    drawLabel(
      doc,
      "Security",
      "AI Protected",
      255,
      605
    );

    // ===========================
    // SECURITY BADGE
    // ===========================

    doc
      .roundedRect(
        420,
        520,
        110,
        40,
        20
      )
      .fill(COLORS.success);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text(
        "VERIFIED",
        420,
        534,
        {
          width: 110,
          align: "center",
        }
      );

    doc
      .roundedRect(
        420,
        575,
        110,
        40,
        20
      )
      .fill(COLORS.primary);

    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        "AI SECURED",
        420,
        589,
        {
          width: 110,
          align: "center",
        }
      );
    // ==========================================
    // SIGNATURE SECTION
    // ==========================================

    drawRoundedBox(
      doc,
      30,
      625,
      535,
      90
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor(COLORS.dark)
      .text(
        "Authorization",
        50,
        640
      );

    divider(doc, 665);

    // Reception

    doc
      .strokeColor(COLORS.gray)
      .moveTo(55, 700)
      .lineTo(165, 700)
      .stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor(COLORS.gray)
      .text(
        "Reception",
        80,
        705
      );

    // Security

    doc
      .strokeColor(COLORS.gray)
      .moveTo(235, 700)
      .lineTo(345, 700)
      .stroke();

    doc
      .text(
        "Security Officer",
        245,
        705
      );

    // Host

    doc
      .strokeColor(COLORS.gray)
      .moveTo(420, 700)
      .lineTo(530, 700)
      .stroke();

    doc
      .text(
        "Host Signature",
        430,
        705
      );

    // ==========================================
    // VISITOR INSTRUCTIONS
    // ==========================================

    drawRoundedBox(
      doc,
      30,
      730,
      535,
      85
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(COLORS.primary)
      .text(
        "Visitor Guidelines",
        45,
        742
      );

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.dark)
      .text(
        "• Carry this visitor pass at all times while inside the premises.",
        50,
        765
      );

    doc.text(
      "• Present this pass to security personnel whenever requested."
    );

    doc.text(
      "• Do not enter restricted areas without proper authorization."
    );

    doc.text(
      "• Return this visitor pass before leaving the premises."
    );

    doc.text(
      "• Report any lost or damaged visitor pass immediately."
    );

    // ==========================================
    // SECURITY NOTICE
    // ==========================================

    doc
      .roundedRect(
        390,
        742,
        155,
        60,
        8
      )
      .fill("#E8F5E9");

    doc
      .fillColor(COLORS.success)
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(
        "✓ SECURITY VERIFIED",
        400,
        755
      );

    doc
      .fillColor(COLORS.gray)
      .fontSize(8)
      .font("Helvetica")
      .text(
        "Protected using QR Verification & AI Validation",
        400,
        775,
        {
          width: 135,
        }
      );
    // ==========================================
    // PROFESSIONAL FOOTER
    // ==========================================

    doc
      .rect(0, 820, 595, 22)
      .fill(COLORS.primary);

    doc
      .fillColor("white")
      .font("Helvetica")
      .fontSize(8)
      .text(
        "Generated by AI Visitor Pass Management System",
        30,
        827
      );

    doc
      .text(
        "www.yourcompany.com",
        235,
        827
      );

    doc
      .text(
        "support@yourcompany.com",
        420,
        827,
        {
          width: 150,
          align: "right",
        }
      );

    // ==========================================
    // DIGITAL VERIFICATION
    // ==========================================

    const verificationId =
      visitor.id.substring(0, 8).toUpperCase();

    doc
      .fillColor(COLORS.gray)
      .font("Helvetica")
      .fontSize(8)
      .text(
        `Verification ID : ${verificationId}`,
        35,
        805
      );

    doc.text(
      `Generated : ${new Date().toLocaleString()}`,
      200,
      805
    );

    doc.text(
      "Document Version : 1.0",
      430,
      805
    );

    // ==========================================
    // WATERMARK
    // ==========================================

    doc.save();

    doc.rotate(
      -35,
      {
        origin: [300, 430],
      }
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(60)
      .fillColor("#E5E7EB")
      .opacity(0.15)
      .text(
        "AI VISITOR PASS",
        60,
        420,
        {
          align: "center",
          width: 500,
        }
      );

    doc.restore();

    // ==========================================
    // SECURITY STRIP
    // ==========================================

    doc
      .rect(560, 100, 5, 720)
      .fill(COLORS.success);

    // ==========================================
    // PASS SERIAL NUMBER
    // ==========================================

    doc
      .fillColor(COLORS.dark)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        `PASS NO : ${visitor.id}`,
        360,
        780
      );

    // ==========================================
    // AI AUTHENTICATION
    // ==========================================

    doc
      .roundedRect(
        360,
        735,
        175,
        35,
        8
      )
      .fill("#DBEAFE");

    doc
      .fillColor(COLORS.primary)
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(
        "AI AUTHENTICATED ✓",
        360,
        748,
        {
          width: 175,
          align: "center",
        }
      );

    // ==========================================
    // COPYRIGHT
    // ==========================================

    doc
      .fillColor(COLORS.gray)
      .font("Helvetica")
      .fontSize(7)
      .text(
        "© 2026 AI Visitor Pass Management System. All Rights Reserved.",
        30,
        792
      );

    // ==========================================
    // PRINT NOTICE
    // ==========================================

    doc
      .fontSize(7)
      .text(
        "This document is electronically generated and can be verified by scanning the QR Code.",
        30,
        780
      );
      // ==========================================
    // FINALIZE PDF
    // ==========================================

    console.log("\n======================================");
    console.log("FINALIZING PDF...");
    console.log("======================================");

    doc.end();

    return await new Promise<string>((resolve, reject) => {
      stream.on("finish", () => {
        console.log("Visitor Pass Generated Successfully");
        console.log("File:", absolutePdfPath);

        if (!fs.existsSync(absolutePdfPath)) {
          return reject(
            new Error("PDF file was not created.")
          );
        }

        const stats = fs.statSync(absolutePdfPath);

        console.log("PDF Size:", stats.size, "bytes");

        const dbPath = `/uploads/passes/${pdfFile}`;

        console.log("Database Path:", dbPath);

        console.log("======================================");
        console.log("PDF GENERATION COMPLETED");
        console.log("======================================\n");

        resolve(dbPath);
      });

      stream.on("error", (err) => {
        console.error("Write Stream Error");
        console.error(err);
        reject(err);
      });
    });
  } catch (error) {
    console.error("\n======================================");
    console.error("PDF GENERATION FAILED");
    console.error("======================================");
    console.error(error);

    throw error;
  }
};