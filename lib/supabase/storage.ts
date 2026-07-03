import { createClient } from "./client";

/**
 * Uploads a story cover image to the public 'covers' bucket.
 * 
 * @param path The destination path inside the covers bucket (e.g. "stories/my-cover.webp")
 * @param file The file to upload
 */
export async function uploadCoverImage(path: string, file: File): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("covers").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Cover upload failed: ${error.message}`);
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage.from("covers").getPublicUrl(data.path);
  return publicUrl;
}

/**
 * Uploads a media asset (audiobooks, vertical series reels, comic pages) to the public 'media' bucket.
 * 
 * @param path The destination path inside the media bucket (e.g. "audiobooks/episode-1.mp3")
 * @param file The file to upload
 */
export async function uploadMediaAsset(path: string, file: File): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(`Media asset upload failed: ${error.message}`);
  }

  // Retrieve public URL
  const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(data.path);
  return publicUrl;
}
