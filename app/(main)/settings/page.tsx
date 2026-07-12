import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/settings/SettingsClient";
import { redirect } from "next/navigation";

/**
 * Server Component wrapper.
 * Fetches the user's saved profile and preferences from the database,
 * then hydrates the client settings form with real initial values.
 */
export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      profile: true,
      preferences: true,
    },
  });

  // Pass DB values as props; the client component uses them as controlled initial state
  return (
    <SettingsClient
      initialName={dbUser?.profile?.displayName ?? ""}
      initialBio={dbUser?.profile?.bio ?? ""}
      initialAvatarUrl={dbUser?.profile?.avatarUrl ?? ""}
      initialCoverUrl={dbUser?.profile?.coverUrl ?? ""}
      initialFontSize={dbUser?.preferences?.fontSize ?? "Medium"}
      initialDyslexiaFont={dbUser?.preferences?.dyslexiaFont ?? false}
      initialReadingBg={dbUser?.preferences?.readingBg ?? "Dark"}
      initialColorblindMode={dbUser?.preferences?.colorblindMode ?? false}
    />
  );
}
