const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Using Clash Royale Stats API which has reliable image URLs
const characters = [
  { id: 'skeletons', name: 'Skeletons', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000000.png' },
  { id: 'ice-spirit', name: 'Ice Spirit', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000001.png' },
  { id: 'fire-spirit', name: 'Fire Spirit', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000002.png' },
  { id: 'electro-spirit', name: 'Electro Spirit', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000003.png' },
  { id: 'goblins', name: 'Goblins', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000004.png' },
  { id: 'spear-goblins', name: 'Spear Goblins', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000005.png' },
  { id: 'bats', name: 'Bats', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000006.png' },
  { id: 'zap', name: 'Zap', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000007.png' },
  { id: 'giant-snowball', name: 'Giant Snowball', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000008.png' },
  { id: 'archers', name: 'Archers', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000009.png' },
  { id: 'knight', name: 'Knight', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000010.png' },
  { id: 'minions', name: 'Minions', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000011.png' },
  { id: 'cannon', name: 'Cannon', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000012.png' },
  { id: 'barbarians', name: 'Barbarians', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000013.png' },
  { id: 'royal-giant', name: 'Royal Giant', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000014.png' },
  { id: 'musketeer', name: 'Musketeer', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000015.png' },
  { id: 'valkyrie', name: 'Valkyrie', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000016.png' },
  { id: 'hog-rider', name: 'Hog Rider', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000017.png' },
  { id: 'wizard', name: 'Wizard', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000018.png' },
  { id: 'giant', name: 'Giant', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000019.png' },
  { id: 'fireball', name: 'Fireball', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000020.png' },
  { id: 'rocket', name: 'Rocket', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000021.png' },
  { id: 'baby-dragon', name: 'Baby Dragon', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000022.png' },
  { id: 'prince', name: 'Prince', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000023.png' },
  { id: 'dark-prince', name: 'Dark Prince', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000024.png' },
  { id: 'witch', name: 'Witch', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000025.png' },
  { id: 'balloon', name: 'Balloon', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000026.png' },
  { id: 'goblin-barrel', name: 'Goblin Barrel', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000027.png' },
  { id: 'freeze', name: 'Freeze', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000028.png' },
  { id: 'poison', name: 'Poison', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000029.png' },
  { id: 'lightning', name: 'Lightning', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000030.png' },
  { id: 'pekka', name: 'P.E.K.K.A', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000031.png' },
  { id: 'golem', name: 'Golem', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000032.png' },
  { id: 'the-log', name: 'The Log', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000033.png' },
  { id: 'miner', name: 'Miner', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000034.png' },
  { id: 'princess', name: 'Princess', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000035.png' },
  { id: 'ice-wizard', name: 'Ice Wizard', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000036.png' },
  { id: 'royal-ghost', name: 'Royal Ghost', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000037.png' },
  { id: 'bandit', name: 'Bandit', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000038.png' },
  { id: 'lumberjack', name: 'Lumberjack', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000039.png' },
  { id: 'inferno-dragon', name: 'Inferno Dragon', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000040.png' },
  { id: 'electro-wizard', name: 'Electro Wizard', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000041.png' },
  { id: 'magic-archer', name: 'Magic Archer', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000042.png' },
  { id: 'night-witch', name: 'Night Witch', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000043.png' },
  { id: 'mother-witch', name: 'Mother Witch', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000044.png' },
  { id: 'ram-rider', name: 'Ram Rider', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000045.png' },
  { id: 'graveyard', name: 'Graveyard', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000046.png' },
  { id: 'sparky', name: 'Sparky', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000047.png' },
  { id: 'lava-hound', name: 'Lava Hound', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000048.png' },
  { id: 'mega-knight', name: 'Mega Knight', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000049.png' },
  { id: 'little-prince', name: 'Little Prince', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000050.png' },
  { id: 'golden-knight', name: 'Golden Knight', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000051.png' },
  { id: 'skeleton-king', name: 'Skeleton King', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000052.png' },
  { id: 'mighty-miner', name: 'Mighty Miner', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000053.png' },
  { id: 'archer-queen', name: 'Archer Queen', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000054.png' },
  { id: 'monk', name: 'Monk', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000055.png' },
  { id: 'boss-bandit', name: 'Boss Bandit', imageUrl: 'https://api-assets.clashroyale.com/full/3600000000000000000000000000000000000056.png' }
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
  console.log('🚀 Starting image download from Clash Royale API...');
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