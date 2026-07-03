import React from "react";
import { prisma } from "@/lib/prisma";
import FanClubsClient from "@/components/fan-clubs/FanClubsClient";

// Server Component — fetches the first CREATOR user with a Profile from the DB
export default async function FanClubsPage() {
  const creator = await prisma.user.findFirst({
    where: { role: "CREATOR" },
    include: { profile: true },
    orderBy: { createdAt: "asc" },
  });

  const creatorData = creator?.profile
    ? {
        name: creator.profile.displayName,
        avatar: creator.profile.avatarUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(creator.profile.displayName)}&background=7c3aed&color=fff&size=128`,
        bio: creator.profile.bio ?? "Award-winning creator of the Crimson Throne universe.",
      }
    : {
        name: "C.R. Nexus",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128",
        bio: "Award-winning creator of the Crimson Throne universe.",
      };

  return <FanClubsClient creator={creatorData} />;
}
