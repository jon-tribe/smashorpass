import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cardId, limit = 100 } = req.query;

    if (cardId) {
      // Get stats for a specific card
      const { data, error } = await supabase
        .from('card_stats')
        .select('*')
        .eq('card_id', cardId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          return res.status(200).json({
            card_id: cardId,
            smash_count: 0,
            pass_count: 0,
            total_interactions: 0,
            smash_rate: 0
          });
        }
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch card stats' });
      }

      // Calculate smash rate
      const smashRate = data.total_interactions > 0 
        ? Math.round((data.smash_count / data.total_interactions) * 100) 
        : 0;

      return res.status(200).json({
        ...data,
        smash_rate: smashRate
      });

    } else {
      // Get stats for all cards (with pagination)
      const { data, error } = await supabase
        .from('card_stats')
        .select('*')
        .order('total_interactions', { ascending: false })
        .limit(parseInt(limit));

      if (error) {
        console.error('Supabase error:', error);
        return res.status(500).json({ error: 'Failed to fetch card stats' });
      }

      // Calculate smash rates for all cards
      const statsWithRates = data.map(stat => ({
        ...stat,
        smash_rate: stat.total_interactions > 0 
          ? Math.round((stat.smash_count / stat.total_interactions) * 100) 
          : 0
      }));

      return res.status(200).json({
        stats: statsWithRates,
        total_cards: statsWithRates.length
      });
    }

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
