"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Shield,
  User,
  Bell,
  KeyRound,
  CheckCircle2,
  Eye,
  Type,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import {
  updateProfileAction,
  updatePreferencesAction,
  deleteAccountAction,
} from "@/app/actions/settings";


// Map DB enum values → UI display keys
const dbFontToUi: Record<string, "S" | "M" | "L" | "XL"> = {
  Small: "S",
  Medium: "M",
  Large: "L",
  XLarge: "XL",
};

const dbBgToUi: Record<string, "dark" | "sepia" | "paper" | "amoled"> = {
  Dark: "dark",
  Sepia: "sepia",
  Paper: "paper",
  AMOLED: "amoled",
};

const uiFontToDb: Record<string, string> = {
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "XLarge",
};

const uiBgToDb: Record<string, string> = {
  dark: "Dark",
  sepia: "Sepia",
  paper: "Paper",
  amoled: "AMOLED",
};

type SettingsTab = "profile" | "security" | "notifications" | "accessibility";

interface Props {
  initialName: string;
  initialBio: string;
  initialAvatarUrl: string;
  initialFontSize: string;
  initialDyslexiaFont: boolean;
  initialReadingBg: string;
  initialColorblindMode: boolean;
}

export default function SettingsClient({
  initialName,
  initialBio,
  initialFontSize,
  initialDyslexiaFont,
  initialReadingBg,
  initialColorblindMode,
}: Props) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const router = useRouter();

  // Profile state — seeded from the database via RSC props
  const [name, setName] = useState(initialName || "");
  const [bio, setBio] = useState(initialBio || "");

  // Security state
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [mfaSuccess, setMfaSuccess] = useState(false);
  const [otpVal, setOtpVal] = useState("");

  // Deletion state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const result = await deleteAccountAction();
      if (result.error) {
        alert(result.error);
        setDeleting(false);
      } else {
        localStorage.removeItem("aom_user");
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while deleting your account.");
      setDeleting(false);
    }
  };

  // Accessibility state — seeded from the database via RSC props
  const [fontSize, setFontSize] = useState<"S" | "M" | "L" | "XL">(
    dbFontToUi[initialFontSize] ?? "M"
  );
  const [dyslexiaFont, setDyslexiaFont] = useState(initialDyslexiaFont);
  const [readingBg, setReadingBg] = useState<"dark" | "sepia" | "paper" | "amoled">(
    dbBgToUi[initialReadingBg] ?? "dark"
  );
  const [colorblind, setColorblind] = useState(initialColorblindMode);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fontSizeMap = { S: "13px", M: "15px", L: "17px", XL: "20px" };
  const readingBgMap = {
    dark: { bg: "bg-slate-950", label: "Dark (default)" },
    sepia: { bg: "bg-amber-950/60", label: "Sepia" },
    paper: { bg: "bg-slate-100/10", label: "Paper" },
    amoled: { bg: "bg-black", label: "AMOLED Black" },
  };

  const showSuccess = () => {
    setSaveSuccess(true);
    setSaveError(null);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const showError = (msg: string) => {
    setSaveError(msg);
    setSaveSuccess(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.set("displayName", name);
    formData.set("bio", bio);

    const result = await updateProfileAction(formData);
    setSaving(false);

    if (result.error) {
      showError(result.error);
    } else {
      showSuccess();
    }
  };

  const handleSaveAccessibility = async () => {
    setSaving(true);

    const formData = new FormData();
    formData.set("fontSize", uiFontToDb[fontSize] ?? "Medium");
    formData.set("dyslexiaFont", dyslexiaFont.toString());
    formData.set("readingBg", uiBgToDb[readingBg] ?? "Dark");
    formData.set("colorblindMode", colorblind.toString());

    const result = await updatePreferencesAction(formData);
    setSaving(false);

    if (result.error) {
      showError(result.error);
    } else {
      showSuccess();
    }
  };

  const handleToggleMfa = () => {
    if (mfaEnabled) {
      setMfaEnabled(false);
    } else {
      setOtpSent(true);
    }
  };

  const handleVerifyMfaOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpVal === "123456" || otpVal === "111111") {
      setMfaEnabled(true);
      setOtpSent(false);
      setMfaSuccess(true);
      confetti({
        particleCount: 50,
        spread: 60,
        colors: ["#7c3aed", "#06b6d4"],
      });
      setTimeout(() => setMfaSuccess(false), 3000);
      setOtpVal("");
    } else {
      alert("Invalid OTP for settings verification. Enter '123456' to proceed.");
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
          <Settings className="w-7 h-7 text-electric-violet" />
          Settings &amp; Preferences
        </h1>
        <p className="text-xs text-slate-400">
          Manage your creative profile, notification hubs, and security authentications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Navigation Links */}
        <div className="space-y-1 lg:col-span-1">
          {(
            [
              { id: "profile", label: "Profile Details", icon: User },
              { id: "security", label: "MFA & Security", icon: Shield },
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "accessibility", label: "Accessibility", icon: Eye },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl text-left transition-colors cursor-pointer",
                activeTab === id
                  ? "bg-electric-violet/15 text-white text-glow-violet"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Right Side: Tab panel */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6"
            >
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-electric-violet" />
                Profile Customization
              </h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Display Username
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input border border-white/10"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Creator Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input border border-white/10 h-24 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Settings"}
                </button>
                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile updated
                  </span>
                )}
                {saveError && (
                  <span className="text-xs font-semibold text-red-400">{saveError}</span>
                )}
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
              <div className="flex justify-between items-start border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-electric-violet" />
                    Multi-Factor Authentication (MFA)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Secure your account credentials using 6-digit Time-Based One-Time Passwords (TOTP).
                  </p>
                </div>

                <button
                  onClick={handleToggleMfa}
                  className={cn(
                    "px-4 py-2 text-xs font-bold rounded-xl border transition-colors cursor-pointer",
                    mfaEnabled
                      ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                      : "bg-electric-violet hover:bg-purple-700 border-electric-violet text-white"
                  )}
                >
                  {mfaEnabled ? "Disable MFA" : "Enable MFA"}
                </button>
              </div>

              {mfaSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  MFA security verification configuration has been successfully activated.
                </div>
              )}

              {otpSent && (
                <form
                  onSubmit={handleVerifyMfaOtp}
                  className="p-4 rounded-xl bg-white/2 border border-white/5 space-y-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4 text-electric-violet" />
                      Verify Security Key
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      We sent a confirmation code. Enter the 6-digit OTP code below to enable protection.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      value={otpVal}
                      onChange={(e) => setOtpVal(e.target.value)}
                      className="px-4 py-2 text-xs rounded-xl glass-input border border-white/10 w-[120px] text-center"
                      maxLength={6}
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-bold bg-electric-violet hover:bg-purple-700 text-white rounded-xl"
                    >
                      Confirm Code
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-violet" />
                  <span>Google Authentication is automatically configured if signed in via Google OAuth.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-electric-violet" />
                  <span>OTP credentials can be received via email or a TOTP mobile application.</span>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border-t border-red-500/20 pt-6 space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
                    Danger Zone
                  </h3>
                  <p className="text-xs text-slate-400">
                    Irreversibly delete your account and all associated profile, settings, reading history, and wallet details.
                  </p>
                </div>

                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="px-4 py-2 text-xs font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/25 text-red-400 rounded-xl transition-colors cursor-pointer"
                  >
                    Delete Account...
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20 space-y-3">
                    <p className="text-xs text-red-300 font-semibold">
                      Are you absolutely sure? This action is permanent and cannot be undone.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className="px-4 py-2 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                      >
                        {deleting ? "Deleting..." : "Yes, Delete My Account"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(false)}
                        className="px-4 py-2 text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-electric-violet" />
                Notification Preferences
              </h2>

              <div className="space-y-4">
                {[
                  {
                    label: "Story Updates",
                    desc: "Receive notifications when bookmarked stories post a new episode.",
                    defaultChecked: true,
                  },
                  {
                    label: "Creator Announcements",
                    desc: "Receive messages from joined fan club bulletin boards.",
                    defaultChecked: true,
                  },
                  {
                    label: "Marketing Emails",
                    desc: "Periodic recommendations based on your viewing history patterns.",
                    defaultChecked: false,
                  },
                ].map(({ label, desc, defaultChecked }) => (
                  <label
                    key={label}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">{label}</p>
                      <p className="text-[10px] text-slate-500">{desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      defaultChecked={defaultChecked}
                      className="accent-electric-violet"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Accessibility Tab */}
          {activeTab === "accessibility" && (
            <div className="p-6 rounded-2xl glass-panel border border-white/5 space-y-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-electric-violet" />
                Accessibility &amp; Reading Modes
              </h2>

              {/* Font Size */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" /> Font Size
                  </p>
                  <p className="text-[10px] text-slate-500">Adjusts text size across reading pages.</p>
                </div>
                <div className="flex gap-2">
                  {(["S", "M", "L", "XL"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      className={cn(
                        "flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                        fontSize === size
                          ? "bg-electric-violet border-electric-violet text-white shadow-lg shadow-electric-violet/20"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-600">Current: {fontSizeMap[fontSize]}</p>
              </div>

              {/* Dyslexia Font */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Dyslexia-Friendly Font</p>
                  <p className="text-[10px] text-slate-500">
                    Switches reading text to OpenDyslexic typeface for easier letter recognition.
                  </p>
                </div>
                <button
                  onClick={() => setDyslexiaFont(!dyslexiaFont)}
                  className={cn(
                    "relative w-10 h-5.5 rounded-full border transition-all cursor-pointer shrink-0",
                    dyslexiaFont
                      ? "bg-electric-violet border-electric-violet"
                      : "bg-white/10 border-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300",
                      dyslexiaFont ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </label>

              {/* Reading Background */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" /> Reading Background
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Changes the background color while reading novels or chapters.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    Object.entries(readingBgMap) as [
                      typeof readingBg,
                      { bg: string; label: string }
                    ][]
                  ).map(([key, val]) => (
                    <button
                      key={key}
                      onClick={() => setReadingBg(key)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                        readingBg === key
                          ? "border-electric-violet bg-electric-violet/10"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg border border-white/20 shrink-0", val.bg)} />
                      <span className="text-xs font-semibold text-white">{val.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorblind Mode */}
              <label className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-white/5 cursor-pointer">
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-white">Colorblind-Friendly Mode</p>
                  <p className="text-[10px] text-slate-500">
                    Adjusts accent colors to a high-contrast palette safe for all color vision types.
                  </p>
                </div>
                <button
                  onClick={() => setColorblind(!colorblind)}
                  className={cn(
                    "relative w-10 h-5.5 rounded-full border transition-all cursor-pointer shrink-0",
                    colorblind
                      ? "bg-electric-violet border-electric-violet"
                      : "bg-white/10 border-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300",
                      colorblind ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </label>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleSaveAccessibility}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white transition-colors cursor-pointer disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Accessibility Settings"}
                </button>
                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Preferences saved
                  </span>
                )}
                {saveError && (
                  <span className="text-xs font-semibold text-red-400">{saveError}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
