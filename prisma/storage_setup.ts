import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Syncing Supabase storage buckets...");

  try {
    // Create the covers and media buckets if they do not exist
    await prisma.$executeRawUnsafe(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES 
        ('covers', 'covers', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
        ('media', 'media', true, 52428800, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/mp3', 'video/mp4'])
      ON CONFLICT (id) DO NOTHING;
    `);
    console.log("✅ Storage buckets ('covers' & 'media') successfully verified and synced on Supabase!");
  } catch (error) {
    console.error("❌ Failed to verify storage buckets:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
