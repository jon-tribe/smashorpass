const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Using a more reliable image source - Clash Royale API or alternative sources
const characters = [
  { id: 'skeletons', name: 'Skeletons', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/skeletons.png' },
  { id: 'ice-spirit', name: 'Ice Spirit', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/ice-spirit.png' },
  { id: 'fire-spirit', name: 'Fire Spirit', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/fire-spirit.png' },
  { id: 'electro-spirit', name: 'Electro Spirit', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/electro-spirit.png' },
  { id: 'goblins', name: 'Goblins', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/goblins.png' },
  { id: 'spear-goblins', name: 'Spear Goblins', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/spear-goblins.png' },
  { id: 'bats', name: 'Bats', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/bats.png' },
  { id: 'zap', name: 'Zap', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/zap.png' },
  { id: 'giant-snowball', name: 'Giant Snowball', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/giant-snowball.png' },
  { id: 'archers', name: 'Archers', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/archers.png' },
  { id: 'knight', name: 'Knight', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/knight.png' },
  { id: 'minions', name: 'Minions', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/minions.png' },
  { id: 'cannon', name: 'Cannon', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/cannon.png' },
  { id: 'barbarians', name: 'Barbarians', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/barbarians.png' },
  { id: 'royal-giant', name: 'Royal Giant', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/royal-giant.png' },
  { id: 'musketeer', name: 'Musketeer', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/musketeer.png' },
  { id: 'valkyrie', name: 'Valkyrie', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/valkyrie.png' },
  { id: 'hog-rider', name: 'Hog Rider', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/hog-rider.png' },
  { id: 'wizard', name: 'Wizard', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/wizard.png' },
  { id: 'giant', name: 'Giant', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/giant.png' },
  { id: 'fireball', name: 'Fireball', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/fireball.png' },
  { id: 'rocket', name: 'Rocket', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/rocket.png' },
  { id: 'baby-dragon', name: 'Baby Dragon', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/baby-dragon.png' },
  { id: 'prince', name: 'Prince', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/prince.png' },
  { id: 'dark-prince', name: 'Dark Prince', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/dark-prince.png' },
  { id: 'witch', name: 'Witch', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/witch.png' },
  { id: 'balloon', name: 'Balloon', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/balloon.png' },
  { id: 'goblin-barrel', name: 'Goblin Barrel', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/goblin-barrel.png' },
  { id: 'freeze', name: 'Freeze', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/freeze.png' },
  { id: 'poison', name: 'Poison', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/poison.png' },
  { id: 'lightning', name: 'Lightning', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/lightning.png' },
  { id: 'pekka', name: 'P.E.K.K.A', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/pekka.png' },
  { id: 'golem', name: 'Golem', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/golem.png' },
  { id: 'the-log', name: 'The Log', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/the-log.png' },
  { id: 'miner', name: 'Miner', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/miner.png' },
  { id: 'princess', name: 'Princess', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/princess.png' },
  { id: 'ice-wizard', name: 'Ice Wizard', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/ice-wizard.png' },
  { id: 'royal-ghost', name: 'Royal Ghost', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/royal-ghost.png' },
  { id: 'bandit', name: 'Bandit', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/bandit.png' },
  { id: 'lumberjack', name: 'Lumberjack', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/lumberjack.png' },
  { id: 'inferno-dragon', name: 'Inferno Dragon', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/inferno-dragon.png' },
  { id: 'electro-wizard', name: 'Electro Wizard', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/electro-wizard.png' },
  { id: 'magic-archer', name: 'Magic Archer', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/magic-archer.png' },
  { id: 'night-witch', name: 'Night Witch', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/night-witch.png' },
  { id: 'mother-witch', name: 'Mother Witch', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/mother-witch.png' },
  { id: 'ram-rider', name: 'Ram Rider', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/ram-rider.png' },
  { id: 'graveyard', name: 'Graveyard', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/graveyard.png' },
  { id: 'sparky', name: 'Sparky', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/sparky.png' },
  { id: 'lava-hound', name: 'Lava Hound', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/lava-hound.png' },
  { id: 'mega-knight', name: 'Mega Knight', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/mega-knight.png' },
  { id: 'little-prince', name: 'Little Prince', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/little-prince.png' },
  { id: 'golden-knight', name: 'Golden Knight', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/golden-knight.png' },
  { id: 'skeleton-king', name: 'Skeleton King', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/skeleton-king.png' },
  { id: 'mighty-miner', name: 'Mighty Miner', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/mighty-miner.png' },
  { id: 'archer-queen', name: 'Archer Queen', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/archer-queen.png' },
  { id: 'monk', name: 'Monk', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/monk.png' },
  { id: 'boss-bandit', name: 'Boss Bandit', imageUrl: 'https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/boss-bandit.png' }
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
  console.log('🚀 Starting image download...');
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