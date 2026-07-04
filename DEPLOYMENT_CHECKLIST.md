# 📋 Deployment Checklist

Use this checklist to deploy your Football 1v1 tracker to production.

## Pre-Deployment

- [ ] Read `QUICK_START.md`
- [ ] Understand the 5 deployment steps
- [ ] Have a GitHub account ready
- [ ] Have 5 free minutes

## Step 1: Supabase Setup

- [ ] Create Supabase account at [supabase.com](https://supabase.com)
- [ ] Create new project
- [ ] Wait for initialization (2 min)
- [ ] Go to **Settings → API**
- [ ] Copy `Project URL` to `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copy `anon public` key to `.env.local` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Database Setup

- [ ] Go to **SQL Editor** in Supabase
- [ ] Click **New Query**
- [ ] Copy all text from `database.sql`
- [ ] Paste into query editor
- [ ] Click **Run**
- [ ] Verify success message appears
- [ ] Refresh page - see two tables (players, games) in left sidebar

## Step 3: Create `.env.local`

- [ ] Create file `.env.local` in project root
- [ ] Add:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_value
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
  ```
- [ ] Replace with actual values from Supabase

## Step 4: Test Locally (Optional but Recommended)

```bash
npm run dev
```

- [ ] Open http://localhost:3000
- [ ] Go to Players page
- [ ] Add 2-3 players
- [ ] Go to New Game
- [ ] Try creating a game
- [ ] Check leaderboard
- [ ] If all works, continue to Step 5

## Step 5: Deploy to Vercel

### Push to GitHub

```bash
git add .
git commit -m "Initial commit: Football 1v1 tracker"
git push origin main
```

- [ ] Code pushed to GitHub
- [ ] Check GitHub repo shows all files

### Deploy on Vercel

- [ ] Go to [vercel.com](https://vercel.com)
- [ ] Sign in with GitHub
- [ ] Click **Add New → Project**
- [ ] Find your `football-tracker` repo
- [ ] Click **Import**
- [ ] **Environment Variables** section:
  - [ ] Add `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
  - [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
- [ ] Click **Deploy**
- [ ] Wait 2-3 minutes
- [ ] Click **Visit** when ready
- [ ] ✅ Your app is live!

## Post-Deployment

- [ ] Visit your live app URL
- [ ] Add a player
- [ ] Create a test game
- [ ] Check leaderboard
- [ ] Check that data persists (refresh page)
- [ ] Share the URL with your friends

## After Deployment

- [ ] You can still push updates with `git push`
- [ ] Vercel auto-deploys on every push
- [ ] Your data in Supabase persists forever
- [ ] Everything is free!

## Troubleshooting During Deployment

### "Missing environment variables"
- [ ] Check Vercel project settings
- [ ] Verify both env vars are added
- [ ] Redeploy from Vercel dashboard

### "Failed to fetch players"
- [ ] Check Supabase tables were created
- [ ] Verify database.sql ran successfully
- [ ] Check env vars are correct in Vercel

### "supabaseUrl is required"
- [ ] Same as above - env vars missing

## You're Done! 🎉

Your app is now:
- ✅ Live on the internet
- ✅ Using a real database
- ✅ Completely free
- ✅ Ready for your friends to use

Share the URL and start tracking your games!

## Future Updates

To make changes:
1. Edit code locally
2. Run `npm run dev` to test
3. Commit changes: `git commit -m "..."`
4. Push: `git push`
5. Vercel auto-deploys!

No manual deployment needed - it's automatic.
