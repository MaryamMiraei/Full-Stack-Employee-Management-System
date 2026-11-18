import "server-only";

import path from "node:path";
import { mkdir, writeFile, readFile, unlink } from "node:fs/promises";

const storagePath = process.env.AVATAR_STORAGE_PATH;

if (!storagePath) {
  throw new Error("AVATAR_STORAGE_PATH is not configured.");
}

const avatarDirectory = path.resolve(process.cwd(), storagePath);

export const ensureAvatarDirectory = async () => {
  await mkdir(avatarDirectory, { recursive: true });
};

export const saveAvatarFile = async (fileName: string, buffer: Buffer) => {
  await ensureAvatarDirectory();

  const filePath = path.join(avatarDirectory, fileName);

  await writeFile(filePath, buffer, { flag: "wx" });

  return filePath;
};

export const getAvatarFile = async (fileName: string) => {
  const filePath = path.join(avatarDirectory, fileName);

  return readFile(filePath);
};

export const deleteAvatarFile = async (fileName: string) => {
  const filePath = path.join(avatarDirectory, fileName);

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
};
