# ⚽ Football 1v1 Tracker

A simple, free web app to track your best-of-5 (BO5) football 1v1 games, scores, and standings.

## 🚀 Quick Start (5 minutes)

→ **[READ THIS FIRST](./QUICK_START.md)** ← All setup instructions in one place.

## ✨ Features

- 📝 **Record Games**: Enter BO5 match scores
- 📊 **Leaderboard**: View standings with win rates and goal stats
- 👥 **Player Management**: Add/manage players
- 📈 **Game History**: Browse all recorded games
- 🎨 **Dark UI**: Clean, modern interface
- 💰 **Completely Free**: Vercel + Supabase free tiers

## 📋 Documentation

1. **[QUICK_START.md](./QUICK_START.md)** - 5-minute setup (START HERE)
2. **[SETUP.md](./SETUP.md)** - Detailed instructions + troubleshooting
3. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Step-by-step deployment
4. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Full project overview

## 💻 Tech Stack

- **Frontend**: React 19 + Next.js 15 + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

## 🎮 How to Use

### 1. Setup (first time only)
```bash
# Follow QUICK_START.md to:
# - Create Supabase project
# - Setup database
# - Deploy to Vercel
```

### 2. Add Players
Go to **Players** → Add your 3 friends by name

### 3. Record Games
Go to **New Game** → Select 2 players → Enter match scores → Save

### 4. Check Standings
Go to **Standings** → View leaderboard with stats

## 📊 What Gets Tracked

Per player:
- ✅ BO5 wins/losses
- ✅ Win percentage
- ✅ Total goals scored/conceded
- ✅ Goal differential
- ✅ Game history

## 🆓 Cost

**$0 forever** (at your scale):
- Vercel: Free tier
- Supabase: Free tier (500 MB database, unlimited API)
- No credit card required

## 🛠 Development

### Run locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### Deploy updates
```bash
git add .
git commit -m "Your changes"
git push origin main
# Vercel auto-deploys!
```

## 📁 Project Structure

```
app/
├── page.tsx           # Home/Dashboard
├── new-game/          # Record game
├── games/             # Game history
├── leaderboard/       # Standings
├── settings/          # Player management
└── api/               # Backend routes
    ├── players/       # Player API
    ├── games/         # Games API
    └── stats/         # Stats API

lib/
└── supabase.ts        # Database client

database.sql          # Schema
```

## ❓ Need Help?

1. Read **SETUP.md** - Most issues are covered
2. Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)
3. Check Vercel docs: [vercel.com/docs](https://vercel.com/docs)

## 🎉 Let's Go!

Ready to deploy? Open **[QUICK_START.md](./QUICK_START.md)** now!
