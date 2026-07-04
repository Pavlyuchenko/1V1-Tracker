-- Create players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Create games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  player2_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bo5_winner_id UUID NOT NULL REFERENCES players(id),
  matches JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX games_player1_id ON games(player1_id);
CREATE INDEX games_player2_id ON games(player2_id);
CREATE INDEX games_date ON games(date);
CREATE INDEX games_bo5_winner_id ON games(bo5_winner_id);

-- Enable Row Level Security (optional, for production)
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for simple use)
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Players can be created by everyone" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Players can be updated by everyone" ON players FOR UPDATE USING (true);
CREATE POLICY "Players can be deleted by everyone" ON players FOR DELETE USING (true);

CREATE POLICY "Games are viewable by everyone" ON games FOR SELECT USING (true);
CREATE POLICY "Games can be created by everyone" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Games can be updated by everyone" ON games FOR UPDATE USING (true);
CREATE POLICY "Games can be deleted by everyone" ON games FOR DELETE USING (true);
