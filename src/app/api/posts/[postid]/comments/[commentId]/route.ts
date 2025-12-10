import CommentModel from "@/models/Comment";
import PostModel from "@/models/Posts";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    await dbConnect();
    const { postId, commentId } = params;
    const { valid, decodedToken } = await verifyToken(req as any);
    if (!valid || !decodedToken?._id) {
      return NextResponse.json({ error: "unauthorised" }, { status: 401 });
    }
    const userId = decodedToken._id;

    const post = await PostModel.findById(postId);
    if (!post) return NextResponse.json({ error: "Post not found" });

    const comment = await CommentModel.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    if (comment.post.toString() !== postId) {
      return NextResponse.json(
        { success: false, message: "Comment does not belong to this post" },
        { status: 400 }
      );
    }

    if (comment.user.toString() !== userId) {
      return NextResponse.json(
        { success: false, Message: "comment does not belong to user" },
        { status: 400 }
      );
    }

    await CommentModel.findByIdAndDelete(commentId);
    await PostModel.findByIdAndUpdate(postId, {
      $pull: { comments: commentId },
    });

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
