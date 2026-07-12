"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Star, Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPES = ["All Types", "Novel", "Vertical Series", "Comic", "Audio Book", "Interactive"];
const STATUSES = ["Any Status", "Ongoing", "Completed", "Hiatus"];
const SORTS = ["Most Popular", "Highest Rated", "Newest", "Alphabetical"];
const RATINGS = ["Any Rating", "4.5+", "4.0+", "3.5+"];

interface SearchResultsContentProps {
  stories: any[];
}

export default function SearchResultsContent({ stories }: SearchResultsContentProps) {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("Any Status");
  const [ratingFilter, setRatingFilter] = useState("Any Rating");
  const [sortBy, setSortBy] = useState("Most Popular");
  const [showFilters, setShowFilters] = useState(false);

  const storyTypeLabel: Record<string, string> = {
    NOVEL: "Novel",
    REEL: "Vertical Series",
    AUDIO: "Audio Book",
    COMIC: "Comic",
    INTERACTIVE: "Interactive",
  };

  const baseResults = query
    ? stories.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(query.toLowerCase())) ||
          (c.universe?.name && c.universe.name.toLowerCase().includes(query.toLowerCase()))
      )
    : stories;

  const filtered = baseResults
    .filter((c) => {
      if (typeFilter === "All Types") return true;
      return storyTypeLabel[c.type] === typeFilter;
    })
    .filter((c) => {
      if (statusFilter === "Any Status") return true;
      if (statusFilter === "Completed") return c.deletedAt == null && c.isPublished === true && c.updatedAt < c.publishedAt;
      if (statusFilter === "Ongoing") return c.isPublished === true && c.deletedAt == null;
      if (statusFilter === "Hiatus") return c.isPublished === false && c.deletedAt == null;
      return true;
    })
    .filter((c) => {
      if (ratingFilter === "Any Rating") return true;
      const min = parseFloat(ratingFilter);
      return c.rating >= min;
    })
    .sort((a, b) => {
      if (sortBy === "Highest Rated") return b.rating - a.rating;
      if (sortBy === "Alphabetical") return a.title.localeCompare(b.title);
      if (sortBy === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.rating - a.rating; // Most Popular = highest rated
    });

  const activeFilterCount = [
    typeFilter !== "All Types",
    statusFilter !== "Any Status",
    ratingFilter !== "Any Rating",
    sortBy !== "Most Popular",
  ].filter(Boolean).length;

  const clearAll = () => {
    setTypeFilter("All Types");
    setStatusFilter("Any Status");
    setRatingFilter("Any Rating");
    setSortBy("Most Popular");
  };

  return (
    <>
      <div className="border-b border-white/5 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-2">
              <Search className="w-7 h-7 text-cyan-accent" />
              {query ? `Search results for "${query}"` : "Search Library"}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Found {filtered.length} matching works in the database
            </p>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none shrink-0 self-start md:self-auto",
              showFilters || activeFilterCount > 0
                ? "bg-electric-violet/20 border-electric-violet/40 text-electric-violet"
                : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-electric-violet text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
          </button>
        </div>

        {/* Collapsible Filters Panel */}
        {showFilters && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-5 rounded-2xl glass-panel border border-white/5 animate-fade-in relative z-20">
            {/* Format Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Format Type</label>
              <div className="relative">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 appearance-none focus:outline-none focus:border-electric-violet"
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Publication Status</label>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 appearance-none focus:outline-none focus:border-electric-violet"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Min Rating */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Minimum Rating</label>
              <div className="relative">
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 appearance-none focus:outline-none focus:border-electric-violet"
                >
                  {RATINGS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Sort Order */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 appearance-none focus:outline-none focus:border-electric-violet"
                >
                  {SORTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        )}

        {/* Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 select-none">
            {typeFilter !== "All Types" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-semibold text-slate-300">
                Format: {typeFilter}
                <X className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" onClick={() => setTypeFilter("All Types")} />
              </span>
            )}
            {statusFilter !== "Any Status" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-semibold text-slate-300">
                Status: {statusFilter}
                <X className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" onClick={() => setStatusFilter("Any Status")} />
              </span>
            )}
            {ratingFilter !== "Any Rating" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-semibold text-slate-300">
                Rating: {ratingFilter}
                <X className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" onClick={() => setRatingFilter("Any Rating")} />
              </span>
            )}
            {sortBy !== "Most Popular" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-semibold text-slate-300">
                Sort: {sortBy}
                <X className="w-3 h-3 text-slate-500 hover:text-white cursor-pointer" onClick={() => setSortBy("Most Popular")} />
              </span>
            )}
            <button onClick={clearAll} className="text-[10px] font-bold text-slate-500 hover:text-white cursor-pointer ml-1 py-1">
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/universe/${item.universeId}`}
              className="group rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-cyan-accent/30 hover:scale-[1.01] hover:shadow-xl active:scale-[0.99] transition-all flex flex-col h-full cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-950/80 border border-white/5 text-[9px] font-bold text-slate-300">
                  {storyTypeLabel[item.type] ?? item.type}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white truncate group-hover:text-cyan-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-2 border-t border-white/5">
                  <span className="truncate max-w-[60%]">{item.universe.name}</span>
                  <span className="flex items-center gap-0.5 text-gold-accent font-bold">
                    <Star className="w-3 h-3 fill-gold-accent" />
                    {item.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-slate-500 space-y-3">
          <Search className="w-10 h-10 mx-auto text-slate-700 animate-bounce" />
          <p className="text-sm">No stories found matching your filters.</p>
          <button onClick={clearAll} className="text-xs text-electric-violet hover:underline cursor-pointer">Clear filters</button>
        </div>
      )}
    </>
  );
}
