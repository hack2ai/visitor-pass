export type VisitorStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export interface Visitor {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;

  hostName: string;

  status: VisitorStatus;

  createdAt: string;

  checkIn?: string;

  checkOut?: string;

  idProofType?: string;

  idProofNumber?: string;

  faceImage?: string;

  qrCode?: string;
}

export interface CreateVisitorDto {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
}

/**
 * Used for Approve / Reject / Check-In / Check-Out
 */
export interface UpdateVisitorStatusDto {
  status: VisitorStatus;
}