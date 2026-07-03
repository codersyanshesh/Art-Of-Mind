# Art of Mind — API Specifications

This document defines the interface specifications, routing conventions, and data contracts for the backend APIs and Server Actions in the Art of Mind ecosystem.

---

## 🔌 API Architecture Overview

Art of Mind leverages a hybrid API strategy built on Next.js 15:
1. **Next.js Server Actions**: Primary mechanism for secure, type-safe data mutations (e.g., publishing comments, saving settings, updating wallet transactions).
2. **Next.js Route Handlers (`/api/*`)**: Used for RESTful resource endpoints, webhook handlers (e.g., Supabase Auth state sync), and server-to-server operations.
3. **Real-time Subscriptions**: Direct listener hooks to Supabase's realtime channel replication (e.g., live comment streams).

---

## ⚡ Server Actions Contract

Server Action files are located under `app/actions/` or alongside specific feature folders. All actions must enforce verification checks and return standardized responses.

### Base Response Type
```typescript
interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  };
}
```

### Key Server Actions

#### 1. `updateUserPreferences`
- **Location**: `app/actions/preferences.ts`
- **Security**: Requires active authenticated Supabase Session.
- **Request Payload**:
  ```typescript
  interface PreferencesInput {
    fontSize: "Small" | "Medium" | "Large" | "Extra Large";
    dyslexiaFont: boolean;
    readingBg: "Light" | "Dark" | "Sepia";
    colorblindMode: boolean;
  }
  ```
- **Returns**: `Promise<ActionResponse<Preferences>>`

#### 2. `saveReadingProgress`
- **Location**: `app/actions/progress.ts`
- **Security**: Requires active authenticated user check.
- **Request Payload**:
  ```typescript
  interface ProgressInput {
    storyId: string;
    chapterIndex: number;
    percent: number; // 0-100 (throttled by 10% deciles)
  }
  ```
- **Returns**: `Promise<ActionResponse<ReadingProgress>>`

#### 3. `postComment`
- **Location**: `app/actions/comments.ts`
- **Security**: Requires verified user session.
- **Request Payload**:
  ```typescript
  interface CommentInput {
    storyId: string;
    text: string;
    parentCommentId?: string; // For replies
    spoiler?: boolean;
  }
  ```
- **Returns**: `Promise<ActionResponse<Comment>>`

---

## 🌐 RESTful Route Handlers (`/api/*`)

### 1. Supabase Webhook: User Synchronization
- **Endpoint**: `POST /api/webhooks/auth`
- **Purpose**: Synchronize user registrations from Supabase Auth to the main PostgreSQL `User` and `Profile` models.
- **Authentication**: Custom HMAC validation or Supabase secret key verification header.
- **Payload Signature**:
  ```json
  {
    "type": "INSERT",
    "table": "users",
    "record": {
      "id": "supabase-uuid-string-here",
      "email": "user@example.com",
      "raw_user_meta_data": {
        "display_name": "New Storyteller"
      }
    }
  }
  ```
- **Response**:
  - `200 OK` on successful synchronization.
  - `400 Bad Request` on invalid payload or signature mismatch.

### 2. Media Upload Pre-signed URL Generator
- **Endpoint**: `POST /api/media/upload-url`
- **Security**: Requires `role: CREATOR` or `ADMIN`.
- **Purpose**: Generates a secure, temporary pre-signed URL to upload file assets (video reels, cover art, audio clips) directly to the Supabase Storage Bucket.
- **Request Parameters**:
  ```json
  {
    "filename": "chapter1_audio.mp3",
    "contentType": "audio/mpeg",
    "storyId": "story-uuid"
  }
  ```
- **Response (`200 OK`)**:
  ```json
  {
    "uploadUrl": "https://[project].supabase.co/storage/v1/object/sign/media/...",
    "assetUrl": "https://[project].supabase.co/storage/v1/object/public/media/..."
  }
  ```

---

## 🔮 Future Integration Specifications

### 💡 Recommendation Engine API
*(Reserved for Phase 3)*
- **Endpoint**: `GET /api/recommendations`
- **Query Params**:
  - `limit`: number (default: 5)
  - `excludeIds`: comma-separated string of IDs
- **Routing Logic**: Fetches similar stories using PostgreSQL vector similarities or user-preference heuristics based on tags and rating weightings.

### 💸 Creator Pay-out Verification Webhook
*(Reserved for Phase 4)*
- **Endpoint**: `POST /api/payouts/verify`
- **Purpose**: Handles external payment provider callbacks to automatically process token ledger top-ups and creator wallet balances.
