import "dotenv/config";
import { PrismaClient, Role, StoryType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("Cleaning database...");
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE "User", "Profile", "Wallet", "Preferences", "Universe", "Story", "Chapter", "MediaAsset", "Character", "Comment", "ReadingProgress", "Notification", "Transaction" CASCADE;`);

  console.log("Seeding Users & Profiles...");
  
  // 1. Creator Users
  const nexus = await prisma.user.create({
    data: {
      supabaseId: "sup_nexus_123",
      email: "nexus@artofmind.com",
      role: Role.CREATOR,
      profile: {
        create: {
          displayName: "Nexus Prime",
          avatarUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150",
          bio: "Weaving interactive multi-format sci-fi epics. Author of the Crimson Kingdom Universe.",
        }
      },
      wallet: {
        create: {
          balance: 1420.50,
          payoutMethod: "Stripe",
        }
      },
      preferences: {
        create: {
          fontSize: "Medium",
          readingBg: "Dark",
        }
      }
    }
  });

  const elara = await prisma.user.create({
    data: {
      supabaseId: "sup_elara_123",
      email: "elara@artofmind.com",
      role: Role.CREATOR,
      profile: {
        create: {
          displayName: "Elara Vane",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          bio: "Fantasy illustrator and screen writer. Exploring dark magic, romance, and visual novels.",
        }
      },
      wallet: {
        create: {
          balance: 890.00,
          payoutMethod: "PayPal",
        }
      },
      preferences: {
        create: {
          fontSize: "Large",
          readingBg: "Sepia",
        }
      }
    }
  });

  const kai = await prisma.user.create({
    data: {
      supabaseId: "sup_kai_123",
      email: "kai@artofmind.com",
      role: Role.CREATOR,
      profile: {
        create: {
          displayName: "Kai Zen",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          bio: "Director & editor. Specialized in fast-paced short vertical dramas and high-impact thrillers.",
        }
      },
      wallet: {
        create: {
          balance: 310.25,
          payoutMethod: "Bank Transfer",
        }
      },
      preferences: {
        create: {
          fontSize: "Medium",
          readingBg: "AMOLED",
        }
      }
    }
  });

  // 2. Reader User (Active user simulation)
  const reader = await prisma.user.create({
    data: {
      supabaseId: "sup_reader_active",
      email: "sayson.hular@gmail.com",
      role: Role.READER,
      profile: {
        create: {
          displayName: "Active Reader",
          avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          bio: "Avid reader, visual drama lover, and digital collector.",
        }
      },
      wallet: {
        create: {
          balance: 25.00,
        }
      },
      preferences: {
        create: {
          fontSize: "Medium",
          readingBg: "Dark",
        }
      }
    }
  });

  console.log("Seeding Universes...");
  const universe = await prisma.universe.create({
    data: {
      name: "The Crimson Kingdom Universe",
      description: "An interconnected medieval dark fantasy franchise spanning novels, comics, short films, and vertical dramas. Discover a world where dragons, blood magic, and political betrayal collide.",
    }
  });

  console.log("Seeding Stories...");
  
  // Story 1: Novel
  const story1 = await prisma.story.create({
    data: {
      title: "The Crimson Throne",
      type: StoryType.NOVEL,
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
      description: "In a kingdom dyed by the blood of dragons, a peasant girl discovers she is the rightful heir to the Crimson Throne. To survive, she must play the deadly games of courtly intrigue.",
      rating: 4.9,
      isPublished: true,
      publishedAt: new Date("2026-05-12"),
      universeId: universe.id,
      creatorId: nexus.id,
      chapters: {
        create: [
          { index: 1, title: "Chapter 1: The Ash Pits", content: "Elara wiped the volcanic soot from her brow. Below the rim, the molten rivers of the Citadel glowed like liquid dragon blood." },
          { index: 2, title: "Chapter 2: Dragon Fire", content: "The beast roared, its shadow blocking out the twin moons. Elara raised her hand, her blood pulsing with ancient fire." }
        ]
      }
    }
  });

  // Story 2: Vertical Series
  const story2 = await prisma.story.create({
    data: {
      title: "Shadows of the Crimson Crown",
      type: StoryType.REEL,
      coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
      description: "The live-action vertical drama spin-off. Follow the secret guards who defend the Crimson Throne from the shadows.",
      rating: 4.8,
      isPublished: true,
      publishedAt: new Date("2026-06-01"),
      universeId: universe.id,
      creatorId: nexus.id,
      mediaAssets: {
        create: [
          { type: "Video Reel", assetUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4", duration: 15.4 }
        ]
      }
    }
  });

  // Story 3: Comic
  const story3 = await prisma.story.create({
    data: {
      title: "Crimson Kingdom: Origins",
      type: StoryType.COMIC,
      coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
      description: "Visual comic focusing on the legendary dragon wars that formed the boundaries of the Crimson Kingdom 500 years ago.",
      rating: 4.7,
      isPublished: true,
      publishedAt: new Date("2026-04-18"),
      universeId: universe.id,
      creatorId: elara.id,
    }
  });

  // Story 4: Audio Book (independent)
  const story4 = await prisma.story.create({
    data: {
      title: "Neo-Tokyo Noir: Neon Echoes",
      type: StoryType.AUDIO,
      coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop",
      description: "A binaural 3D audio mystery. Cybernetic detective Silas Vance hunts a virus that hacks human memories in the rain-slicked streets of Neo-Tokyo.",
      rating: 4.6,
      isPublished: true,
      publishedAt: new Date("2026-06-15"),
      universeId: universe.id,
      creatorId: kai.id,
      mediaAssets: {
        create: [
          { type: "Audio Chapter", assetUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", duration: 340.5 }
        ]
      }
    }
  });

  console.log("Seeding Characters...");
  await prisma.character.createMany({
    data: [
      {
        name: "Elara of Ash",
        role: "Main Protagonist (The Crimson Throne)",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        description: "A peasant girl raised in the ash pits, unaware that the blood of the dragon lords runs pure in her veins.",
        universeId: universe.id,
      },
      {
        name: "Commander Valen",
        role: "Anti-Hero (Shadows of the Crimson Crown)",
        avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        description: "Leader of the Shadow Guard, sworn to protect the crown but secretly harboring a debt to the rebels.",
        universeId: universe.id,
      },
      {
        name: "Lydia the Witch",
        role: "Supporting (Origins Comic)",
        avatarUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
        description: "The last blood alchemist who forged the three magic crown gems during the rebellion.",
        universeId: universe.id,
      }
    ]
  });

  console.log("Seeding Comments & Forums...");
  const comment1 = await prisma.comment.create({
    data: {
      storyId: story1.id,
      userId: reader.id,
      text: "The first two chapters of The Crimson Throne novel have me completely hooked! The detail about calcified dragon lungs is fascinating.",
      likes: 5,
      hearts: 2,
    }
  });

  await prisma.comment.create({
    data: {
      storyId: story1.id,
      userId: elara.id,
      text: "Thank you for reading! Wait until Chapter 5, the stakes get much higher.",
      parentCommentId: comment1.id,
    }
  });

  console.log("Seeding Reading Progress...");
  await prisma.readingProgress.create({
    data: {
      userId: reader.id,
      storyId: story1.id,
      chapterIndex: 1,
      percent: 65,
    }
  });

  console.log("Seeding Notifications...");
  await prisma.notification.createMany({
    data: [
      {
        userId: reader.id,
        type: "update",
        message: "Luna Ashveil published a new chapter for Crimson Throne!",
        read: false,
      },
      {
        userId: reader.id,
        type: "milestone",
        message: "You earned the 'Dragon Scholar' badge!",
        read: true,
      }
    ]
  });

  console.log("Seeding Transactions...");
  await prisma.transaction.createMany({
    data: [
      {
        userId: reader.id,
        storyId: story1.id,
        amount: -5.0,
        type: "Chapter Purchase",
      },
      {
        userId: reader.id,
        storyId: story2.id,
        amount: -2.0,
        type: "Reel Unlock",
      }
    ]
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seeding failed: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
