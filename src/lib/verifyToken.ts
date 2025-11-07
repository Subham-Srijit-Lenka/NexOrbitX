import jwt, { JwtPayload } from "jsonwebtoken";
import { NextRequest } from "next/server";

interface DecodedUser extends JwtPayload {
  _id: string;
  email?: string;
  username?: string;
}

export const verifyToken = async (
  req: NextRequest
): Promise<{
  valid: boolean;
  decodedToken?: DecodedUser;
  message: string;
}> => {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return { valid: false, message: "No access token" };
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as DecodedUser;

    return { valid: true, decodedToken, message: "Success" };
  } catch (error) {
    return { valid: false, message: "Invalid or expired token" };
  }
};
