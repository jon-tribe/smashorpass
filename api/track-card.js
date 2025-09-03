import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cardId, action, timestamp } = req.body;

    // Validate required fields
    if (!cardId || !action) {
      return res.status(400).json({ error: 'Missing required fields: cardId and action' });
    }

    // Validate action type
    if (!['smash', 'pass'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Must be "smash" or "pass"' });
    }

    // Record the card interaction
    const { data, error } = await supabase
      .from('card_interactions')
      .insert([
        {
          card_id: cardId,
          action: action,
          timestamp: timestamp || new Date().toISOString(),
          user_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
          user_agent: req.headers['user-agent']
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to record interaction' });
    }

    // Get updated statistics for this card
    const { data: stats, error: statsError } = await supabase
      .from('card_stats')
      .select('*')
      .eq('card_id', cardId)
      .single();

    if (statsError && statsError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching stats:', statsError);
    }

    // Update or create card statistics
    if (stats) {
      // Update existing stats
      const updateData = {
        smash_count: action === 'smash' ? stats.smash_count + 1 : stats.smash_count,
        pass_count: action === 'pass' ? stats.pass_count + 1 : stats.pass_count,
        total_interactions: stats.total_interactions + 1,
        last_updated: new Date().toISOString()
      };

      const { error: updateError } = await supabase
        .from('card_stats')
        .update(updateData)
        .eq('card_id', cardId);

      if (updateError) {
        console.error('Error updating stats:', updateError);
      }
    } else {
      // Create new stats record
      const newStats = {
        card_id: cardId,
        smash_count: action === 'smash' ? 1 : 0,
        pass_count: action === 'pass' ? 1 : 0,
        total_interactions: 1,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      const { error: createError } = await supabase
        .from('card_stats')
        .insert([newStats]);

      if (createError) {
        console.error('Error creating stats:', createError);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: `Card ${action} recorded successfully`,
      cardId,
      action
    });

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
