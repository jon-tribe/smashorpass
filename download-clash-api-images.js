const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Clash Royale API base URL
const CLASH_API_BASE = 'https://api.clashroyale.com/v1';

// Function to make API request
function makeAPIRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clashroyale.com',
      path: `/v1${endpoint}`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error('Invalid JSON response'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

// Function to download image
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);
    
    // Check if file already exists
    if (fs.existsSync(filepath)) {
      console.log(`✅ ${filename} already exists, skipping...`);
      resolve();
      return;
    }

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete the file if there was an error
          console.log(`❌ Error downloading ${filename}: ${err.message}`);
          reject(err);
        });
      } else {
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${filename}: ${err.message}`);
      reject(err);
    });
  });
}

// Alternative approach: Use a known working image source
async function downloadFromAlternativeSource() {
  console.log('🚀 Starting alternative image download...');
  
  // Using a different image source that should work
  const imageBaseUrl = 'https://cdn.royaleapi.com/static/img/cards-150/';
  
  // List of cards we need (based on our characters.json)
  const cards = [
    'skeletons', 'ice-spirit', 'fire-spirit', 'electro-spirit', 'goblins', 'spear-goblins',
    'bats', 'zap', 'giant-snowball', 'archers', 'knight', 'minions', 'cannon', 'barbarians',
    'royal-giant', 'musketeer', 'valkyrie', 'hog-rider', 'wizard', 'giant', 'fireball',
    'rocket', 'baby-dragon', 'prince', 'dark-prince', 'witch', 'balloon', 'goblin-barrel',
    'freeze', 'poison', 'lightning', 'pekka', 'golem', 'the-log', 'miner', 'princess',
    'ice-wizard', 'royal-ghost', 'bandit', 'lumberjack', 'inferno-dragon', 'electro-wizard',
    'magic-archer', 'night-witch', 'mother-witch', 'ram-rider', 'graveyard', 'sparky',
    'lava-hound', 'mega-knight', 'little-prince', 'golden-knight', 'skeleton-king',
    'mighty-miner', 'archer-queen', 'monk', 'boss-bandit'
  ];
  
  let downloaded = 0;
  let failed = 0;
  
  for (const card of cards) {
    try {
      const imageUrl = `${imageBaseUrl}${card}.png`;
      const filename = `${card}.png`;
      
      console.log(`⬇️  Downloading: ${card}`);
      await downloadImage(imageUrl, filename);
      downloaded++;
      
      // Add a small delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.log(`❌ Failed to download ${card}: ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n🎉 Download complete!');
  console.log(`📈 Summary:`);
  console.log(`   Downloaded: ${downloaded}`);
  console.log(`   Failed: ${failed}`);
  console.log(`   Total: ${cards.length}`);
}

// Try the alternative source
downloadFromAlternativeSource().catch(console.error);
