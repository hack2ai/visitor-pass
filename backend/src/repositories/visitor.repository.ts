import { Prisma, VisitorStatus } from "@prisma/client";
import prisma from "../config/prisma";

// ======================================================
// SHARED DATABASE HELPER
// ======================================================

const getDb = (
  tx?: Prisma.TransactionClient
) => tx ?? prisma;

// ======================================================
// SHARED INCLUDE
// ======================================================

export const visitorInclude =
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

// ======================================================
// QUERY TYPES
// ======================================================

export interface VisitorQueryOptions {
  page?: number;
  limit?: number;

  search?: string;

  status?: VisitorStatus;

  hostId?: string;

  from?: Date;

  to?: Date;

  sortBy?: Prisma.VisitorScalarFieldEnum;

  order?:
    | Prisma.SortOrder
    | "asc"
    | "desc";
}

// ======================================================
// DEFAULT PAGINATION
// ======================================================

export const DEFAULT_PAGE = 1;

export const DEFAULT_LIMIT = 10;

export const DEFAULT_SORT =
  "createdAt";

export const DEFAULT_ORDER: Prisma.SortOrder =
  "desc";

// ======================================================
// BUILD WHERE CLAUSE
// ======================================================

const buildWhereClause = (
  options: VisitorQueryOptions
): Prisma.VisitorWhereInput => {
  const where: Prisma.VisitorWhereInput = {};

  if (options.status) {
    where.status = options.status;
  }

  if (options.hostId) {
    where.hostId = options.hostId;
  }

  if (options.search?.trim()) {
    where.OR = [
      {
        fullName: {
          contains: options.search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: options.search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: options.search,
          mode: "insensitive",
        },
      },
      {
        company: {
          contains: options.search,
          mode: "insensitive",
        },
      },
      {
        purpose: {
          contains: options.search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (options.from || options.to) {
    where.createdAt = {};

    if (options.from) {
      where.createdAt.gte =
        options.from;
    }

    if (options.to) {
      where.createdAt.lte =
        options.to;
    }
  }

  return where;
};

// ======================================================
// BUILD ORDER BY
// ======================================================

const buildOrderBy = (
  options: VisitorQueryOptions
): Prisma.VisitorOrderByWithRelationInput => ({
  [
    options.sortBy ??
      DEFAULT_SORT
  ]:
    options.order ??
    DEFAULT_ORDER,
});

// ======================================================
// CREATE VISITOR
// ======================================================

export const createVisitor = async (
  data: Prisma.VisitorCreateInput,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.create({
    data,
    include: visitorInclude,
  });
};

// ======================================================
// GET VISITOR BY ID
// ======================================================

export const getVisitorById = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findUnique({
    where: {
      id: visitorId,
    },
    include: visitorInclude,
  });
};

// ======================================================
// GET VISITOR BY EMAIL
// ======================================================

export const getVisitorByEmail = async (
  email: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findFirst({
    where: {
      email,
    },
    include: visitorInclude,
  });
};

// ======================================================
// CHECK VISITOR EXISTS
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
// GET ALL VISITORS
// ======================================================

export const getAllVisitors = async (
  options: VisitorQueryOptions = {},
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  const page = options.page ?? DEFAULT_PAGE;
  const limit = options.limit ?? DEFAULT_LIMIT;

  const skip = (page - 1) * limit;

  const where = buildWhereClause(options);

  const orderBy = buildOrderBy(options);

  const [visitors, total] = await Promise.all([
    db.visitor.findMany({
      where,
      include: visitorInclude,
      skip,
      take: limit,
      orderBy,
    }),

    db.visitor.count({
      where,
    }),
  ]);

  return {
    data: visitors,

    pagination: {
      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),

      hasNextPage: page * limit < total,

      hasPreviousPage: page > 1,
    },
  };
};

// ======================================================
// GET VISITORS BY HOST
// ======================================================

export const getVisitorsByHost = async (
  hostId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findMany({
    where: {
      hostId,
    },

    include: visitorInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
};

// ======================================================
// GET VISITORS BY STATUS
// ======================================================

export const getVisitorsByStatus = async (
  status: VisitorStatus,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findMany({
    where: {
      status,
    },

    include: visitorInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
};

// ======================================================
// GET RECENT VISITORS
// ======================================================

export const getRecentVisitors = async (
  limit = 10,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findMany({
    include: visitorInclude,

    orderBy: {
      createdAt: "desc",
    },

    take: limit,
  });
};

// ======================================================
// UPDATE VISITOR
// ======================================================

export const updateVisitor = async (
  visitorId: string,
  data: Prisma.VisitorUpdateInput,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.update({
    where: {
      id: visitorId,
    },
    data,
    include: visitorInclude,
  });
};

// ======================================================
// UPDATE VISITOR STATUS
// ======================================================

export const updateVisitorStatus = async (
  visitorId: string,
  data: {
    status: VisitorStatus;
    checkIn?: Date;
    checkOut?: Date;
  },
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.update({
    where: {
      id: visitorId,
    },

    data: {
      status: data.status,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
    },

    include: visitorInclude,
  });
};

// ======================================================
// DELETE VISITOR
// ======================================================

export const deleteVisitor = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.delete({
    where: {
      id: visitorId,
    },
  });
};

// ======================================================
// RESTORE VISITOR (Optional Soft Delete Ready)
// ======================================================

export const restoreVisitor = async (
  visitorId: string,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.update({
    where: {
      id: visitorId,
    },

    data: {
      status: VisitorStatus.PENDING,
    },

    include: visitorInclude,
  });
};

// ======================================================
// COUNT VISITORS
// ======================================================

export const countVisitors = async (
  where: Prisma.VisitorWhereInput = {},
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.count({
    where,
  });
};

// ======================================================
// CHECK VISITOR OWNERSHIP
// ======================================================

export const isVisitorOwnedByHost = async (
  visitorId: string,
  hostId: string,
  tx?: Prisma.TransactionClient
): Promise<boolean> => {
  const db = getDb(tx);

  const visitor = await db.visitor.findFirst({
    where: {
      id: visitorId,
      hostId,
    },

    select: {
      id: true,
    },
  });

  return !!visitor;
};

// ======================================================
// DASHBOARD STATISTICS
// ======================================================

export const getVisitorStats = async (
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  const [
    total,
    pending,
    approved,
    rejected,
    checkedIn,
    checkedOut,
  ] = await Promise.all([
    db.visitor.count(),

    db.visitor.count({
      where: {
        status: VisitorStatus.PENDING,
      },
    }),

    db.visitor.count({
      where: {
        status: VisitorStatus.APPROVED,
      },
    }),

    db.visitor.count({
      where: {
        status: VisitorStatus.REJECTED,
      },
    }),

    db.visitor.count({
      where: {
        status: VisitorStatus.CHECKED_IN,
      },
    }),

    db.visitor.count({
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

// ======================================================
// MONTHLY VISITOR ANALYTICS
// ======================================================

export const getMonthlyVisitorStats = async (
  year: number,
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year + 1, 0, 1);

  const visitors = await db.visitor.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      createdAt: true,
    },
  });

  const monthlyStats = Array.from(
    { length: 12 },
    (_, index) => ({
      month: index + 1,
      total: 0,
    })
  );

  visitors.forEach((visitor) => {
    const month = visitor.createdAt.getMonth();
    monthlyStats[month].total++;
  });

  return monthlyStats;
};

// ======================================================
// LATEST VISITOR
// ======================================================

export const getLatestVisitor = async (
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.findFirst({
    include: visitorInclude,

    orderBy: {
      createdAt: "desc",
    },
  });
};

// ======================================================
// DELETE ALL VISITORS (ADMIN)
// ======================================================

export const deleteAllVisitors = async (
  tx?: Prisma.TransactionClient
) => {
  const db = getDb(tx);

  return db.visitor.deleteMany();
};

// ======================================================
// SEARCH VISITORS
// ======================================================

export const searchVisitors = async (
  keyword: string,
  tx?: Prisma.TransactionClient
) => {
  return getAllVisitors(
    {
      search: keyword,
      page: 1,
      limit: 100,
    },
    tx
  );
};

// ======================================================
// EXPORTS
// ======================================================

export default {
  createVisitor,
  getAllVisitors,
  getVisitorById,
  getVisitorByEmail,

  updateVisitor,
  updateVisitorStatus,

  deleteVisitor,
  restoreVisitor,

  visitorExists,
  isVisitorOwnedByHost,

  getVisitorsByHost,
  getVisitorsByStatus,
  getRecentVisitors,

  countVisitors,

  getVisitorStats,
  getMonthlyVisitorStats,

  getLatestVisitor,

  searchVisitors,

  deleteAllVisitors,
};