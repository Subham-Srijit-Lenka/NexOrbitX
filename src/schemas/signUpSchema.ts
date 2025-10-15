import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(4, "username must be atleast 4 character")
  .max(12, "username must be atmost 12 character")
  .regex(/^[a-z0-9_]+$/, "lowercase character with _ and number are allowed");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password must be atleast 6 character" }),
});
