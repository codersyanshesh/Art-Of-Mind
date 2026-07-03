export interface Creator {
  id: string;
  name: string;
  avatar: string;
  role: 'Creator' | 'Super Admin' | 'Member';
  isVerified: boolean;
  followers: number;
  following: number;
  bio: string;
}

export interface ContentItem {
  id: string;
  title: string;
  coverImage: string;
  creator: Creator;
  type: 'Novel' | 'Vertical Series' | 'Comic' | 'Audio Book' | 'Animation' | 'Interactive';
  genres: string[];
  rating: number;
  views: number;
  likes: number;
  episodesCount?: number;
  universeId?: string;
  description: string;
  releaseDate: string;
  isPremium?: boolean;
}

export interface Universe {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  creator: Creator;
  items: ContentItem[];
  timeline: { year: string; event: string; type: string }[];
  characters: { name: string; avatar: string; role: string; bio: string }[];
}

export const mockCreators: Record<string, Creator> = {
  "cr_nexus": {
    id: "cr_nexus",
    name: "Nexus Prime",
    avatar: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150",
    role: "Creator",
    isVerified: true,
    followers: 124500,
    following: 142,
    bio: "Weaving interactive multi-format sci-fi epics. Author of the Crimson Kingdom Universe.",
  },
  "cr_elara": {
    id: "cr_elara",
    name: "Elara Vane",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    role: "Creator",
    isVerified: true,
    followers: 89300,
    following: 204,
    bio: "Fantasy illustrator and screen writer. Exploring dark magic, romance, and visual novels.",
  },
  "cr_kai": {
    id: "cr_kai",
    name: "Kai Zen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    role: "Creator",
    isVerified: false,
    followers: 43100,
    following: 89,
    bio: "Director & editor. Specialized in fast-paced short vertical dramas and high-impact thrillers.",
  }
};

export const mockContents: ContentItem[] = [
  {
    id: "c_crimson_novel",
    title: "The Crimson Throne",
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop",
    creator: mockCreators.cr_nexus,
    type: "Novel",
    genres: ["Fantasy", "Romance", "Drama"],
    rating: 4.9,
    views: 452000,
    likes: 89000,
    universeId: "u_crimson_kingdom",
    description: "In a kingdom dyed by the blood of dragons, a peasant girl discovers she is the rightful heir to the Crimson Throne. To survive, she must play the deadly games of courtly intrigue.",
    releaseDate: "2026-05-12",
  },
  {
    id: "c_crimson_series",
    title: "Shadows of the Crimson Crown",
    coverImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    creator: mockCreators.cr_nexus,
    type: "Vertical Series",
    genres: ["Fantasy", "Action", "Drama"],
    rating: 4.8,
    views: 1200000,
    likes: 310000,
    episodesCount: 24,
    universeId: "u_crimson_kingdom",
    description: "The live-action vertical drama spin-off. Follow the secret guards who defend the Crimson Throne from the shadows.",
    releaseDate: "2026-06-01",
    isPremium: true,
  },
  {
    id: "c_crimson_comic",
    title: "Crimson Kingdom: Origins",
    coverImage: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop",
    creator: mockCreators.cr_elara,
    type: "Comic",
    genres: ["Fantasy", "Adventure"],
    rating: 4.7,
    views: 280000,
    likes: 42000,
    universeId: "u_crimson_kingdom",
    description: "Visual comic focusing on the legendary dragon wars that formed the boundaries of the Crimson Kingdom 500 years ago.",
    releaseDate: "2026-04-18",
  },
  {
    id: "c_cyber_audio",
    title: "Neo-Tokyo Noir: Neon Echoes",
    coverImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=600&fit=crop",
    creator: mockCreators.cr_kai,
    type: "Audio Book",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    rating: 4.6,
    views: 185000,
    likes: 29000,
    description: "A binaural 3D audio mystery. Cybernetic detective Silas Vance hunts a virus that hacks human memories in the rain-slicked streets of Neo-Tokyo.",
    releaseDate: "2026-06-15",
  },
  {
    id: "c_dream_animation",
    title: "Chasing Eternity",
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop",
    creator: mockCreators.cr_elara,
    type: "Animation",
    genres: ["Slice of Life", "Drama", "Fantasy"],
    rating: 4.9,
    views: 650000,
    likes: 120000,
    description: "A beautifully animated short film exploring a painter who discovers her artworks can open doors to lost moments in time.",
    releaseDate: "2026-03-22",
  },
  {
    id: "c_interactive_story",
    title: "Zero Hour: Protocol",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop",
    creator: mockCreators.cr_nexus,
    type: "Interactive",
    genres: ["Sci-Fi", "Thriller", "Action"],
    rating: 4.7,
    views: 310000,
    likes: 58000,
    description: "A choose-your-own-ending interactive game. You have 60 minutes to stop a global mainframe meltdown. Every choice counts, and 90% of endings are fatal.",
    releaseDate: "2026-06-20",
  }
];

export const mockUniverses: Universe[] = [
  {
    id: "u_crimson_kingdom",
    name: "The Crimson Kingdom Universe",
    description: "An interconnected medieval dark fantasy franchise spanning novels, comics, short films, and vertical dramas. Discover a world where dragons, blood magic, and political betrayal collide.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=500&fit=crop",
    creator: mockCreators.cr_nexus,
    items: [
      mockContents[0], // Novel
      mockContents[1], // Vertical Series
      mockContents[2], // Comic
    ],
    timeline: [
      { year: "Year 0", event: "The Dragon Pact is signed; bloodlines are bound.", type: "History" },
      { year: "Year 350", event: "The Crimson Rebellion erupts; three dragon lords fall.", type: "Origins Comic" },
      { year: "Year 500", event: "Events of 'The Crimson Throne' novel begin.", type: "Main Novel" },
      { year: "Year 502", event: "The Shadow Guards' secret campaign unfolds.", type: "Vertical Series" }
    ],
    characters: [
      {
        name: "Elara of Ash",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        role: "Main Protagonist (The Crimson Throne)",
        bio: "A peasant girl raised in the ash pits, unaware that the blood of the dragon lords runs pure in her veins."
      },
      {
        name: "Commander Valen",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
        role: "Anti-Hero (Shadows of the Crimson Crown)",
        bio: "Leader of the Shadow Guard, sworn to protect the crown but secretly harboring a debt to the rebels."
      },
      {
        name: "Lydia the Witch",
        avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150",
        role: "Supporting (Origins Comic)",
        bio: "The last blood alchemist who forged the three magic crown gems during the rebellion."
      }
    ]
  }
];

export const mockCreatorStats = {
  dashboard: {
    views: "2.4M",
    viewsChange: "+18.4%",
    followers: "124.5K",
    followersChange: "+12.1%",
    revenue: "$8,950.00",
    revenueChange: "+24.3%",
    watchTime: "34.2K hrs",
    watchTimeChange: "+8.7%",
    completionRate: "72.4%",
    trendingScore: "98.5",
  },
  demographics: {
    countries: [
      { name: "United States", percentage: 35 },
      { name: "United Kingdom", percentage: 18 },
      { name: "Japan", percentage: 15 },
      { name: "Germany", percentage: 12 },
      { name: "Others", percentage: 20 },
    ],
    ageGroups: [
      { range: "13-17", percentage: 10 },
      { range: "18-24", percentage: 45 },
      { range: "25-34", percentage: 30 },
      { range: "35-44", percentage: 12 },
      { range: "45+", percentage: 3 },
    ],
    viewingTimes: [
      { hour: "12 AM", views: 2400 },
      { hour: "4 AM", views: 1200 },
      { hour: "8 AM", views: 4300 },
      { hour: "12 PM", views: 7800 },
      { hour: "4 PM", views: 9500 },
      { hour: "8 PM", views: 12000 },
    ]
  }
};
