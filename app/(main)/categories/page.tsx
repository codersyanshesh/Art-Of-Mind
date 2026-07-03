import React from "react";
import Link from "next/link";
import { Hash } from "lucide-react";

// Static content — no mock-data dependency, no "use client" needed
const allCategories = [
  { name: "Romance ❤️", desc: "Heartfelt stories and emotional relationship dynamics.", slug: "Romance" },
  { name: "Fantasy 🔮", desc: "Mystical worlds, dragons, sorcerers, and magical realms.", slug: "Fantasy" },
  { name: "Action ⚔️", desc: "High-paced combats, dangerous quests, and battlefield epics.", slug: "Action" },
  { name: "Horror 💀", desc: "Chilling mysteries, psychological terrors, and supernatural scares.", slug: "Horror" },
  { name: "Comedy 🎭", desc: "Hilarious incidents, witty remarks, and feel-good stories.", slug: "Comedy" },
  { name: "Sci-Fi 🚀", desc: "Cyberpunk cities, galactic explorations, and cybernetic detectives.", slug: "Sci-Fi" },
  { name: "Crime 🕵️", desc: "Detective novels and suspenseful mystery investigations.", slug: "Crime" },
  { name: "Slice of Life 🏡", desc: "Everyday human struggles and touching personal growth journeys.", slug: "Slice of Life" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6 pb-16">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <Hash className="w-7 h-7 text-electric-violet" />
          Content Categories
        </h1>
        <p className="text-xs text-slate-400">
          Filter works and universes based on your preferred genre or theme.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/home?category=${encodeURIComponent(cat.slug)}`}
            className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-electric-violet/30 hover:bg-slate-900/40 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] transition-all cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <h3 className="font-bold text-lg text-white">{cat.name}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{cat.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
