"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Bell, Menu, User, LogOut, Compass, LayoutDashboard,
  BrainCircuit, Sparkles, BookOpen, Star, Gift, MessageSquare,
  Heart, X, CheckCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/actions/auth";

interface NavbarProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  type: "chapter" | "tip" | "comment" | "streak" | "collab";
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "chapter",
    title: "New Chapter Released",
    body: "Luna Ashveil published Chapter 26 of The Crimson Throne.",
    time: "2 min ago",
    read: false,
    icon: <BookOpen className="w-4 h-4 text-electric-violet" />,
  },
  {
    id: "n2",
    type: "tip",
    title: "You Received a Tip! 🪙",
    body: "A reader tipped you 50 tokens for your latest reel episode.",
    time: "18 min ago",
    read: false,
    icon: <Gift className="w-4 h-4 text-gold-accent" />,
  },
  {
    id: "n3",
    type: "comment",
    title: "Comment Reply",
    body: "WitchOfAsh replied to your comment: \"That theory is actually canon!\"",
    time: "1 hr ago",
    read: false,
    icon: <MessageSquare className="w-4 h-4 text-cyan-accent" />,
  },
  {
    id: "n4",
    type: "streak",
    title: "🔥 Day 3 Streak Active",
    body: "Keep reading today to maintain your 3-day narrative streak!",
    time: "3 hr ago",
    read: true,
    icon: <Star className="w-4 h-4 text-gold-accent" />,
  },
  {
    id: "n5",
    type: "collab",
    title: "Collaboration Invite",
    body: "Ezra Voss invited you to co-author a new Universe.",
    time: "Yesterday",
    read: true,
    icon: <Sparkles className="w-4 h-4 text-electric-violet" />,
  },
];

export default function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const loadNotifications = () => {
    import("@/app/actions/auth").then(({ getNotificationsAction }) => {
      getNotificationsAction().then((res) => {
        if (res.notifications) {
          setNotifications(
            res.notifications.map((n: any) => ({
              id: n.id,
              type: n.type,
              title: n.type.toUpperCase() === "CHAPTER" ? "New Chapter Released" : "Creator Notification",
              body: n.message,
              time: new Date(n.createdAt).toLocaleDateString(),
              read: n.read,
              icon: n.type.toUpperCase() === "CHAPTER" ? (
                <BookOpen className="w-4 h-4 text-electric-violet" />
              ) : (
                <Gift className="w-4 h-4 text-cyan-accent" />
              ),
            }))
          );
        }
      });
    });
  };

  // Load user and notifications
  useEffect(() => {
    const storedUser = localStorage.getItem("aom_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      loadNotifications();

      // Realtime notifications subscriber
      import("@/lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        const channel = supabase
          .channel("user-notifications-realtime")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "Notification" },
            () => {
              // Pull down fresh alerts from database
              loadNotifications();
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      });
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    notifications.forEach((n) => {
      if (!n.read) {
        import("@/app/actions/auth").then(({ markNotificationReadAction }) => {
          markNotificationReadAction(n.id);
        });
      }
    });
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    import("@/app/actions/auth").then(({ markNotificationReadAction }) => {
      markNotificationReadAction(id);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutAction();
    } catch (err) {
      console.error("Error signing out:", err);
    }
    localStorage.removeItem("aom_user");
    setUser(null);
    setShowUserMenu(false);
    router.push("/");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5",
        isScrolled ? "bg-cosmic-bg/85 backdrop-blur-md py-3" : "bg-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Menu & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <BrainCircuit className="w-8 h-8 text-electric-violet group-hover:text-cyan-accent transition-colors duration-300" />
                <div className="absolute -inset-1 bg-electric-violet/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="font-bold text-xl tracking-wider bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                ART OF <span className="text-electric-violet text-glow-violet">MIND</span>
              </span>
            </Link>
          </div>

          {/* Center: Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              placeholder="Search universes, series, novels, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full glass-input text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          </form>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4">
            <Link
              href="/discover"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <Compass className="w-4 h-4" />
              Discover
            </Link>

            {user?.role === "Creator" && (
              <Link
                href="/studio"
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-electric-violet transition-colors bg-electric-violet/10 px-3 py-1.5 rounded-full border border-electric-violet/20 hover:border-electric-violet/40"
              >
                <LayoutDashboard className="w-4 h-4" />
                Creator Studio
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-3 relative">
                {/* Notification Bell */}
                <div ref={notifRef} className="relative">
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="relative text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-electric-violet rounded-full ring-2 ring-cosmic-bg flex items-center justify-center text-[9px] font-bold text-white px-0.5">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-11 w-80 rounded-2xl glass-panel-neon border border-white/10 shadow-2xl z-50 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-electric-violet" />
                          <span className="text-sm font-bold text-white">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-electric-violet text-[9px] font-bold text-white">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-accent transition-colors cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-[320px] overflow-y-auto divide-y divide-white/5">
                        {notifications.length === 0 ? (
                          <div className="py-10 text-center text-slate-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                            <p className="text-xs">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={cn(
                                "flex items-start gap-3 px-4 py-3 transition-colors group",
                                notif.read ? "opacity-60" : "bg-electric-violet/5"
                              )}
                            >
                              <div className="p-2 rounded-lg bg-white/5 border border-white/5 shrink-0 mt-0.5">
                                {notif.icon}
                              </div>
                              <div className="flex-1 min-w-0 space-y-0.5">
                                <p className="text-xs font-bold text-white leading-tight">{notif.title}</p>
                                <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{notif.body}</p>
                                <p className="text-[9px] text-slate-600 font-semibold">{notif.time}</p>
                              </div>
                              <button
                                onClick={() => dismissNotification(notif.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-all shrink-0"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-2.5 border-t border-white/5 text-center">
                        <span className="text-[10px] text-slate-500 hover:text-electric-violet transition-colors cursor-pointer font-semibold">
                          View all activity →
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Button */}
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/10"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-electric-violet to-cyan-accent flex items-center justify-center font-semibold text-white shadow-lg text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-slate-200">{user.name}</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-11 w-48 rounded-xl glass-panel-neon p-1.5 border border-white/10 shadow-2xl z-50">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 text-[10px] font-semibold bg-electric-violet/20 text-glow-violet text-electric-violet rounded">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href={`/profile/${user.name.toLowerCase()}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </Link>

                    {user.role === "Creator" && (
                      <Link
                        href="/studio"
                        className="flex sm:hidden items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Creator Studio
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-electric-violet to-cyan-accent rounded-full" />
                  <span className="relative block px-4 py-1.5 rounded-full bg-slate-950/90 text-sm font-medium text-white transition-all group-hover:bg-slate-900/50">
                    Sign Up
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
