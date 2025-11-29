import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Posts";
import { verifyToken } from "@/lib/verifyToken";
import cloudinary from "@/lib/cloudinary";
import { tryLoadManifestWithRetries } from "next/dist/server/load-components";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    await dbConnect();

    const { valid, decodedToken } = await verifyToken(req as any);
    if (!valid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await PostModel.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.user.toString() !== decodedToken?._id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const deleteCloudImage = (url: string) => {
      const publicId = url.split("/").pop()?.split(".")[0];
      return cloudinary.uploader.destroy("nexorbitx_posts/" + publicId);
    };

    await Promise.all(post.images.map(deleteCloudImage));

    await PostModel.findByIdAndDelete(params.postId);

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}

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

    const post = await PostModel.findById(params.postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 401 });
    }

    if (post.user.toString() !== decodedToken?._id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(
      { message: "Post updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "failed to update post" },
      { status: 500 }
    );
  }
}
