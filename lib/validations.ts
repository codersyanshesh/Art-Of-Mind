import { z } from "zod";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const SignUpSchema = z
  .object({
    displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
    email: z.string().email("A valid email address is required."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    role: z.enum(["READER", "CREATOR"]).default("READER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  email: z.string().email("A valid email address is required."),
  password: z.string().min(1, "Password is required."),
});

// ─── Comments ────────────────────────────────────────────────────────────────

export const CommentSchema = z.object({
  storyId: z.string().uuid("A valid story ID is required."),
  text: z
    .string()
    .min(1, "Comment cannot be empty.")
    .max(2000, "Comment must be under 2000 characters."),
  spoiler: z.boolean().default(false),
  parentCommentId: z.string().uuid().optional(),
});

// ─── Settings ────────────────────────────────────────────────────────────────

export const ProfileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters.").max(50),
  bio: z.string().max(500, "Bio must be under 500 characters.").optional(),
  avatarUrl: z.string().url("Avatar must be a valid URL.").optional().or(z.literal("")),
  coverUrl: z.string().url("Cover photo must be a valid URL.").optional().or(z.literal("")),
});

export const PreferencesSchema = z.object({
  fontSize: z.enum(["Small", "Medium", "Large", "XLarge"]).default("Medium"),
  dyslexiaFont: z.boolean().default(false),
  readingBg: z.enum(["Dark", "Sepia", "Paper", "AMOLED"]).default("Dark"),
  colorblindMode: z.boolean().default(false),
});

// ─── Reading Progress ─────────────────────────────────────────────────────────

export const ReadingProgressSchema = z.object({
  storyId: z.string().uuid("A valid story ID is required."),
  chapterIndex: z.number().int().min(0),
  percent: z.number().int().min(0).max(100).default(0),
});
