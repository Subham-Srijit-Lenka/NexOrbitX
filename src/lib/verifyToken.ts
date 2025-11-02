import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const verifyToken = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return { valid: false, message: "no accesstoken" };
    }

    const decodedToken = await jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    return { valid: true, decodedToken };
  } catch (error) {
    return { valid: false, message: "invalid token or expired" };
  }
};
