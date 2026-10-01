import fs from "node:fs/promises";
import path from "node:path";

import { getProjectMediaDirectory } from "./storage";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function validateImage(file: File, label: string) {
  if (!file.type || !ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error(`${label} must be a JPEG, PNG, or WebP image.`);
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`${label} must be 10MB or smaller.`);
  }
}

function getExtension(type: string) {
  switch (type) {
    case "image/jpeg":
      return ".jpg";

    case "image/png":
      return ".png";

    case "image/webp":
      return ".webp";

    default:
      throw new Error("Unsupported image type.");
  }
}

async function saveImage(
  file: File,
  directory: string,
  urlPrefix: string,
  label: string,
) {
  validateImage(file, label);

  await fs.mkdir(directory, {
    recursive: true,
  });

  const extension = getExtension(file.type);
  const filename = `${crypto.randomUUID()}${extension}`;
  const filePath = path.join(directory, filename);

  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  return {
    filename,
    url: `${urlPrefix}/${filename}`,
  };
}

async function deleteImage(
  imageUrl: string,
  urlPrefix: string,
  directory: string,
  label: string,
) {
  if (!imageUrl.startsWith(`${urlPrefix}/`)) {
    throw new Error(`Invalid ${label} image path.`);
  }

  const filename = path.basename(imageUrl);
  const filePath = path.join(directory, filename);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code !== "ENOENT") {
      throw error;
    }
  }
}

export async function saveProjectImage(file: File) {
  return saveImage(
    file,
    getProjectMediaDirectory(),
    "/media/projects",
    "Project image",
  );
}

export async function deleteProjectImage(imageUrl: string) {
  return deleteImage(
    imageUrl,
    "/media/projects",
    getProjectMediaDirectory(),
    "project",
  );
}
