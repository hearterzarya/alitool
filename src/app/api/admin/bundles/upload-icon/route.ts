import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "bundle-icons";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    let fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || fileExtension.length > 5) {
      fileExtension = MIME_TO_EXT[file.type] || "png";
    }
    const baseFileName = `bundle-icon-${timestamp}-${randomString}.${fileExtension}`;

    // Prefer Vercel Blob if token is set
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`${UPLOAD_DIR}/${baseFileName}`, file, {
          access: "public",
          contentType: file.type,
        });
        return NextResponse.json({ url: blob.url }, { status: 200 });
      } catch (uploadError: any) {
        console.error("Error uploading bundle icon to Blob:", uploadError);
        return NextResponse.json(
          { error: uploadError.message || "Upload failed" },
          { status: 500 }
        );
      }
    }

    // Fallback: save to public/bundle-icons/ (local or when Blob not configured)
    const publicDir = path.join(process.cwd(), "public", UPLOAD_DIR);
    await mkdir(publicDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(publicDir, baseFileName);
    await writeFile(filePath, buffer);
    const url = `/${UPLOAD_DIR}/${baseFileName}`;
    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading bundle icon:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to upload icon" },
      { status: 500 }
    );
  }
}
