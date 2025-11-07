import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedUser extends JwtPayload {
  _id: string;
}

export async function verifyToken(req: Request): Promise<{
  valid: boolean;
  decodedToken?: DecodedUser;
  message?: string;
}> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { valid: false, message: "No token provided" };
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedUser;

    return { valid: true, decodedToken: decoded };
  } catch (err) {
    return { valid: false, message: "Invalid token" };
  }
}
