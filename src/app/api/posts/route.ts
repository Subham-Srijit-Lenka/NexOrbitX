import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import PostModel from "@/models/Posts";
import { verifyToken } from "@/lib/verifyToken";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { valid, decodedToken, message } = await verifyToken(req as any);

    if (!valid) {
      return NextResponse.json({ error: "user not found" }, { status: 401 });
    }

    const { images, caption } = await req.json();
    if (!images || images.length === 0) {
      return NextResponse.json({ error: "iamge not found" }, { status: 401 });
    }

    const uploadPromises = images.map((img: string) =>
      cloudinary.uploader.upload(img, {
        folder: "nexorbitx_posts",
        resource_type: "image",
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const newPost = await PostModel.create({
      user: decodedToken?._id,
      images: imageUrls,
      caption,
    });

    return NextResponse.json(
      { message: "Post created successfully", post: newPost },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post creation error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { valid, decodedToken } = await verifyToken(req as any);
    if (!valid) {
      return NextResponse.json({ error: "user not found" }, { status: 401 });
    }

    const userPosts = await PostModel.find({ user: decodedToken?._id })
      .sort({ createdAt: -1 })
      .populate("user", "username avatar");
    return NextResponse.json({ posts: userPosts }, { status: 200 });
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: "cannot get posts" }, { status: 500 });
  }
}
