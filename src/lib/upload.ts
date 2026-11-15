"use server";

import { requireAuth } from "./auth-utils";
import { savePhotos } from "./media";

export async function uploadPhoto(formData: FormData) {
  await requireAuth();
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("未选择文件");
  return (await savePhotos([file], "photos"))[0];
}

export async function uploadReviewPhotos(files: File[]) {
  await requireAuth();
  return savePhotos(files, "reviews");
}
