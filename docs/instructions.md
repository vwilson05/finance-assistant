```
# ✅ Implementation Plan: Make Each User Flow Actually Work

This document outlines how to fully implement and test each major user flow in the app. The scaffolding is done (tables, endpoints, pages exist), but none of the functionality is fully wired or working yet. The goal is to **complete, verify, and lock down** each flow before moving on to the next.

---

## 🔐 1. User Signup, Authentication, and OpenAI API Key Storage

### Objectives:
- User can sign up and log in securely
- User can submit and store OpenAI API key
- System uses that key in GPT API calls for that session

### Action Items:
1. Finalize authentication using **NextAuth.js** or **Supabase Auth**
   - Use email + password or social login
   - Store authenticated user ID in `session.user.id`

2. Ensure `users` table stores:
   - `id`, `email`, `hashed_password`, `openai_api_key`

3. On successful login:
   - Fetch `openai_api_key` from DB
   - Store in `session` or securely cache per request

4. In GPT call wrapper (e.g., `lib/gptAgent.ts`):
   - Inject correct user-specific OpenAI key into `headers['Authorization']`
   - Throw error if key is missing

### Tests:
- Sign up → login → hit GPT API → ✅ success
- Submit bad OpenAI key → ✅ catch + display error
- User logs in again later → ✅ key loads automatically

**✅ Must work before moving to profile setup**

---

## 👤 2. Profile Setup: Collecting and Saving Structured Financial Info

### Objectives:
- User can enter and save profile information via the UI
- Profile data is stored correctly in SQLite
- App retrieves and displays user-specific profile data on page load

### Action Items:
1. Profile Form Fields:
   - Age, income, expenses, household size, location
   - Risk tolerance dropdown
   - Add/remove assets and liabilities

2. Submit button:
   - POSTs data to `/api/profile/update`
   - Creates or updates `user_profile` row with matching `user_id`

3. On page load:
   - GET `/api/profile/get` using session `user.id`
   - Pre-fill form with current values

4. Add asset/liability list management to form
   - Dynamic add/remove rows in frontend
   - Save as separate rows in `assets` and `liabilities` tables

### Tests:
- Fill profile → save → ✅ saved in DB
- Reload profile page → ✅ all values load correctly
- Submit partial/invalid form → ✅ validation error

**✅ Must work before allowing plan building or goal setup**

---

## 🎯 3. Goal Setup: Capturing, Storing, and Managing Goals

### Objectives:
- Users can create financial goals
- Goals are correctly saved and displayed in dashboard
- Goals are tied to user ID

### Action Items:
1. Goal Creation Form:
   - Name, category (retirement, home, etc.)
   - Target amount, target date or duration
   - Priority (low/medium/high)

2. Backend:
   - POST to `/api/goals/add`
   - Store in `goals` table with `user_id`

3. Display:
   - GET `/api/goals/list`
   - Show active goals on dashboard and goals page
   - Allow editing/deleting goals

### Tests:
- Create → View → Edit → Delete goals → ✅ all work with expected data
- Two users cannot see each other’s goals → ✅ user scoping enforced

**✅ Must work before GPT can generate a plan**

---

## 📊 4. Building Financial Plans with GPT-4

### Objectives:
- User can ask GPT to generate a plan for a specific goal
- GPT receives user profile + goal + RAG context
- System saves plan (structured + narrative) on confirmation

### Action Items:
1. GPT Wrapper (`lib/gptAgent.ts`)
   - Load user’s profile and goal by goal ID
   - RAG: query Chroma for similar past plans or reflections
   - Construct GPT prompt and call OpenAI API using user’s key

2. UI:
   - Let user choose goal → describe request
   - Display GPT plan + summary
   - On “Save Plan”:
     - Store to `goal_plans` (structured) and Chroma (narrative + metadata)

3. Add GPT function calling:
   - Expose `/simulate_plan` or similar to let GPT call APIs directly

### Tests:
- Ask for a plan → GPT returns a valid plan → ✅ summary + monthly contribution calculated
- Save plan → ✅ appears in DB and shows on dashboard
- Ask GPT again for same goal → ✅ RAG includes past plans

**✅ Must be stable before enabling progress tracking**

---

## 📈 5. Progress Tracking, Plan Adjustments, and Nudges

### Objectives:
- User can track contributions toward each goal
- App compares plan vs actual and nudges user accordingly
- GPT can summarize and suggest updates

### Action Items:
1. Create `/goal/{id}` view:
   - Show goal, plan, progress bar
   - Log contributions (date + amount)

2. Track progress in `goal_progress` table
   - GET total actual vs planned
   - Calculate on-track/off-track status

3. Create weekly summarizer (cron or manual button for now)
   - For each goal: compare actual vs required
   - Use GPT to summarize and suggest nudges
   - Save summary in Chroma and display in dashboard

### Tests:
- Log a $500 deposit toward a $5000 goal → ✅ progress % correct
- Fall behind → ✅ GPT suggests extending timeline or adjusting savings
- GPT summaries show correct insight → ✅ injected into future chats

**✅ Must be functional before macro triggers are added**

---

## 🌐 6. Macro Factor Detection (Future Step)

### Objectives:
- Detect macro events (e.g., rate hikes, inflation)
- Notify user + give GPT context to adjust plans

### Action Items:
1. Start with static JSON or news API feed
   - Store in `macro_events` table

2. On event detection:
   - Call GPT: “Fed raised interest rates. Does this impact any of user’s goals?”
   - Use profile + goals to create actionable analysis

3. Display macro events in dashboard
   - Offer “Recalculate Plan” button per goal

4. Save macro-triggered GPT responses to Chroma for memory

### Tests:
- Trigger macro → GPT explains impact → ✅ suggestions appear
- User accepts → plan updates accordingly → ✅ reflected in SQLite

**✅ Future functionality — optional for initial product**

---

# 🎉 Final Notes

**Key Rule:** DO NOT move forward to the next flow until the previous step is working and testable via UI and DB.

This order should be followed strictly:
1. ✅ Auth
2. ✅ Profile
3. ✅ Goals
4. ✅ GPT plans
5. ✅ Progress + tracking
6. 🚧 Macro triggers (optional)

Use clear functional tests at each stage. Catch errors, validate DB writes, confirm user-specific scope. By the end, the system should feel like a real intelligent financial advisor, not just a GPT front-end.

---
END OF INSTRUCTION
```