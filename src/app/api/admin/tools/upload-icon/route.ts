import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir, access } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { constants } from "fs";

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

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "tool-icons");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Verify directory is writable
    try {
      await access(uploadsDir, constants.W_OK);
    } catch (accessError) {
      console.error("Directory not writable:", accessError);
      return NextResponse.json(
        { error: "Upload directory is not writable. Please check permissions." },
        { status: 500 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    
    // Get file extension from filename or MIME type
    let fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || fileExtension.length > 5) {
      // Fallback to extension from MIME type
      const mimeToExt: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/jpg": "jpg",
        "image/png": "png",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
      };
      fileExtension = mimeToExt[file.type] || "png";
    }
    
    const fileName = `tool-icon-${timestamp}-${randomString}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer and save
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      
      // Verify file was written successfully
      if (!existsSync(filePath)) {
        throw new Error("File was not created after write operation");
      }
    } catch (writeError: any) {
      console.error("Error writing file:", writeError);
      return NextResponse.json(
        { error: `Failed to save file: ${writeError.message || "Permission denied or disk full"}` },
        { status: 500 }
      );
    }

    // Return the public URL
    const publicUrl = `/tool-icons/${fileName}`;

    return NextResponse.json({ url: publicUrl }, { status: 200 });
  } catch (error: any) {
    console.error("Error uploading icon:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to upload icon";
    if (error.message) {
      errorMessage = error.message;
    } else if (error.code === "ENOENT") {
      errorMessage = "Upload directory not found";
    } else if (error.code === "EACCES") {
      errorMessage = "Permission denied: Cannot write to upload directory";
    } else if (error.code === "ENOSPC") {
      errorMessage = "No space left on device";
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
