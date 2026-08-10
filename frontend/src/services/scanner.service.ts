import api from "./api";

import type { Visitor } from "../types/visitor";

export interface ScannerResponse {
  success: boolean;
  message: string;
  data: Visitor;
}

export interface StatusResponse {
  success: boolean;
  message: string;
  data: Visitor;
}

/**
 * ==========================================================
 * GET VISITOR BY QR ID
 * ==========================================================
 */

export const scanVisitor = async (
  visitorId: string
): Promise<ScannerResponse> => {
  const { data } = await api.get(
    `/visitors/${visitorId}`
  );

  return data;
};

/**
 * ==========================================================
 * CHECK IN
 * ==========================================================
 */

export const checkInVisitor = async (
  visitorId: string
): Promise<StatusResponse> => {
  const { data } = await api.patch(
    `/visitors/${visitorId}/status`,
    {
      status: "CHECKED_IN",
    }
  );

  return data;
};

/**
 * ==========================================================
 * CHECK OUT
 * ==========================================================
 */

export const checkOutVisitor = async (
  visitorId: string
): Promise<StatusResponse> => {
  const { data } = await api.patch(
    `/visitors/${visitorId}/status`,
    {
      status: "CHECKED_OUT",
    }
  );

  return data;
};