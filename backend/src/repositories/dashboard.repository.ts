import { VisitorStatus } from "@prisma/client";
import prisma from "../config/prisma";

/**
 * ==========================================
 * Dashboard Summary
 * ==========================================
 */
export const getDashboardSummary = async () => {
  const [
    totalVisitors,
    pending,
    approved,
    rejected,
    checkedIn,
    checkedOut,
  ] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({
      where: { status: VisitorStatus.PENDING },
    }),
    prisma.visitor.count({
      where: { status: VisitorStatus.APPROVED },
    }),
    prisma.visitor.count({
      where: { status: VisitorStatus.REJECTED },
    }),
    prisma.visitor.count({
      where: { status: VisitorStatus.CHECKED_IN },
    }),
    prisma.visitor.count({
      where: { status: VisitorStatus.CHECKED_OUT },
    }),
  ]);

  return {
    totalVisitors,
    pending,
    approved,
    rejected,
    checkedIn,
    checkedOut,
  };
};

/**
 * ==========================================
 * Recent Visitors
 * ==========================================
 */
export const getRecentVisitors = async (
  limit = 5
) => {
  return prisma.visitor.findMany({
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      host: {
        select: {
          name: true,
        },
      },
    },
  });
};

/**
 * ==========================================
 * Recent Activities
 * ==========================================
 */
export const getRecentActivities = async (
  limit = 8
) => {
  return prisma.visitor.findMany({
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      status: true,
      updatedAt: true,
    },
  });
};

/**
 * ==========================================
 * Weekly Analytics
 * ==========================================
 */
export const getWeeklyAnalytics = async () => {
  const visitors = await prisma.visitor.findMany({
    select: {
      createdAt: true,
    },
  });

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const analytics = days.map((day) => ({
    day,
    visitors: 0,
  }));

  visitors.forEach((visitor) => {
    const index = visitor.createdAt.getDay();
    analytics[index].visitors += 1;
  });

  return analytics;
};