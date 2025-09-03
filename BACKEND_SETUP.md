# Backend Card Tracking Setup

This guide will help you set up the backend tracking system for monitoring card smashes and passes in your Smash or Pass game.

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key

### 2. Set Up Database Tables
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-schema.sql`
4. Run the SQL script to create all tables, indexes, and triggers

### 3. Configure Environment Variables
Create a `.env.local` file in your project root:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🚀 API Endpoints

### Track Card Interaction
- **POST** `/api/track-card`
- **Body**: `{ "cardId": "knight", "action": "smash" }`
- **Purpose**: Records when a user smashes or passes a card

### Get Card Statistics
- **GET** `/api/get-card-stats?cardId=knight`
- **Purpose**: Get stats for a specific card

### Get All Card Statistics
- **GET** `/api/get-card-stats?limit=100`
- **Purpose**: Get stats for all cards (paginated)

## 🔧 Frontend Integration

### 1. Import the tracking utility
```javascript
import { trackCardInteraction, getCardStats } from '../utils/cardTracking';
```

### 2. Track card interactions
```javascript
// When user smashes a card
await trackCardInteraction('knight', 'smash');

// When user passes a card
await trackCardInteraction('wizard', 'pass');
```

### 3. Get card statistics
```javascript
// Get stats for a specific card
const stats = await getCardStats('knight');
console.log(`${stats.smash_count} smashes, ${stats.pass_count} passes`);
```

## 📊 Database Schema

### `card_interactions` Table
- Records every individual smash/pass action
- Includes user IP and user agent for analytics
- Automatically triggers stats updates

### `card_stats` Table
- Aggregated statistics for each card
- Automatically updated via database triggers
- Includes smash rate calculations

## 🔒 Security Features

- **Row Level Security (RLS)** enabled
- **Public read access** to card statistics
- **Public insert access** to card interactions
- **Input validation** on all API endpoints
- **Error handling** that won't break the game

## 📈 Analytics Features

- **Real-time tracking** of all card interactions
- **Automatic aggregation** of statistics
- **Smash rate calculations** for each card
- **Popularity rankings** by interactions
- **Trend analysis** capabilities

## 🚀 Deployment

### Vercel
The API endpoints are automatically deployed to Vercel when you push to GitHub.

### Local Development
1. Run `npm start` to start the development server
2. API endpoints will be available at `http://localhost:3000/api/*`

## 🧪 Testing

### Test API Endpoints
```bash
# Track a smash
curl -X POST http://localhost:3000/api/track-card \
  -H "Content-Type: application/json" \
  -d '{"cardId": "knight", "action": "smash"}'

# Get card stats
curl http://localhost:3000/api/get-card-stats?cardId=knight
```

## 📝 Next Steps

1. **Set up Supabase project** and run the schema
2. **Configure environment variables**
3. **Integrate tracking calls** in your frontend
4. **Deploy to Vercel**
5. **Monitor analytics** in Supabase dashboard

## 🔍 Monitoring

- Check **Supabase Dashboard** for real-time data
- Monitor **Vercel Function Logs** for API performance
- Use **Supabase Analytics** for insights

## 🆘 Troubleshooting

### Common Issues
1. **Missing environment variables** - Check `.env.local`
2. **Database connection errors** - Verify Supabase credentials
3. **API 500 errors** - Check Vercel function logs
4. **CORS issues** - Verify API endpoint URLs

### Debug Mode
Enable console logging in the tracking utility for debugging:
```javascript
console.log('Tracking interaction:', cardId, action);
```
