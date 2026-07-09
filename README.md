# 🌟 Bextro (Move in Silence, Let Your Progress Speak)

Bextro is a gamified self-improvement and progress-tracking platform where users don't just plan their goals—they execute them, upload proof, earn points, and build streaks. Built on the philosophy of **"You vs You"** and **"Progress portfolio of life"**, Bextro maintains a high standard of privacy: users are identified by what they do and achieve, rather than who they are.

---

## 📌 Core Philosophy & Flow
1. **Set Goals**: Create an account, list interests, and specify bucket lists.
2. **Generate Challenges**: The Challenge Engine automatically structures daily, weekly, or monthly challenges customized to your profile.
3. **Take Action**: Complete tasks within specific timelines.
4. **Submit Proof**: Upload an image, video, blog post, or link as verifiable proof of completion.
5. **Earn Points & Maintain Streaks**: Build momentum, raise your level, and unlock badges.
6. **Move in Silence**: Social connections are built on shared progress and actions rather than personal exposure.

---

## 🏗️ System Architecture & Codebase Layout

Bextro is built as a decoupled Monorepo containing a React-based frontend and an Express/Node.js-based backend.

```
BexTro-main/
├── backend/                  # Node.js + Express + MongoDB Server
│   ├── config/               # Database Connection configs
│   ├── controllers/          # Request handlers (auth, posts, challenges, chats)
│   ├── middleware/           # Auth guard, file upload handlers
│   ├── models/               # Mongoose schemas (User, Post, Challenge, etc.)
│   ├── routes/               # API Router endpoints
│   ├── services/             # Helper business logic
│   ├── socket/               # Real-time WebSocket connection engine
│   ├── index.js              # Server entry point
│   ├── package.json          # Backend manifest & scripts
│   └── .env                  # Environment secrets configuration
├── frontend/                 # Vite + React + Tailwind + Redux Client
│   ├── src/
│   │   ├── api/              # API Client calls
│   │   ├── components/       # UI Modular components (common, features, layout)
│   │   ├── hooks/            # Custom React Hooks
│   │   ├── pages/            # View components (Feed, Profile, Chat, Dashboard)
│   │   ├── redux/            # Redux Slices & Store Configuration
│   │   ├── index.css         # Main application styles
│   │   ├── main.jsx          # React app entry point
│   │   └── App.jsx           # App routing & Shell layout
│   ├── package.json          # Frontend manifest & scripts
│   └── vite.config.js        # Vite compilation rules
└── README.md                 # Project-wide documentation (This file)
```

---

## 🎨 Frontend Architecture, UI/UX Details & Onboarding "Story Form"

Bextro's client is engineered for high-engagement gamified workflows, using advanced CSS styling and state-of-the-art animations to create a premium, cohesive app experience.

### 🖌️ Visual Design System & Aesthetics
* **Theme Engine**: Integrates a dynamic multi-theme system matching user-curated palettes (managed via Redux and React context).
* **Glassmorphism**: Leverages frosted cards (`backdrop-blur-md` and `bg-white/40`) with fine borders (`border-white/60`) for modern, depth-focused light/dark visual models.
* **Micro-Animations**:
  * **GSAP (GreenSock)**: Powers the intro splash animation on load, handling brand text movements and syncing with celebratory particle effects via `react-confetti`.
  * **Framer Motion**: Standardizes seamless page switches, tab changes, dynamic card slide-ins, and interactive hover animations on gamified items.

---

### 📖 The Onboarding "Story Form" Journey
To prompt self-reflection and separate Bextro from standard dopamine-inducing social networks, registration directs the user through an immersive onboarding story:

1. **Step 1: The Pause (`HoldUpMessage`)**
   Upon signing up, users see the [HoldUpMessage.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/components/features/welcome/HoldUpMessage.jsx) screen. It forces a mandatory 5-second countdown to break the mindless scrolling cycle.
2. **Step 2: The Reset (`RestartPrompt`)**
   Prompts users with the [RestartPrompt.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/components/features/welcome/RestartPrompt.jsx) screen, asking them to evaluate their past productivity and actively commit to building new discipline.
3. **Step 3: Choosing Directions (`InterestsScreen`)**
   Users select their growth interests (Health, Learning, Creative, Adventure, etc.) in the [InterestsScreen.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/components/features/welcome/interestsScreen.jsx) component, which registers their starting seeds in the database.
4. **Step 4: The Initiation (`IntroToChallenges`)**
   Loads the [IntroToChallenges.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/pages/IntroToChallenges.jsx) screen, showing an encouraging splash screen ("Your Journey Starts Now!") before displaying the core challenge board.

---

### 🖥️ Key UI Pages & Components
* **Command Dashboard ([Dashboard.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/pages/Dashboard.jsx))**: Houses the current challenge list, interactive streak trackers, custom bucket-list tasks, and quick actions to upload completion proofs.
* **Progress Portfolio ([Profile.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/pages/Profile.jsx))**: Serves as the user's permanent profile. Includes XP progress bars, level-up milestones, earned badges, and graphical stats (accepted vs completed vs skipped challenges).
* **Proof Feed ([FeedPage.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/pages/FeedPage.jsx))**: Displays a feed of proof posts (images, videos, blogs) by users in the network, supporting likes, comments, and visibility levels (Public/Private).
* **Real-Time Network Hub ([Chat.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/pages/Chat.jsx) & [Notifications.jsx](file:///Users/krishna/Downloads/BexTro-main/frontend/src/pages/Notifications.jsx))**: Powered by **Socket.IO** to handle instant messaging, active user presence states, and real-time push alerts (likes, comments, messages).

---

## 🗄️ Database Schema & Data Models (Mongoose)

Bextro operates on a relational-like schema powered by MongoDB and Mongoose:

### 1. `User` Schema ([userModel.js](file:///Users/krishna/Downloads/BexTro-main/backend/models/userModel.js))
Tracks user authentication, profiles, social connections, gamification, and ongoing challenges.
* **Credentials & Profile**: `username`, `password`, `fullName`, `profilePhoto`, `gender`.
* **Gamification**: `totalXP`, `level`, `currentStreak`, `longestStreak`, `badges`.
* **Goal Tracking**: `bucketList` (Text, Achieved boolean).
* **Accepted Challenges**: Array of `{ challengeText, acceptedAt, status ("active", "completed", "skipped", "abandoned"), timelineDays, proofPostId }`.
* **Social Connections**: `followers`, `following`, `connections` (mutuals), `sentRequests`, `receivedRequests`.

### 2. `Challenge` Schema ([Challenge.js](file:///Users/krishna/Downloads/BexTro-main/backend/models/Challenge.js))
Stores challenges generated by AI or curated by admins/users.
* **Details**: `text`, `objective`, `motivation`, `benefits`.
* **Metadata**: `category`, `difficulty`, `source` (`"AI" | "User" | "Curated"`), `createdFromInterests`.
* **Analytics**: `usedByCount`, `completedByCount`.

### 3. `Post` Schema ([Post.js](file:///Users/krishna/Downloads/BexTro-main/backend/models/Post.js))
Acts as the verifiable proof that a user completed a challenge.
* **Associations**: `user`, `challengeId`, `challengeText`.
* **Proof Elements**: `proofType` (`"image" | "video" | "blog" | "link"`), `proofUrl`, `description`, `timelineTaken`.
* **Social Interactions**: `likes` (Users list), `comments` (User, text, timestamp), `visibility` (`"public" | "private"`).

---

## ⚙️ Setup & Installation

### Prerequisites
* **Node.js**: v18.x or above (Fully compatible with Node v26)
* **MongoDB**: A running MongoDB instance locally or on MongoDB Atlas.

---

### 1. Backend Setup

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root of the `backend/` folder:
   ```env
   PORT=5005
   MONGO_URI=mongodb://localhost:27017/bextro    # Or Atlas URL
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend in development (auto-reload) mode:
   ```bash
   npm run dev
   ```
   *The backend should start and output: `Server running on port 5005` & `MongoDB connected successfully`.*

---

### 2. Frontend Setup

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development client:
   ```bash
   npm run dev
   ```
   *By default, Vite will start the frontend on `http://localhost:5173` or `http://localhost:5174`.*

---

## ⚠️ Important Troubleshooting & Compatibility Notes

### Node.js v26+ Buffer Compatibility Patch
If running Bextro under newer Node.js releases (such as Node v26.x), you may encounter a start-up crash originating from the legacy `buffer-equal-constant-time` dependency in `jsonwebtoken`:

```text
TypeError: Cannot read properties of undefined (reading 'prototype')
    at Object.<anonymous> (.../node_modules/buffer-equal-constant-time/index.js)
```

**What happened:** 
Node.js v26 deprecated and removed the legacy global `SlowBuffer` constructor on the `buffer` module. The old package tries to access `SlowBuffer.prototype.equal` on load, triggering a `TypeError`.

**Resolution:**
The project includes a patch in the `node_modules` file [buffer-equal-constant-time/index.js](file:///Users/krishna/Downloads/BexTro-main/backend/node_modules/buffer-equal-constant-time/index.js#L30-L42) checking for the existence of `SlowBuffer` before attempting to access its prototype:
```javascript
// Safely check if SlowBuffer exists in newer Node versions
var origSlowBufEqual = SlowBuffer && SlowBuffer.prototype ? SlowBuffer.prototype.equal : undefined;

bufferEq.install = function() {
  Buffer.prototype.equal = function equal(that) {
    return bufferEq(this, that);
  };
  if (SlowBuffer && SlowBuffer.prototype) {
    SlowBuffer.prototype.equal = Buffer.prototype.equal;
  }
};
```

### Nodemon Permission Denied
If executing `npm run dev` yields `sh: .../nodemon: Permission denied` (Exit code `126`), grant execution rights to local nodemon binary:
```bash
chmod +x node_modules/.bin/nodemon
```
