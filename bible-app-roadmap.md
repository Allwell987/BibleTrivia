# Bible Trivia App — Implementation Roadmap

> Build from top to bottom. Each phase depends on the one before it.

---

## Legend

| Tag | Area |
|-----|------|
| `[Backend]` | Server, database, APIs |
| `[Frontend]` | UI, screens, components |
| `[Content]` | Questions, insights, writing |
| `[AI]` | Automation, generation, personalization |
| `[Monetization]` | Revenue, payments, IAP |
| `[Social]` | Multiplayer, sharing, community |

---

## Phase 1 — Foundation
### Core infrastructure & MVP
> Build this first. Nothing else works without it.

---

### 1.1 User authentication system
`[Backend]`

Sign up, login, password reset, and social auth. Every other feature depends on knowing who the user is.

**Sub-tasks:**
- Email + password registration
- Google / Apple OAuth sign-in
- JWT session management
- Profile storage: name, avatar, preferences

**Effort:** 1–2 weeks · Stack: Supabase Auth or Firebase Auth

---

### 1.2 Question & content database
`[Content]` `[Backend]`

The entire app depends on a well-structured question database. Design this schema carefully from day one — it is expensive to migrate later.

**Sub-tasks:**
- Questions table: text, options, correct answer, difficulty, era, Bible book
- Insights table: linked teaching per question
- Reflections table: one application prompt per question
- Tags: era (Patriarchs, Kings, etc.), testament, difficulty level
- Seed with 500+ manually written questions to launch

**Effort:** 2–3 weeks · Stack: PostgreSQL / Supabase

---

### 1.3 Daily challenge engine
`[Backend]` `[Frontend]`

The core loop. Serve 3–5 questions per day, record answers, show insights after each question, and track completion.

**Sub-tasks:**
- Question selection algorithm (no repeats for 30 days)
- Answer submission + correct/incorrect feedback UI
- Insight card reveal after each answer
- Daily completion state — can only complete once per day
- Push notification: "Your daily challenge is ready"

**Effort:** 2 weeks · Stack: REST API + React Native or Flutter

---

### 1.4 Streak tracking system
`[Backend]` `[Frontend]`

Track consecutive daily completions. Map streaks to named Biblical milestones, not generic day counters.

**Sub-tasks:**
- Streak counter: increments on daily challenge completion
- Streak break detection (missed day resets or freezes)
- Milestone names: 7 days = "Days of Creation", 40 = "Wilderness Journey", 120 = "Acts Church Builder"
- Streak freeze token: 1 free miss per week for Pro users

**Effort:** 1 week

---

### 1.5 Basic onboarding flow
`[Frontend]`

First impressions determine retention. A clean onboarding that gets users to their first question in under 2 minutes.

**Sub-tasks:**
- Welcome screen + app value proposition
- Knowledge level selector: Beginner, Intermediate, Advanced
- Notification permission request
- First challenge auto-starts immediately after signup

**Effort:** 1 week

---

## Phase 2 — Engagement
### Journey Mode & progression system
> What turns a quiz app into a spiritual habit.

---

### 2.1 Journey Mode — era progression map
`[Frontend]` `[Backend]`

The visual spine of the app. Users see their position in the full Bible storyline and feel genuine progress toward something meaningful.

**Sub-tasks:**
- Era map UI: Creation → Patriarchs → Egypt → Kings → Prophets → Jesus → Early Church
- Era unlock logic: complete N questions in current era to advance
- Lock/unlock animation when a new era opens
- Era summary card: brief overview when unlocked
- User progress stored server-side, not just locally

**Effort:** 2–3 weeks

---

### 2.2 Character & book unlock system
`[Backend]` `[Frontend]`

Characters (Moses, David, Paul) and Bible books unlock as users progress, giving them collectibles that feel spiritually earned.

**Sub-tasks:**
- Character cards: portrait, key verse, brief bio, fun fact
- Bible book cards: unlock after completing that book's questions
- Collection screen showing earned vs locked items
- Share unlocked character to social media

**Effort:** 1–2 weeks

---

### 2.3 Adaptive difficulty engine
`[Backend]`

Automatically adjust question difficulty based on user performance. Keeps beginners from quitting and experts from getting bored.

**Sub-tasks:**
- Track per-user accuracy per difficulty tier
- 3-tier system: Seeker (easy), Disciple (medium), Scholar (hard)
- Auto-promote: 80%+ accuracy for 3 sessions moves user to harder tier
- Auto-demote: below 40% accuracy moves user to easier tier

**Effort:** 1 week

---

### 2.4 "Did You Know?" moment engine
`[Content]` `[Frontend]`

Surprising, lesser-known Bible facts shown after each quiz. These are your most shareable moments — the thing users screenshot and send to friends.

**Sub-tasks:**
- Facts database: 200+ entries, linked to Bible books and characters
- Post-quiz reveal card with one-tap share button
- Share as auto-generated image card

**Effort:** 1 week (engineering) + 2 weeks writing 200+ facts

---

### 2.5 Reflection & application prompts
`[Content]` `[Frontend]`

One personal application question after each daily challenge. This is what elevates the app from trivia to discipleship tool.

**Sub-tasks:**
- Reflection prompt shown after all questions are answered
- Optional journaling input (text saved to user profile)
- Review past reflections screen

**Effort:** 1 week (engineering) + ongoing content writing

---

## Phase 3 — Intelligence
### AI content generation
> The system that makes the app timeless.

---

### 3.1 AI question generation pipeline
`[AI]` `[Backend]`

Use an LLM to generate new questions nightly, reviewed before publishing. Never run out of fresh content.

**Sub-tasks:**
- Nightly cron job: generate 20 new questions per era
- AI writes question + 4 options + correct answer + insight
- Admin review queue: approve, reject, or edit before publishing
- Duplicate detection: block near-identical questions
- Quality scoring: flag low-confidence outputs for human review

**Effort:** 2 weeks · Stack: Claude API + admin dashboard

---

### 3.2 Personalized content feed
`[AI]` `[Backend]`

Surface questions the user is more likely to find engaging based on their history, weak areas, and current Journey era.

**Sub-tasks:**
- Track which topics each user answers correctly vs struggles with
- Weighted selection: 40% era-based, 30% weak areas, 30% discovery
- Avoid repeating questions seen in the last 60 days

**Effort:** 1–2 weeks

---

### 3.3 Weekly themed content packs
`[AI]` `[Content]`

Rotate themed mini-series weekly — "Week of David," "Paul's Letters," "Women of the Bible." Adds freshness without manual work.

**Sub-tasks:**
- AI generates themed 7-question series with a banner
- Weekly theme shown prominently on home screen
- Completion badge for finishing the weekly theme

**Effort:** 1 week (engineering) — content is AI-generated

---

## Phase 4 — Social & Growth
### Battle mode & community features
> The viral engine. Build only after the core loop is solid.

---

### 4.1 Friends challenge system
`[Social]` `[Backend]`

1-on-1 async Bible trivia battles. Send a challenge link to a friend; they have 24 hours to beat your score.

**Sub-tasks:**
- Challenge creation: pick topic, set 5 questions
- Shareable link that opens the challenge in-app
- Score comparison reveal after both players complete
- Push notification: "Your friend challenged you!"

**Effort:** 2 weeks

---

### 4.2 Weekly leaderboard & battle mode
`[Social]` `[Backend]`

Weekly themed showdowns — everyone answers the same 10 questions, ranked by score and speed. Resets every Monday.

**Sub-tasks:**
- Weekly question set identical for all users
- Global leaderboard: top 100
- Friends leaderboard: rank among people you follow
- Church / group leaderboard
- Top 3 winners earn a special badge that week

**Effort:** 2–3 weeks

---

### 4.3 Church groups & community spaces
`[Social]` `[Backend]`

Create or join a church group. Compete as a unit, track collective streaks, and share leaderboards. Also your B2B distribution channel.

**Sub-tasks:**
- Group creation with invite code
- Group leaderboard: members ranked by weekly score
- Church vs Church mode: aggregate scores, weekly matchup
- Pastor/admin dashboard: see member engagement stats

**Effort:** 3 weeks

---

### 4.4 Shareable result cards
`[Social]` `[Frontend]`

Auto-generate image cards users can share to WhatsApp, Instagram, and Twitter — your cheapest and most effective growth channel.

**Sub-tasks:**
- Score card: "I scored 5/5 on the Gospels Showdown"
- Did You Know card: shareable fact image
- Streak card: "Day 40 — Wilderness Journey Complete"
- Generate as PNG client-side (html2canvas) or server-side

**Effort:** 1 week

---

## Phase 5 — Monetization
### Revenue & offline features
> Build a sustainable business, not just a free app.

---

### 5.1 Offline content packs (in-app purchase)
`[Monetization]` `[Backend]`

Downloadable packs users can study without data — critical for Nigeria and other bandwidth-constrained markets. Also your first clear revenue model.

**Sub-tasks:**
- Pack structure: Genesis (free), Life of Jesus, Paul's Missions, Full Bible
- Download manager with progress bar, pause/resume
- Offline mode detection: serve from local DB when no connection
- In-app purchase via Google Play / App Store
- Pack pricing: ₦800–₦2,500 per pack

**Effort:** 3 weeks · Stack: SQLite local DB + RevenueCat for IAP

---

### 5.2 Pro subscription tier
`[Monetization]`

Monthly or annual subscription that unlocks all packs, removes limits, and adds power-user features.

**Sub-tasks:**
- Pro benefits: all offline packs, streak freeze, detailed stats, ad-free
- Paywall placement: after first 7-day streak or when accessing locked content
- Annual discount to maximize lifetime value
- Church plan: flat rate for up to 50 members

**Effort:** 1 week (mostly RevenueCat + paywall UI)

---

### 5.3 Analytics & retention dashboard
`[Backend]` `[Monetization]`

You cannot improve what you do not measure. Track the metrics that predict long-term retention and revenue.

**Sub-tasks:**
- Daily, Weekly, Monthly active users
- D1, D7, D30 retention rates
- Streak distribution: how many users are on day 3 vs day 40
- Question accuracy by topic (reveals content gaps)
- Conversion rate: free → Pro
- Revenue: MRR, ARR, LTV by cohort

**Effort:** 1–2 weeks · Stack: Mixpanel / PostHog + custom admin dashboard

---

## Phase 6 — Polish & Scale
### Infrastructure, performance & long-term features
> Do last. Premature optimization is the enemy.

---

### 6.1 Push notification strategy
`[Backend]` `[Frontend]`

Well-timed, non-spammy push notifications are the single highest-leverage retention tool. Personalize by timezone and behaviour.

**Sub-tasks:**
- Daily reminder at user's preferred time
- Streak at-risk alert: "Don't lose your 14-day streak!"
- Challenge received: "John challenged you to a duel"
- Weekly battle launch: "The Gospels Showdown is live"

**Effort:** 1 week · Stack: Firebase Cloud Messaging

---

### 6.2 Accessibility & localization
`[Frontend]`

To reach the broadest Nigerian and African market, support multiple languages and ensure the app works on low-end Android devices.

**Sub-tasks:**
- Yoruba, Igbo, Pidgin English language packs
- RTL language support framework for future Arabic
- Minimum target: Android 8.0+, 2GB RAM devices
- Low-data mode: compress images, defer non-essential loads

**Effort:** 3–4 weeks per language

---

### 6.3 Admin content management system
`[Backend]` `[Content]`

As AI generates more content, you need a fast CMS to review and manage thousands of questions without touching code.

**Sub-tasks:**
- Question review queue with approve, reject, or edit actions
- Bulk import via CSV or Google Sheets
- Flag system for user-reported bad questions
- Content scheduling: release questions at specific dates

**Effort:** 2 weeks

---

### 6.4 Scalable backend infrastructure
`[Backend]`

Prepare for growth without rebuilding. Set up caching, CDN, and database indexing before you hit 10,000 users, not after.

**Sub-tasks:**
- Redis caching for daily question sets (reduce DB reads by 90%)
- CDN for all static assets: images, audio
- Database indexes on user_id, era, difficulty, created_at
- Rate limiting on all API endpoints
- Error monitoring: Sentry

**Effort:** 1–2 weeks · Stack: Redis + Cloudflare CDN

---

## Key decisions to get right from day one

1. **Question database schema** — the most important architectural decision in the project. Design it so questions can be tagged by era, Bible book, difficulty, and character from day one. Changing this later is expensive.

2. **Offline packs** — strongest early monetization play for the Nigerian market. RevenueCat handles both Google Play and App Store billing in one integration.

3. **AI review queue** — never publish AI-generated questions without human review. One theologically incorrect question can seriously damage trust in a faith-based app.

4. **Build phases sequentially** — do not start Phase 4 (social/viral) before Phase 2 (journey mode) is solid. Viral features only work when the core loop is engaging enough to share.
