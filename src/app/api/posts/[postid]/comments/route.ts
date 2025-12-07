import CommentModel from "@/models/Comment";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";
import PostModel from "@/models/Posts";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();

    const { valid, decodedToken } = await verifyToken(req as any);
    if (!valid || !decodedToken?._id) {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }
    const postId = params.postId;
    const userObjectId = new mongoose.Types.ObjectId(decodedToken?._id);
    const userIdStr = userObjectId.toString();

    const post = await PostModel.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { success: false, message: "Comment text is required" },
        { status: 400 }
      );
    }
    const comment = await CommentModel.create({
      post: postId,
      user: userObjectId,
      text,
    });

    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    return NextResponse.json({ success: true, comment });
  } catch (error) {
    console.error("comment error", error);
    return NextResponse.json(
      { error: "something went wrong in comment" },
      { status: 500 }
    );
  }
}

export async function GET(_: any, { params }: any) {
  const { postId } = params;

  const comments = await CommentModel.find({ post: postId })
    .populate("user", "username profilePic")
    .sort({ createdAt: -1 });

  return NextResponse.json({ success: true, comments });
}
