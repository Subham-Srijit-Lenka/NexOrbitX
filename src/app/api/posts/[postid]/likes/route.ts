import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Posts";
import { verifyToken } from "@/lib/verifyToken";
import cloudinary from "@/lib/cloudinary";
import { tryLoadManifestWithRetries } from "next/dist/server/load-components";

export async function PUT(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();
    const { valid, decodedToken } = await verifyToken(req as any);

    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.postId;
    const post = await PostModel.findById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = decodedToken?._id;

    if (post.likes.includes(userId as any)) {
      post.likes.pull(userId as any);
    } else {
      post.likes.push(userId as any);
    }
    await post.save();

    return NextResponse.json(
      { message: "Like updated", likes: post.likes.length },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
