# ⚽ Quick Start (5 minutes)

## 1️⃣ Create Supabase Database (2 min)

Go to **[supabase.com](https://supabase.com)** → Sign Up → Create Project

Once created:
- Go **Settings → API**
- Copy `Project URL` and `anon public` key
- Save these temporarily (you'll need them in 30 seconds)

## 2️⃣ Setup Database Tables (1 min)

In Supabase:
1. Click **SQL Editor** on the left
2. Click **New Query**
3. Copy all text from `database.sql` file in this folder
4. Paste it into the query editor
5. Click **Run** (top right)
6. ✅ Done! Tables are created

## 3️⃣ Create `.env.local` (30 sec)

In the project root folder, create a file called `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

Replace with the values you copied from Supabase.

## 4️⃣ Test Locally (Optional, 1 min)

```bash
npm run dev
```

Open http://localhost:3000 - should work! Add some players and try recording a game.

## 5️⃣ Deploy to Vercel (Free)

### a) Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### b) Deploy
1. Go to **[vercel.com](https://vercel.com)**
2. Click **Add New → Project**
3. Import your GitHub repository
4. Add Environment Variables (same as your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**
6. 🎉 Your app is live!

---

## That's it! 🎉

Your app is now live on Vercel with a free Supabase database. No charges, ever.

### What you can do now:
- ✅ Add up to 3+ players
- ✅ Record BO5 games
- ✅ View game history
- ✅ Check leaderboard with stats

### Free tier limits (way more than you'll need):
- **Supabase**: 500 MB storage, unlimited API calls
- **Vercel**: Deploy as much as you want

Enjoy! 👍
