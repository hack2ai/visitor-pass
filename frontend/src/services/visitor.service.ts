import api from "../api/axios";

import {
  getVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  updateVisitorStatus,
  deleteVisitor,
  downloadVisitorPass,
} from "../api/visitor.api";

/**
 * ==========================================================
 * GET ALL USERS (Employees / Hosts)
 * ==========================================================
 */
export const getUsers = async () => {
  console.log("========== GET USERS ==========");

  const token = localStorage.getItem("accessToken");

  console.log("Access Token exists:", !!token);

  if (!token) {
    throw new Error("Access token is missing from localStorage.");
  }

  const response = await api.get("/users");

  console.log("GET /users response:", response.data);

  return response.data;
};

/**
 * ==========================================================
 * VISITOR API EXPORTS
 * ==========================================================
 */

export {
  getVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  updateVisitorStatus,
  deleteVisitor,
  downloadVisitorPass,
};