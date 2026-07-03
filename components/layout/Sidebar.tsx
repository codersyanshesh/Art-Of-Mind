"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Compass, BookOpen, Film, Flame, Hash, Trophy, 
  History, Bookmark, Library, Settings, Users, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Home", href: "/home", icon: Home },
    { label: "Discover", href: "/discover", icon: Compass },
    { label: "Universes", href: "/universe/u_crimson_kingdom", icon: Sparkles },
    { label: "Trending", href: "/trending", icon: Flame },
    { label: "Categories", href: "/categories", icon: Hash },
  ];

  const libraryItems = [
    { label: "Viewing History", href: "/history", icon: History },
    { label: "Bookmarked", href: "/bookmarks", icon: Bookmark },
    { label: "My Collections", href: "/collections", icon: Library },
  ];

  const communityItems = [
    { label: "Fan Clubs", href: "/fan-clubs", icon: Users },
    { label: "Achievements", href: "/achievements", icon: Trophy },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 pt-20 border-r border-white/5 transition-transform duration-300 ease-in-out lg:translate-x-0 bg-cosmic-bg/90 backdrop-blur-md lg:bg-cosmic-bg/40",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col justify-between pb-6 overflow-y-auto px-4">
          <div className="space-y-6">
            {/* Main Menu */}
            <div>
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Explore</p>
              <ul className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                          isActive 
                            ? "bg-electric-violet/15 text-white border-l-2 border-electric-violet text-glow-violet" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", isActive ? "text-electric-violet" : "text-slate-500")} />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Library Menu */}
            <div>
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Library</p>
              <ul className="space-y-1">
                {libraryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                          isActive 
                            ? "bg-electric-violet/15 text-white border-l-2 border-electric-violet" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4 text-slate-500" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Community Menu */}
            <div>
              <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Community</p>
              <ul className="space-y-1">
                {communityItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300",
                          isActive 
                            ? "bg-electric-violet/15 text-white border-l-2 border-electric-violet" 
                            : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        )}
                      >
                        <Icon className="w-4 h-4 text-slate-500" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Footer inside sidebar */}
          <div className="pt-6 border-t border-white/5">
            <Link
              href="/settings"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
