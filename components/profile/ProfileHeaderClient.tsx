"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Edit3, Heart, X, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { uploadCoverImage } from "@/lib/supabase/storage";
import { updateProfileAction } from "@/app/actions/settings";

interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
}

interface ProfileHeaderClientProps {
  profile: CreatorProfile;
  isOwnProfile: boolean;
  isVerified: boolean;
  storiesCount: number;
}

export default function ProfileHeaderClient({
  profile,
  isOwnProfile,
  isVerified,
  storiesCount,
}: ProfileHeaderClientProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [name, setName] = useState(profile.displayName || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [coverUrl, setCoverUrl] = useState(profile.coverUrl || "");

  // Upload states
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  // File input refs
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const creatorAvatar =
    avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=128`;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile picture must be under 5MB.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const filePath = `avatars/avatar-${randomId}-${Date.now()}.${fileExt}`;

      const publicUrl = await uploadCoverImage(filePath, file);
      setAvatarUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      alert(`Avatar upload failed: ${err.message}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Cover photo must be under 5MB.");
      return;
    }

    setUploadingCover(true);
    try {
      const fileExt = file.name.split(".").pop();
      const randomId = Math.random().toString(36).substring(2, 10);
      const filePath = `covers/cover-${randomId}-${Date.now()}.${fileExt}`;

      const publicUrl = await uploadCoverImage(filePath, file);
      setCoverUrl(publicUrl);
    } catch (err: any) {
      console.error(err);
      alert(`Cover photo upload failed: ${err.message}`);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    formData.set("displayName", name);
    formData.set("bio", bio);
    formData.set("avatarUrl", avatarUrl);
    formData.set("coverUrl", coverUrl);

    try {
      const result = await updateProfileAction(formData);
      if (result.error) {
        alert(result.error);
      } else {
        setIsModalOpen(false);
        router.refresh();
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      alert(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl overflow-hidden glass-panel border border-white/5 relative">
        {/* Cover Photo banner */}
        <div className="relative h-48 md:h-64 w-full bg-slate-950 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950">
          {coverUrl ? (
            <img src={coverUrl} alt="Profile Cover" className="w-full h-full object-cover animate-fade-in" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-slate-950 via-purple-950/10 to-slate-950 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.1),transparent)] pointer-events-none" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
        </div>

        {/* Profile Info and Avatar Row */}
        <div className="px-6 pb-6 md:px-8 md:pb-8 flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 md:-mt-16 relative z-10 text-center md:text-left">
          {/* Avatar overlap */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-slate-950 bg-slate-950 shrink-0 relative shadow-2xl">
            <img src={creatorAvatar} alt={name} className="w-full h-full object-cover" />
          </div>

          {/* Details info */}
          <div className="space-y-3 flex-1 pt-2 md:pt-16">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="text-2xl font-black text-white">{name}</h2>
                {isVerified && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-electric-violet/20 border border-electric-violet/30 text-glow-purple text-[8px] font-bold text-electric-violet uppercase tracking-wider w-max mx-auto md:mx-0">
                    Verified Creator
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 max-w-xl">{bio || "No biography added yet."}</p>
            </div>

            <div className="flex justify-center md:justify-start gap-6 text-xs text-slate-400">
              <div>
                <span className="font-bold text-white">{storiesCount}K</span> Followers
              </div>
              <div>
                <span className="font-bold text-white">{Math.ceil(storiesCount / 2)}</span> Following
              </div>
            </div>
          </div>

          {/* Button: Edit Profile (if owner) otherwise Follow Creator */}
          {isOwnProfile ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white flex items-center gap-2 border border-white/10 transition-all cursor-pointer mt-4 md:mt-12 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Edit3 className="w-4 h-4 text-electric-violet" />
              Edit Profile
            </button>
          ) : (
            <button className="px-5 py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white shadow-lg shadow-electric-violet/20 transition-all cursor-pointer mt-4 md:mt-12 hover:scale-[1.02] active:scale-[0.98]">
              Follow Creator
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Edit public profile details</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Media Uploads (Cover and Avatar) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Profile Banners
                </label>

                {/* Cover Photo */}
                <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-white/5 group bg-slate-950 bg-gradient-to-r from-slate-950 via-purple-950/20 to-slate-950 flex items-center justify-center">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-600 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> No cover photo uploaded
                    </div>
                  )}
                  {uploadingCover && (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center text-xs text-white gap-2 z-20">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-electric-violet" />
                      Uploading cover...
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-950/90 hover:bg-slate-900 border border-white/10 rounded-lg text-[9px] font-bold text-white transition-all cursor-pointer z-10"
                  >
                    <Camera className="w-3.5 h-3.5 text-electric-violet" />
                    Upload Cover
                  </button>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Overlapping Avatar */}
                  <div className="absolute bottom-2 left-3 flex items-end z-10">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-electric-violet bg-slate-950 shadow-2xl group/avatar">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-400 text-sm bg-gradient-to-tr from-electric-violet to-cyan-accent text-white">
                          {name ? name.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-20">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-electric-violet" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-all duration-300 cursor-pointer text-white"
                      >
                        <Camera className="w-4 h-4 text-glow-violet" />
                      </button>
                      <input
                        type="file"
                        ref={avatarInputRef}
                        onChange={handleAvatarFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-slate-300 focus:outline-none focus:border-electric-violet"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Biography (Bio)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs font-semibold text-slate-300 focus:outline-none focus:border-electric-violet h-20 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-electric-violet hover:bg-purple-700 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-60 shadow-lg shadow-electric-violet/20"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
