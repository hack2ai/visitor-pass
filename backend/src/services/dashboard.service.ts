import { VisitorStatus } from "@prisma/client";
import prisma from "../config/prisma";

/**
 * ==========================================================
 * DASHBOARD STATS
 * ==========================================================
 */
export const getDashboardStats = async () => {
  const [
    totalVisitors,
    checkedIn,
    checkedOut,
    pending,
    approved,
    rejected,
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
  ]);

  return {
    totalVisitors,
    checkedIn,
    checkedOut,
    pending,
    approved,
    rejected,
  };
};

/**
 * ==========================================================
 * WEEKLY VISITOR ANALYTICS
 * Last 7 Days
 * ==========================================================
 */
export const getWeeklyVisitors = async () => {
  const today = new Date();

  const data: {
    day: string;
    visitors: number;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const start = new Date(today);

    start.setDate(today.getDate() - i);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setHours(23, 59, 59, 999);

    const count = await prisma.visitor.count({
      where: {
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    data.push({
      day: start.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      visitors: count,
    });
  }

  return data;
};

/**
 * ==========================================================
 * STATUS CHART
 * ==========================================================
 */
export const getStatusChart = async () => {
  const [
    pending,
    approved,
    checkedIn,
    checkedOut,
    rejected,
  ] = await Promise.all([
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
        status: VisitorStatus.REJECTED,
      },
    }),
  ]);

  return [
    {
      name: "Pending",
      value: pending,
    },
    {
      name: "Approved",
      value: approved,
    },
    {
      name: "Checked In",
      value: checkedIn,
    },
    {
      name: "Checked Out",
      value: checkedOut,
    },
    {
      name: "Rejected",
      value: rejected,
    },
  ];
};

/**
 * ==========================================================
 * RECENT VISITORS
 * ==========================================================
 */
export const getRecentVisitors = async () => {
  return prisma.visitor.findMany({
    take: 5,

    orderBy: {
      createdAt: "desc",
    },

   include: {
    host: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },
  });
};

/**
 * ==========================================================
 * ACTIVITY TIMELINE
 * ==========================================================
 */
export const getActivityTimeline = async () => {
  const visitors = await prisma.visitor.findMany({
    take: 10,

    orderBy: {
      updatedAt: "desc",
    },

    include: {
    host: {
      select: {
        name: true,
      },
    },
  },
  });

  return visitors.map((visitor) => ({
    id: visitor.id,

    title: visitor.status
      .replaceAll("_", " ")
      .toUpperCase(),

    description: `${visitor.fullName} visited ${visitor.company || "N/A"}`,

    hostName: visitor.host.name,

    status: visitor.status,

    createdAt: visitor.createdAt,

    updatedAt: visitor.updatedAt,
  }));
};

/**
 * ==========================================================
 * DASHBOARD ANALYTICS
 * ==========================================================
 */
export const getDashboardAnalytics = async () => {
  const [
    stats,
    weeklyVisitors,
    statusChart,
    recentVisitors,
    activityTimeline,
  ] = await Promise.all([
    getDashboardStats(),
    getWeeklyVisitors(),
    getStatusChart(),
    getRecentVisitors(),
    getActivityTimeline(),
  ]);

  return {
    stats,
    weeklyVisitors,
    statusChart,
    recentVisitors,
    activityTimeline,
  };
};