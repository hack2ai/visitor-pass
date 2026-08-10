import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const generateAccessToken = (payload: object) => {
  console.log("🚀 GENERATING ACCESS TOKEN");
  console.log("Expiry: 7d");

  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "7d",
  });
};

export const generateRefreshToken = (payload: object) => {
  console.log("🚀 GENERATING REFRESH TOKEN");

  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};