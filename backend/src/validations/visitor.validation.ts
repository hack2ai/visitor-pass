import { z } from "zod";

export const createVisitorSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

  email: z
    .string()
    .email("Invalid email")
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15),

  company: z
    .string()
    .optional(),

  purpose: z
    .string()
    .min(3, "Purpose is required"),

  idProofType: z
    .string()
    .optional(),

  idProofNumber: z
    .string()
    .optional(),

  faceImage: z
    .string()
    .optional(),

  qrCode: z
    .string()
    .optional(),
});

export const updateVisitorSchema =
  createVisitorSchema.partial();

/**
 * Update Visitor Status
 */
export const updateVisitorStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "APPROVED",
    "REJECTED",
    "CHECKED_IN",
    "CHECKED_OUT",
  ]),
});