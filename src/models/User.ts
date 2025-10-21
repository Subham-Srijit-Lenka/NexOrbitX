import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  avatar?: string;
  bio?: string;
  gender?: string;
  phone?: string;
  dateOfBirth?: Date;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<User>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: "https://api.dicebear.com/7.x/initials/svg?seed=user",
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    phone: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
