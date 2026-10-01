import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { MEDIA_ROOT } from "@/lib/media/storage";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { path: segments } = await params;

  const filePath = path.join(MEDIA_ROOT, ...segments);

  const relativePath = path.relative(MEDIA_ROOT, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return new NextResponse("Invalid path", {
      status: 400,
    });
  }

  try {
    const file = await fs.readFile(filePath);

    const extension = path.extname(filePath).toLowerCase();

    const contentType = CONTENT_TYPES[extension] ?? "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return new NextResponse("Not found", {
        status: 404,
      });
    }

    console.error("Failed to read media file:", error);

    return new NextResponse("Internal server error", {
      status: 500,
    });
  }
}
