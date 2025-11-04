import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Posts";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req: Request) {
  const { valid, decodedToken, message } = verifyToken(req as any);

  if (!valid) {
    return NextResponse.json({ error: "user not found" }, { status: 401 });
  }

  const { images, caption } = req.json();
  if (!images) {
    return NextResponse.json({ error: "iamge not found" }, { status: 401 });
  }

  const newPost = await PostModel.create({
    user: decodedToken._id,
    images,
    caption,
  });

  return NextResponse.json(
    { message: "Post created successfully", post: newPost },
    { status: 201 }
  );
}
