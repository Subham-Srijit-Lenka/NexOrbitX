import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Posts";
import { verifyToken } from "@/lib/verifyToken";

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();

    const { valid, decodedToken } = await verifyToken(req as any);
    if (!valid || !decodedToken?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.postId;
    const userObjectId = new mongoose.Types.ObjectId(decodedToken._id);
    const userIdStr = userObjectId.toString();

    const post = await PostModel.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const isLiked = post.likes.some((id) => id.toString() === userIdStr);

    let updatedPost;

    if (isLiked) {
      updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $pull: { likes: userObjectId } },
        { new: true }
      );
    } else {
      updatedPost = await PostModel.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userObjectId } },
        { new: true }
      );
    }

    return NextResponse.json(
      {
        message: isLiked ? "Unliked" : "Liked",
        likes: updatedPost?.likes.length ?? 0,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("LIKE error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
