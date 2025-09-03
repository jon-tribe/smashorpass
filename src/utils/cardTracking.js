// Utility functions for tracking card interactions

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://smashorpass-2obusjfbc-jons-projects-fff03ed2.vercel.app/api'
  : 'http://localhost:3000/api';

/**
 * Track a card interaction (smash or pass)
 * @param {string} cardId - The ID of the card
 * @param {string} action - Either 'smash' or 'pass'
 * @param {string} timestamp - Optional timestamp
 * @returns {Promise<Object>} - API response
 */
export const trackCardInteraction = async (cardId, action, timestamp = null) => {
  try {
    const response = await fetch(`${API_BASE}/track-card`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cardId,
        action,
        timestamp: timestamp || new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error tracking card interaction:', error);
    // Don't throw - we don't want to break the game if tracking fails
    return { success: false, error: error.message };
  }
};

/**
 * Get statistics for a specific card
 * @param {string} cardId - The ID of the card
 * @returns {Promise<Object>} - Card statistics
 */
export const getCardStats = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE}/get-card-stats?cardId=${encodeURIComponent(cardId)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching card stats:', error);
    return {
      card_id: cardId,
      smash_count: 0,
      pass_count: 0,
      total_interactions: 0,
      smash_rate: 0
    };
  }
};

/**
 * Get statistics for all cards
 * @param {number} limit - Maximum number of cards to return
 * @returns {Promise<Object>} - All card statistics
 */
export const getAllCardStats = async (limit = 100) => {
  try {
    const response = await fetch(`${API_BASE}/get-card-stats?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all card stats:', error);
    return { stats: [], total_cards: 0 };
  }
};

/**
 * Get top cards by smash rate
 * @param {number} limit - Maximum number of cards to return
 * @returns {Promise<Array>} - Top cards by smash rate
 */
export const getTopCardsBySmashRate = async (limit = 10) => {
  try {
    const allStats = await getAllCardStats(1000); // Get more cards to sort from
    
    if (!allStats.stats || allStats.stats.length === 0) {
      return [];
    }

    // Filter cards with minimum interactions and sort by smash rate
    const filteredStats = allStats.stats
      .filter(stat => stat.total_interactions >= 5) // Minimum 5 interactions
      .sort((a, b) => b.smash_rate - a.smash_rate)
      .slice(0, limit);

    return filteredStats;
  } catch (error) {
    console.error('Error getting top cards by smash rate:', error);
    return [];
  }
};

/**
 * Get top cards by total interactions
 * @param {number} limit - Maximum number of cards to return
 * @returns {Promise<Array>} - Top cards by total interactions
 */
export const getTopCardsByInteractions = async (limit = 10) => {
  try {
    const allStats = await getAllCardStats(limit);
    return allStats.stats || [];
  } catch (error) {
    console.error('Error getting top cards by interactions:', error);
    return [];
  }
};
