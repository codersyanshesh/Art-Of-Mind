import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Setting up Supabase Realtime replication on public tables...");

  try {
    // 1. Create supabase_realtime publication if it doesn't exist (safety check)
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
          CREATE PUBLICATION supabase_realtime;
        END IF;
      END $$;
    `);

    // 2. Add Comment and Notification tables to the publication
    // We run them separately to handle tables that might already be added
    try {
      await prisma.$executeRawUnsafe(`
        ALTER PUBLICATION supabase_realtime ADD TABLE "Comment";
      `);
      console.log("✅ Comment table added to supabase_realtime publication.");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("ℹ️ Comment table is already in publication.");
      } else {
        throw e;
      }
    }

    try {
      await prisma.$executeRawUnsafe(`
        ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";
      `);
      console.log("✅ Notification table added to supabase_realtime publication.");
    } catch (e: any) {
      if (e.message?.includes("already exists")) {
        console.log("ℹ️ Notification table is already in publication.");
      } else {
        throw e;
      }
    }

    console.log("🎉 Realtime database replication setup completed successfully!");
  } catch (error) {
    console.error("❌ Failed to set up realtime replication:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
