# Football 1v1 Tracker - Setup Guide

This is a simple webapp to track BO5 football 1v1 games. It's completely free to host on Vercel with a Supabase database.

## Prerequisites

- Node.js 18+ installed
- A GitHub account (for Vercel deployment)
- 5 minutes of setup time

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Click "New Project"
3. Create a project with any name (e.g., "football-1v1")
4. Wait for it to be initialized (~2 minutes)
5. Once ready, go to **Settings → API** and copy:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 2: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste the entire contents of `database.sql` from this project
4. Click **Run**
5. You should see "Success" and the tables created

## Step 3: Setup Environment Variables

1. In the project root, create `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace with the values you copied from Supabase.

## Step 4: Run Locally (Optional)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` - you should see the app!

## Step 5: Deploy to Vercel (Free)

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. In "Environment Variables", add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click Deploy
7. Done! Your app is live 🎉

## Using the App

### Home Page
- See recent games
- Quick access to all features

### New Game
- Select two players
- Enter the game date
- Fill in the 5 match scores (first to 5 goals wins each match)
- The BO5 winner is automatically determined
- Save the game

### Games
- View all recorded games
- See match-by-match scores
- Displays the BO5 winner

### Standings (Leaderboard)
- Win/loss record for each player
- Win percentage
- Total goals scored and conceded
- Goal differential
- Sorted by most wins

### Players (Settings)
- Add new players
- All players appear in the game selector

## Tips

- You need at least 2 players to record a game
- Player names must be unique
- Each match ends when someone scores 5 goals
- BO5 is decided by whoever wins 3 matches first
- All data is automatically saved to your Supabase database

## Troubleshooting

**"Failed to fetch players"**
- Check that your environment variables are correct
- Make sure your Supabase project is active

**"Player already exists"**
- Player names must be unique
- Try a slightly different name

**Database not showing data**
- Ensure the SQL schema was run successfully
- Check Supabase SQL Editor for any errors

## Customization

The app uses a dark theme with slate colors. To customize:
- Colors are in the Tailwind classes throughout the files
- Change the emoji or app name in `page.tsx` and headers
- Modify the leaderboard columns in `app/leaderboard/page.tsx`

## Support

For issues with:
- **Supabase**: Check [supabase.com/docs](https://supabase.com/docs)
- **Vercel**: Check [vercel.com/docs](https://vercel.com/docs)
- **Next.js**: Check [nextjs.org/docs](https://nextjs.org/docs)
