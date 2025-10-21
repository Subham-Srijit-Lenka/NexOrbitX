import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
});
