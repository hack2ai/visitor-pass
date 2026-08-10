import { Request, Response } from "express";
import * as userService from "../services/user.service";

/**
 * ==========================================================
 * GET ALL USERS
 * ==========================================================
 */
export const getUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await userService.getUsers();

    res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    console.error("=================================");
    console.error("GET USERS ERROR");
    console.error(error);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : "Unknown Error"
          : undefined,
    });
  }
};