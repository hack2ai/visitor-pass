import { Request, Response } from "express";
import * as service from "../services/auth.service";
import { success, error } from "../utils/response";

export const register = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await service.register(
      name,
      email,
      password,
      role
    );

    return success(
      res,
      user,
      "User registered successfully"
    );
  } catch (err: any) {
    return error(res, err.message);
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const data = await service.login(email, password);

    return success(
      res,
      data,
      "Login successful"
    );
  } catch (err: any) {
    return error(res, err.message, 401);
  }
};