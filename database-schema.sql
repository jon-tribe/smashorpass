-- Database schema for Smash or Pass card tracking
-- Run this in your Supabase SQL editor

-- Table to track individual card interactions
CREATE TABLE IF NOT EXISTS card_interactions (
    id BIGSERIAL PRIMARY KEY,
    card_id VARCHAR(100) NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('smash', 'pass')),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    user_ip INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table to store aggregated card statistics
CREATE TABLE IF NOT EXISTS card_stats (
    id BIGSERIAL PRIMARY KEY,
    card_id VARCHAR(100) UNIQUE NOT NULL,
    smash_count INTEGER DEFAULT 0,
    pass_count INTEGER DEFAULT 0,
    total_interactions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_card_interactions_card_id ON card_interactions(card_id);
CREATE INDEX IF NOT EXISTS idx_card_interactions_action ON card_interactions(action);
CREATE INDEX IF NOT EXISTS idx_card_interactions_timestamp ON card_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_card_stats_card_id ON card_stats(card_id);
CREATE INDEX IF NOT EXISTS idx_card_stats_total_interactions ON card_stats(total_interactions);

-- Function to automatically update card_stats when card_interactions change
CREATE OR REPLACE FUNCTION update_card_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Insert or update stats for the new interaction
        INSERT INTO card_stats (card_id, smash_count, pass_count, total_interactions, last_updated)
        VALUES (
            NEW.card_id,
            CASE WHEN NEW.action = 'smash' THEN 1 ELSE 0 END,
            CASE WHEN NEW.action = 'pass' THEN 1 ELSE 0 END,
            1,
            NOW()
        )
        ON CONFLICT (card_id)
        DO UPDATE SET
            smash_count = card_stats.smash_count + CASE WHEN NEW.action = 'smash' THEN 1 ELSE 0 END,
            pass_count = card_stats.pass_count + CASE WHEN NEW.action = 'pass' THEN 1 ELSE 0 END,
            total_interactions = card_stats.total_interactions + 1,
            last_updated = NOW();
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update stats
DROP TRIGGER IF EXISTS trigger_update_card_stats ON card_interactions;
CREATE TRIGGER trigger_update_card_stats
    AFTER INSERT ON card_interactions
    FOR EACH ROW
    EXECUTE FUNCTION update_card_stats();

-- Row Level Security (RLS) policies
ALTER TABLE card_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access to card_stats
CREATE POLICY "Allow public read access to card_stats" ON card_stats
    FOR SELECT USING (true);

-- Allow public insert access to card_interactions
CREATE POLICY "Allow public insert access to card_interactions" ON card_interactions
    FOR INSERT WITH CHECK (true);

-- Sample data insertion (optional - for testing)
-- INSERT INTO card_stats (card_id, smash_count, pass_count, total_interactions) VALUES
-- ('knight', 150, 50, 200),
-- ('hog-rider', 200, 30, 230),
-- ('wizard', 120, 80, 200),
-- ('giant', 180, 40, 220);
