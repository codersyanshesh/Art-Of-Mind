"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FolderHeart, Plus, Library, FolderOpen, ArrowRight, Trash2 } from "lucide-react";

interface StoryPreview {
  id: string;
  title: string;
  coverImage: string;
  universeId: string;
  type: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  itemsCount: number;
  items: StoryPreview[];
  createdAt: string;
}

interface CollectionsClientProps {
  storyPreviews: StoryPreview[];
}

export default function CollectionsClient({ storyPreviews }: CollectionsClientProps) {
  // Seed the initial collections with slices of real story thumbnails
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "col_1",
      name: "Late Night Thrills",
      description: "Atmospheric, dark narratives to explore in the dark.",
      itemsCount: Math.min(3, storyPreviews.length),
      items: storyPreviews.slice(0, 3),
      createdAt: "June 24, 2026",
    },
    {
      id: "col_2",
      name: "Epic Fantasy Lore",
      description: "My personal catalog of the best fantasy epics on the platform.",
      itemsCount: Math.min(2, Math.max(0, storyPreviews.length - 3)),
      items: storyPreviews.slice(3, 5),
      createdAt: "July 1, 2026",
    },
  ]);

  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDesc, setNewCollectionDesc] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const createCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    const newCol: Collection = {
      id: `col_${Date.now()}`,
      name: newCollectionName,
      description: newCollectionDesc,
      itemsCount: 0,
      items: [],
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setCollections([...collections, newCol]);
    setNewCollectionName("");
    setNewCollectionDesc("");
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
            <Library className="w-7 h-7 text-electric-violet" />
            My Collections
          </h1>
          <p className="text-xs text-slate-400">
            Organize stories, novels, dramas, and audio into customized lists.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-electric-violet hover:bg-purple-700 text-white flex items-center gap-1.5 transition-all shadow-lg shadow-electric-violet/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create New Collection
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-2xl glass-panel-neon border border-white/10 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FolderHeart className="w-5 h-5 text-electric-violet" />
              New Collection
            </h2>
            <form onSubmit={createCollection} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Collection Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Noir Playlist"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input border border-white/10"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Description</label>
                <textarea
                  placeholder="What is this collection about?"
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input border border-white/10 h-20 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-electric-violet text-white hover:bg-purple-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col) => {
            const firstItem = col.items[0];
            const href = firstItem ? `/universe/${firstItem.universeId}` : "/discover";
            return (
              <Link
                key={col.id}
                href={href}
                className="p-6 rounded-2xl glass-panel border border-white/5 hover:border-electric-violet/25 hover:bg-slate-900/40 hover:shadow-xl hover:shadow-electric-violet/10 transition-all duration-300 flex flex-col justify-between gap-4 group relative cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-electric-violet/10 group-hover:border-electric-violet/30 transition-all duration-300 text-electric-violet">
                      <FolderOpen className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-semibold bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                        {col.itemsCount} items
                      </span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCollections(collections.filter((c) => c.id !== col.id));
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white group-hover:text-electric-violet transition-colors">
                      {col.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {col.description}
                    </p>
                  </div>
                </div>

                {/* Preview thumbnails — driven by real DB stories */}
                {col.items.length > 0 && (
                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    {col.items.map((item, idx) => (
                      <div key={idx} className="w-10 h-14 rounded overflow-hidden border border-white/10 shrink-0 group-hover:border-electric-violet/20 transition-colors">
                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-white/5 mt-2">
                  <span>Created {col.createdAt}</span>
                  <span className="flex items-center gap-1 text-electric-violet group-hover:text-cyan-accent font-semibold transition-colors">
                    Open Playlist
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 space-y-4">
          <Library className="w-12 h-12 mx-auto text-slate-700" />
          <p className="text-sm">You haven&apos;t created any collections yet.</p>
        </div>
      )}
    </div>
  );
}
