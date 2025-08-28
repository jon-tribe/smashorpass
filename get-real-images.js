const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Using a more reliable source - Clash Royale Stats website
const characters = [
  { id: 'skeletons', name: 'Skeletons', imageUrl: 'https://www.clashroyalestats.com/images/cards/skeletons.png' },
  { id: 'ice-spirit', name: 'Ice Spirit', imageUrl: 'https://www.clashroyalestats.com/images/cards/ice-spirit.png' },
  { id: 'fire-spirit', name: 'Fire Spirit', imageUrl: 'https://www.clashroyalestats.com/images/cards/fire-spirit.png' },
  { id: 'electro-spirit', name: 'Electro Spirit', imageUrl: 'https://www.clashroyalestats.com/images/cards/electro-spirit.png' },
  { id: 'goblins', name: 'Goblins', imageUrl: 'https://www.clashroyalestats.com/images/cards/goblins.png' },
  { id: 'spear-goblins', name: 'Spear Goblins', imageUrl: 'https://www.clashroyalestats.com/images/cards/spear-goblins.png' },
  { id: 'bats', name: 'Bats', imageUrl: 'https://www.clashroyalestats.com/images/cards/bats.png' },
  { id: 'zap', name: 'Zap', imageUrl: 'https://www.clashroyalestats.com/images/cards/zap.png' },
  { id: 'giant-snowball', name: 'Giant Snowball', imageUrl: 'https://www.clashroyalestats.com/images/cards/giant-snowball.png' },
  { id: 'archers', name: 'Archers', imageUrl: 'https://www.clashroyalestats.com/images/cards/archers.png' },
  { id: 'knight', name: 'Knight', imageUrl: 'https://www.clashroyalestats.com/images/cards/knight.png' },
  { id: 'minions', name: 'Minions', imageUrl: 'https://www.clashroyalestats.com/images/cards/minions.png' },
  { id: 'cannon', name: 'Cannon', imageUrl: 'https://www.clashroyalestats.com/images/cards/cannon.png' },
  { id: 'barbarians', name: 'Barbarians', imageUrl: 'https://www.clashroyalestats.com/images/cards/barbarians.png' },
  { id: 'royal-giant', name: 'Royal Giant', imageUrl: 'https://www.clashroyalestats.com/images/cards/royal-giant.png' },
  { id: 'musketeer', name: 'Musketeer', imageUrl: 'https://www.clashroyalestats.com/images/cards/musketeer.png' },
  { id: 'valkyrie', name: 'Valkyrie', imageUrl: 'https://www.clashroyalestats.com/images/cards/valkyrie.png' },
  { id: 'hog-rider', name: 'Hog Rider', imageUrl: 'https://www.clashroyalestats.com/images/cards/hog-rider.png' },
  { id: 'wizard', name: 'Wizard', imageUrl: 'https://www.clashroyalestats.com/images/cards/wizard.png' },
  { id: 'giant', name: 'Giant', imageUrl: 'https://www.clashroyalestats.com/images/cards/giant.png' },
  { id: 'fireball', name: 'Fireball', imageUrl: 'https://www.clashroyalestats.com/images/cards/fireball.png' },
  { id: 'rocket', name: 'Rocket', imageUrl: 'https://www.clashroyalestats.com/images/cards/rocket.png' },
  { id: 'baby-dragon', name: 'Baby Dragon', imageUrl: 'https://www.clashroyalestats.com/images/cards/baby-dragon.png' },
  { id: 'prince', name: 'Prince', imageUrl: 'https://www.clashroyalestats.com/images/cards/prince.png' },
  { id: 'dark-prince', name: 'Dark Prince', imageUrl: 'https://www.clashroyalestats.com/images/cards/dark-prince.png' },
  { id: 'witch', name: 'Witch', imageUrl: 'https://www.clashroyalestats.com/images/cards/witch.png' },
  { id: 'balloon', name: 'Balloon', imageUrl: 'https://www.clashroyalestats.com/images/cards/balloon.png' },
  { id: 'goblin-barrel', name: 'Goblin Barrel', imageUrl: 'https://www.clashroyalestats.com/images/cards/goblin-barrel.png' },
  { id: 'freeze', name: 'Freeze', imageUrl: 'https://www.clashroyalestats.com/images/cards/freeze.png' },
  { id: 'poison', name: 'Poison', imageUrl: 'https://www.clashroyalestats.com/images/cards/poison.png' },
  { id: 'lightning', name: 'Lightning', imageUrl: 'https://www.clashroyalestats.com/images/cards/lightning.png' },
  { id: 'pekka', name: 'P.E.K.K.A', imageUrl: 'https://www.clashroyalestats.com/images/cards/pekka.png' },
  { id: 'golem', name: 'Golem', imageUrl: 'https://www.clashroyalestats.com/images/cards/golem.png' },
  { id: 'the-log', name: 'The Log', imageUrl: 'https://www.clashroyalestats.com/images/cards/the-log.png' },
  { id: 'miner', name: 'Miner', imageUrl: 'https://www.clashroyalestats.com/images/cards/miner.png' },
  { id: 'princess', name: 'Princess', imageUrl: 'https://www.clashroyalestats.com/images/cards/princess.png' },
  { id: 'ice-wizard', name: 'Ice Wizard', imageUrl: 'https://www.clashroyalestats.com/images/cards/ice-wizard.png' },
  { id: 'royal-ghost', name: 'Royal Ghost', imageUrl: 'https://www.clashroyalestats.com/images/cards/royal-ghost.png' },
  { id: 'bandit', name: 'Bandit', imageUrl: 'https://www.clashroyalestats.com/images/cards/bandit.png' },
  { id: 'lumberjack', name: 'Lumberjack', imageUrl: 'https://www.clashroyalestats.com/images/cards/lumberjack.png' },
  { id: 'inferno-dragon', name: 'Inferno Dragon', imageUrl: 'https://www.clashroyalestats.com/images/cards/inferno-dragon.png' },
  { id: 'electro-wizard', name: 'Electro Wizard', imageUrl: 'https://www.clashroyalestats.com/images/cards/electro-wizard.png' },
  { id: 'magic-archer', name: 'Magic Archer', imageUrl: 'https://www.clashroyalestats.com/images/cards/magic-archer.png' },
  { id: 'night-witch', name: 'Night Witch', imageUrl: 'https://www.clashroyalestats.com/images/cards/night-witch.png' },
  { id: 'mother-witch', name: 'Mother Witch', imageUrl: 'https://www.clashroyalestats.com/images/cards/mother-witch.png' },
  { id: 'ram-rider', name: 'Ram Rider', imageUrl: 'https://www.clashroyalestats.com/images/cards/ram-rider.png' },
  { id: 'graveyard', name: 'Graveyard', imageUrl: 'https://www.clashroyalestats.com/images/cards/graveyard.png' },
  { id: 'sparky', name: 'Sparky', imageUrl: 'https://www.clashroyalestats.com/images/cards/sparky.png' },
  { id: 'lava-hound', name: 'Lava Hound', imageUrl: 'https://www.clashroyalestats.com/images/cards/lava-hound.png' },
  { id: 'mega-knight', name: 'Mega Knight', imageUrl: 'https://www.clashroyalestats.com/images/cards/mega-knight.png' },
  { id: 'little-prince', name: 'Little Prince', imageUrl: 'https://www.clashroyalestats.com/images/cards/little-prince.png' },
  { id: 'golden-knight', name: 'Golden Knight', imageUrl: 'https://www.clashroyalestats.com/images/cards/golden-knight.png' },
  { id: 'skeleton-king', name: 'Skeleton King', imageUrl: 'https://www.clashroyalestats.com/images/cards/skeleton-king.png' },
  { id: 'mighty-miner', name: 'Mighty Miner', imageUrl: 'https://www.clashroyalestats.com/images/cards/mighty-miner.png' },
  { id: 'archer-queen', name: 'Archer Queen', imageUrl: 'https://www.clashroyalestats.com/images/cards/archer-queen.png' },
  { id: 'monk', name: 'Monk', imageUrl: 'https://www.clashroyalestats.com/images/cards/monk.png' },
  { id: 'boss-bandit', name: 'Boss Bandit', imageUrl: 'https://www.clashroyalestats.com/images/cards/boss-bandit.png' }
];

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

async function downloadAllImages() {
  console.log('🚀 Starting image download from Clash Royale Stats...');
  console.log(`📁 Saving images to: ${imagesDir}`);
  
  const downloadPromises = characters.map(char => {
    const filename = `${char.id}.png`;
    return downloadImage(char.imageUrl, filename);
  });

  try {
    await Promise.allSettled(downloadPromises);
    console.log('\n🎉 Download complete!');
    console.log('📝 Next steps:');
    console.log('1. Update the characters.json file to use local image paths');
    console.log('2. Restart the React app');
  } catch (error) {
    console.error('❌ Download failed:', error);
  }
}

downloadAllImages(); 