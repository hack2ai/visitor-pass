import { Prisma, VisitorStatus } from "@prisma/client";
import prisma from "../config/prisma";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

// ==========================================================
// TYPES
// ==========================================================

export interface ReportFilters {
  search?: string;
  status?: string;
  company?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

// ==========================================================
// HELPERS
// ==========================================================

const buildWhereClause = (
  filters: ReportFilters = {}
): Prisma.VisitorWhereInput => {
  const {
    search,
    status,
    company,
    from,
    to,
  } = filters;

  const where: Prisma.VisitorWhereInput = {};

  // ========================================================
  // SEARCH
  // ========================================================

  if (search?.trim()) {
    const searchValue = search.trim();

    where.OR = [
      {
        fullName: {
          contains: searchValue,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: searchValue,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: searchValue,
          mode: "insensitive",
        },
      },
      {
        purpose: {
          contains: searchValue,
          mode: "insensitive",
        },
      },
      {
        company: {
          contains: searchValue,
          mode: "insensitive",
        },
      },
    ];
  }

  // ========================================================
  // STATUS
  // ========================================================

  if (status?.trim()) {
    const validStatuses = Object.values(VisitorStatus);

    if (
      validStatuses.includes(
        status as VisitorStatus
      )
    ) {
      where.status = status as VisitorStatus;
    }
  }

  // ========================================================
  // COMPANY
  // ========================================================

  if (company?.trim()) {
    where.company = {
      contains: company.trim(),
      mode: "insensitive",
    };
  }

  // ========================================================
  // DATE RANGE
  // ========================================================

  if (from || to) {
    const createdAt: Prisma.DateTimeFilter = {};

    if (from) {
      const fromDate = new Date(from);

      if (!Number.isNaN(fromDate.getTime())) {
        fromDate.setHours(
          0,
          0,
          0,
          0
        );

        createdAt.gte = fromDate;
      }
    }

    if (to) {
      const toDate = new Date(to);

      if (!Number.isNaN(toDate.getTime())) {
        toDate.setHours(
          23,
          59,
          59,
          999
        );

        createdAt.lte = toDate;
      }
    }

    if (
      createdAt.gte ||
      createdAt.lte
    ) {
      where.createdAt = createdAt;
    }
  }

  return where;
};

// ==========================================================
// GET REPORTS
// ==========================================================

export const getReports = async (
  filters: ReportFilters = {}
) => {
  const page = Math.max(
    Number(filters.page) || 1,
    1
  );

  const limit = Math.min(
    Math.max(
      Number(filters.limit) || 10,
      1
    ),
    100
  );

  const where =
    buildWhereClause(filters);

  const skip =
    (page - 1) * limit;

  const [
    visitors,
    total,
  ] = await Promise.all([
    prisma.visitor.findMany({
      where,

      include: {
        host: {
          select: {
            id: true,

            // IMPORTANT:
            // User model uses "name", not "fullName".
            name: true,

            email: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },

      skip,
      take: limit,
    }),

    prisma.visitor.count({
      where,
    }),
  ]);

  // ========================================================
  // SUMMARY
  // ========================================================

  const [
    totalVisitors,
    checkedIn,
    checkedOut,
    pending,
  ] = await Promise.all([
    prisma.visitor.count(),

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

    prisma.visitor.count({
      where: {
        status: VisitorStatus.PENDING,
      },
    }),
  ]);

  return {
    success: true,

    message:
      "Reports fetched successfully.",

    data: visitors,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },

    summary: {
      totalVisitors,
      checkedIn,
      checkedOut,
      pending,
    },
  };
};

// ==========================================================
// REPORT SUMMARY
// ==========================================================

export const getReportsSummary =
  async () => {
    const [
      totalVisitors,
      checkedIn,
      checkedOut,
      pending,
    ] = await Promise.all([
      prisma.visitor.count(),

      prisma.visitor.count({
        where: {
          status:
            VisitorStatus.CHECKED_IN,
        },
      }),

      prisma.visitor.count({
        where: {
          status:
            VisitorStatus.CHECKED_OUT,
        },
      }),

      prisma.visitor.count({
        where: {
          status:
            VisitorStatus.PENDING,
        },
      }),
    ]);

    return {
      totalVisitors,
      checkedIn,
      checkedOut,
      pending,
    };
  };

// ==========================================================
// REPORT ANALYTICS
// ==========================================================

export const getReportsAnalytics =
  async () => {
    const visitors =
      await prisma.visitor.findMany({
        select: {
          status: true,
          createdAt: true,
        },
      });

    // ======================================================
    // STATUS CHART
    // ======================================================

    const statusChart = [
      {
        name: "Pending",
        value: visitors.filter(
          (visitor) =>
            visitor.status ===
            VisitorStatus.PENDING
        ).length,
      },

      {
        name: "Approved",
        value: visitors.filter(
          (visitor) =>
            visitor.status ===
            VisitorStatus.APPROVED
        ).length,
      },

      {
        name: "Checked In",
        value: visitors.filter(
          (visitor) =>
            visitor.status ===
            VisitorStatus.CHECKED_IN
        ).length,
      },

      {
        name: "Checked Out",
        value: visitors.filter(
          (visitor) =>
            visitor.status ===
            VisitorStatus.CHECKED_OUT
        ).length,
      },

      {
        name: "Rejected",
        value: visitors.filter(
          (visitor) =>
            visitor.status ===
            VisitorStatus.REJECTED
        ).length,
      },
    ];

    // ======================================================
    // MONTHLY VISITORS
    // ======================================================

    const monthlyMap =
      new Map<string, number>();

    visitors.forEach(
      (visitor) => {
        const month =
          visitor.createdAt.toLocaleString(
            "en-US",
            {
              month: "short",
            }
          );

        monthlyMap.set(
          month,
          (monthlyMap.get(month) ?? 0) +
            1
        );
      }
    );

    const monthlyVisitors = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ].map((month) => ({
      month,
      visitors:
        monthlyMap.get(month) ?? 0,
    }));

    return {
      totalVisitors:
        visitors.length,

      statusChart,

      monthlyVisitors,
    };
  };

// ==========================================================
// EXPORT REPORTS TO EXCEL
// ==========================================================

export const exportReportsToExcel =
  async (
    filters: ReportFilters = {}
  ) => {
    const where =
      buildWhereClause(filters);

    console.log(
      "========================================"
    );

    console.log(
      "EXPORTING VISITOR REPORT TO EXCEL"
    );

    console.log(
      "Excel Filters:",
      filters
    );

    console.log(
      "========================================"
    );

    // ======================================================
    // FETCH VISITORS
    // ======================================================

    const visitors =
      await prisma.visitor.findMany({
        where,

        include: {
          host: {
            select: {
              id: true,

              // IMPORTANT:
              // User model field is "name".
              name: true,

              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    console.log(
      "Visitors found:",
      visitors.length
    );

    // ======================================================
    // CREATE WORKBOOK
    // ======================================================

    const workbook =
      new ExcelJS.Workbook();

    workbook.creator =
      "AI Visitor Pass Management System";

    workbook.company =
      "AI Visitor Pass Management System";

    workbook.created =
      new Date();

    workbook.modified =
      new Date();

    // ======================================================
    // WORKSHEET
    // ======================================================

    const worksheet =
      workbook.addWorksheet(
        "Visitor Reports"
      );

    // ======================================================
    // COLUMNS
    // ======================================================

    worksheet.columns = [
      {
        header: "Visitor Name",
        key: "fullName",
        width: 28,
      },

      {
        header: "Email",
        key: "email",
        width: 32,
      },

      {
        header: "Phone",
        key: "phone",
        width: 18,
      },

      {
        header: "Company",
        key: "company",
        width: 25,
      },

      {
        header: "Host",
        key: "host",
        width: 25,
      },

      {
        header: "Host Email",
        key: "hostEmail",
        width: 32,
      },

      {
        header: "Purpose",
        key: "purpose",
        width: 30,
      },

      {
        header: "Status",
        key: "status",
        width: 20,
      },

      {
        header: "Created At",
        key: "createdAt",
        width: 25,
      },
    ];

    // ======================================================
    // HEADER STYLE
    // ======================================================

    const headerRow =
      worksheet.getRow(1);

    headerRow.font = {
      bold: true,
      color: {
        argb: "FFFFFFFF",
      },
    };

    headerRow.alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "2563EB",
      },
    };

    headerRow.height = 24;

    // ======================================================
    // ADD DATA
    // ======================================================

    visitors.forEach(
      (visitor) => {
        worksheet.addRow({
          fullName:
            visitor.fullName,

          email:
            visitor.email || "-",

          phone:
            visitor.phone || "-",

          company:
            visitor.company || "-",

          // IMPORTANT:
          // host uses User.name.
          host:
            visitor.host?.name ??
            "N/A",

          hostEmail:
            visitor.host?.email ??
            "-",

          purpose:
            visitor.purpose || "-",

          status:
            visitor.status.replaceAll(
              "_",
              " "
            ),

          createdAt:
            visitor.createdAt.toLocaleString(
              "en-IN"
            ),
        });
      }
    );

    // ======================================================
    // STYLE DATA ROWS
    // ======================================================

    worksheet.eachRow(
      (row, rowNumber) => {
        row.eachCell(
          (cell) => {
            cell.border = {
              top: {
                style: "thin",
              },

              bottom: {
                style: "thin",
              },

              left: {
                style: "thin",
              },

              right: {
                style: "thin",
              },
            };

            cell.alignment = {
              vertical: "middle",
              wrapText: true,
            };
          }
        );

        if (rowNumber > 1) {
          row.height = 22;
        }
      }
    );

    // ======================================================
    // FILTER
    // ======================================================

    worksheet.autoFilter = {
      from: "A1",
      to: "I1",
    };

    // ======================================================
    // FREEZE HEADER
    // ======================================================

    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // ======================================================
    // RETURN WORKBOOK
    // ======================================================

    return workbook;
  };

// ==========================================================
// EXPORT REPORTS TO PDF
// ==========================================================

export const exportReportsToPDF =
  async (
    filters: ReportFilters = {}
  ): Promise<Buffer> => {
    const where =
      buildWhereClause(filters);

    console.log(
      "========================================"
    );

    console.log(
      "EXPORTING VISITOR REPORT TO PDF"
    );

    console.log(
      "PDF Filters:",
      filters
    );

    console.log(
      "========================================"
    );

    // ======================================================
    // FETCH VISITORS
    // ======================================================

    const visitors =
      await prisma.visitor.findMany({
        where,

        include: {
          host: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    // ======================================================
    // CREATE PDF
    // ======================================================

    return new Promise<Buffer>(
      (resolve, reject) => {
        const doc =
          new PDFDocument({
            size: "A4",
            margin: 40,
            bufferPages: true,
          });

        const chunks: Buffer[] = [];

        doc.on(
          "data",
          (chunk: Buffer) => {
            chunks.push(chunk);
          }
        );

        doc.on("end", () => {
          resolve(
            Buffer.concat(chunks)
          );
        });

        doc.on(
          "error",
          (error) => {
            reject(error);
          }
        );

        // ==================================================
        // TITLE
        // ==================================================

        doc
          .fontSize(20)
          .font("Helvetica-Bold")
          .text(
            "AI Visitor Pass Management System",
            {
              align: "center",
            }
          );

        doc.moveDown(0.5);

        doc
          .fontSize(16)
          .font("Helvetica-Bold")
          .text(
            "Visitor Report",
            {
              align: "center",
            }
          );

        doc.moveDown();

        // ==================================================
        // REPORT INFORMATION
        // ==================================================

        doc
          .fontSize(10)
          .font("Helvetica")
          .text(
            `Generated: ${new Date().toLocaleString(
              "en-IN"
            )}`
          );

        doc.text(
          `Total Visitors: ${visitors.length}`
        );

        doc.moveDown();

        // ==================================================
        // FILTER INFORMATION
        // ==================================================

        const activeFilters: string[] = [];

        if (filters.search) {
          activeFilters.push(
            `Search: ${filters.search}`
          );
        }

        if (filters.status) {
          activeFilters.push(
            `Status: ${filters.status}`
          );
        }

        if (filters.company) {
          activeFilters.push(
            `Company: ${filters.company}`
          );
        }

        if (filters.from) {
          activeFilters.push(
            `From: ${filters.from}`
          );
        }

        if (filters.to) {
          activeFilters.push(
            `To: ${filters.to}`
          );
        }

        if (activeFilters.length > 0) {
          doc
            .font("Helvetica-Bold")
            .text("Filters:");

          doc
            .font("Helvetica")
            .text(
              activeFilters.join(" | ")
            );

          doc.moveDown();
        }

        // ==================================================
        // SEPARATOR
        // ==================================================

        doc
          .moveTo(40, doc.y)
          .lineTo(555, doc.y)
          .stroke();

        doc.moveDown();

        // ==================================================
        // VISITORS
        // ==================================================

        if (visitors.length === 0) {
          doc
            .fontSize(13)
            .font("Helvetica")
            .text(
              "No visitors found for the selected filters.",
              {
                align: "center",
              }
            );

          doc.end();

          return;
        }

        visitors.forEach(
          (visitor, index) => {
            // Start a new page when necessary.
            if (doc.y > 700) {
              doc.addPage();
            }

            doc
              .fontSize(13)
              .font("Helvetica-Bold")
              .text(
                `${index + 1}. ${visitor.fullName}`
              );

            doc
              .fontSize(10)
              .font("Helvetica");

            doc.text(
              `Email: ${
                visitor.email || "-"
              }`
            );

            doc.text(
              `Phone: ${
                visitor.phone || "-"
              }`
            );

            doc.text(
              `Company: ${
                visitor.company || "-"
              }`
            );

            doc.text(
              `Host: ${
                visitor.host?.name ||
                "N/A"
              }`
            );

            doc.text(
              `Host Email: ${
                visitor.host?.email ||
                "-"
              }`
            );

            doc.text(
              `Purpose: ${
                visitor.purpose || "-"
              }`
            );

            doc.text(
              `Status: ${visitor.status.replaceAll(
                "_",
                " "
              )}`
            );

            doc.text(
              `Created At: ${visitor.createdAt.toLocaleString(
                "en-IN"
              )}`
            );

            doc.moveDown(0.5);

            doc
              .moveTo(40, doc.y)
              .lineTo(555, doc.y)
              .stroke();

            doc.moveDown();
          }
        );

        // ==================================================
        // FOOTER / PAGE NUMBERS
        // ==================================================

        const range =
          doc.bufferedPageRange();

        for (
          let i = 0;
          i < range.count;
          i++
        ) {
          doc.switchToPage(i);

          doc
            .fontSize(8)
            .font("Helvetica")
            .text(
              `Page ${i + 1} of ${range.count}`,
              40,
              805,
              {
                align: "center",
                width: 515,
              }
            );
        }

        doc.end();
      }
    );
  };