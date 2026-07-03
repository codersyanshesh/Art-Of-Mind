"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, Heart, Film, Wand2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardItem {
  title: string;
  count: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const cards: CardItem[] = [
  {
    title: "Fantasy",
    count: "4,520 Works",
    gradient: "from-purple-600/20 to-indigo-600/40",
    icon: Wand2,
    accentColor: "group-hover:text-purple-400",
  },
  {
    title: "Romance",
    count: "3,810 Works",
    gradient: "from-pink-600/20 to-rose-600/40",
    icon: Heart,
    accentColor: "group-hover:text-rose-400",
  },
  {
    title: "Action / Sci-Fi",
    count: "2,940 Works",
    gradient: "from-blue-600/20 to-cyan-600/40",
    icon: Sparkles,
    accentColor: "group-hover:text-cyan-400",
  },
  {
    title: "Drama & Series",
    count: "1,850 Works",
    gradient: "from-amber-600/20 to-orange-600/40",
    icon: Film,
    accentColor: "group-hover:text-amber-400",
  },
];

function TiltCard({ card }: { card: CardItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Motion values for tilt coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  // Map coordinate offsets to rotations (max 15 degrees tilt)
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate relative mouse offset from center (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const Icon = card.icon;

  return (
    <div
      style={{ perspective: 1000 }}
      className="w-full"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "w-full h-48 rounded-2xl p-6 glass-panel border border-white/5 relative group cursor-pointer overflow-hidden transition-all duration-300",
          hovered ? "border-white/20 shadow-2xl scale-[1.02]" : ""
        )}
      >
        {/* Glow effect on hover */}
        <div
          style={{ transform: "translateZ(30px)" }}
          className={cn(
            "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            card.gradient
          )}
        />

        {/* Content Container (elevated in 3D space) */}
        <div 
          style={{ transform: "translateZ(50px)" }}
          className="relative h-full flex flex-col justify-between z-10 pointer-events-none"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
              <Icon className={cn("w-6 h-6 text-slate-300 transition-colors", card.accentColor)} />
            </div>
            <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-300 transition-colors">
              {card.count}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-wide group-hover:text-glow-violet transition-all">
              {card.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Explore interconnected universes
            </p>
          </div>
        </div>

        {/* Subtle grid mesh background */}
        <div className="absolute inset-0 bg-space-mesh opacity-20 pointer-events-none" />
      </motion.div>
    </div>
  );
}

export default function FloatingCards3D() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4">
      {cards.map((card, idx) => (
        <TiltCard key={idx} card={card} />
      ))}
    </div>
  );
}
