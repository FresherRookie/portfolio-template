// src/lib/media/storage.ts

import path from "node:path";

export const MEDIA_ROOT =
  process.env.MEDIA_ROOT ?? path.join(process.cwd(), "media");

export function getProjectMediaDirectory() {
  return path.join(MEDIA_ROOT, "projects");
}
