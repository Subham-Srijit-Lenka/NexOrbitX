import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "Username must be at least 4 characters")
  .max(12, "Username must be at most 12 characters")
  .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and _ allowed");

export const signUpSchema = z.object({
  username: usernameValidation,
  name: z.string().min(4, "Full name must be at least 2 characters"),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 6 characters" }),
});
