const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const characters = [
  { id: 'skeletons', name: 'Skeletons', imageUrl: 'https://www.deckshop.pro/img/card_ed/Skeletons.png' },
  { id: 'ice-spirit', name: 'Ice Spirit', imageUrl: 'https://www.deckshop.pro/img/card_ed/IceSpirit.png' },
  { id: 'fire-spirit', name: 'Fire Spirit', imageUrl: 'https://www.deckshop.pro/img/card_ed/FireSpirit.png' },
  { id: 'goblins', name: 'Goblins', imageUrl: 'https://www.deckshop.pro/img/card_ed/Goblins.png' },
  { id: 'spear-goblins', name: 'Spear Goblins', imageUrl: 'https://www.deckshop.pro/img/card_ed/SpearGoblins.png' },
  { id: 'minions', name: 'Minions', imageUrl: 'https://www.deckshop.pro/img/card_ed/Minions.png' },
  { id: 'archers', name: 'Archers', imageUrl: 'https://www.deckshop.pro/img/card_ed/Archers.png' },
  { id: 'knight', name: 'Knight', imageUrl: 'https://www.deckshop.pro/img/card_ed/Knight.png' },
  { id: 'bomber', name: 'Bomber', imageUrl: 'https://www.deckshop.pro/img/card_ed/Bomber.png' },
  { id: 'giant-skeleton', name: 'Giant Skeleton', imageUrl: 'https://www.deckshop.pro/img/card_ed/GiantSkeleton.png' },
  { id: 'skeleton-army', name: 'Skeleton Army', imageUrl: 'https://www.deckshop.pro/img/card_ed/SkeletonArmy.png' },
  { id: 'bats', name: 'Bats', imageUrl: 'https://www.deckshop.pro/img/card_ed/Bats.png' },
  { id: 'mega-minion', name: 'Mega Minion', imageUrl: 'https://www.deckshop.pro/img/card_ed/MegaMinion.png' },
  { id: 'dart-goblin', name: 'Dart Goblin', imageUrl: 'https://www.deckshop.pro/img/card_ed/DartGoblin.png' },
  { id: 'goblin-gang', name: 'Goblin Gang', imageUrl: 'https://www.deckshop.pro/img/card_ed/GoblinGang.png' },
  { id: 'elite-barbarians', name: 'Elite Barbarians', imageUrl: 'https://www.deckshop.pro/img/card_ed/EliteBarbarians.png' },
  { id: 'hunter', name: 'Hunter', imageUrl: 'https://www.deckshop.pro/img/card_ed/Hunter.png' },
  { id: 'night-witch', name: 'Night Witch', imageUrl: 'https://www.deckshop.pro/img/card_ed/NightWitch.png' },
  { id: 'bandit', name: 'Bandit', imageUrl: 'https://www.deckshop.pro/img/card_ed/Bandit.png' },
  { id: 'royal-recruits', name: 'Royal Recruits', imageUrl: 'https://www.deckshop.pro/img/card_ed/RoyalRecruits.png' },
  { id: 'ram-rider', name: 'Ram Rider', imageUrl: 'https://www.deckshop.pro/img/card_ed/RamRider.png' },
  { id: 'zappies', name: 'Zappies', imageUrl: 'https://www.deckshop.pro/img/card_ed/Zappies.png' },
  { id: 'rascals', name: 'Rascals', imageUrl: 'https://www.deckshop.pro/img/card_ed/Rascals.png' },
  { id: 'cannon-cart', name: 'Cannon Cart', imageUrl: 'https://www.deckshop.pro/img/card_ed/CannonCart.png' },
  { id: 'mega-knight', name: 'Mega Knight', imageUrl: 'https://www.deckshop.pro/img/card_ed/MegaKnight.png' },
  { id: 'skeleton-barrel', name: 'Skeleton Barrel', imageUrl: 'https://www.deckshop.pro/img/card_ed/SkeletonBarrel.png' },
  { id: 'flying-machine', name: 'Flying Machine', imageUrl: 'https://www.deckshop.pro/img/card_ed/FlyingMachine.png' },
  { id: 'wall-breakers', name: 'Wall Breakers', imageUrl: 'https://www.deckshop.pro/img/card_ed/WallBreakers.png' },
  { id: 'royal-hogs', name: 'Royal Hogs', imageUrl: 'https://www.deckshop.pro/img/card_ed/RoyalHogs.png' },
  { id: 'goblin-giant', name: 'Goblin Giant', imageUrl: 'https://www.deckshop.pro/img/card_ed/GoblinGiant.png' },
  { id: 'fisherman', name: 'Fisherman', imageUrl: 'https://www.deckshop.pro/img/card_ed/Fisherman.png' },
  { id: 'magic-archer', name: 'Magic Archer', imageUrl: 'https://www.deckshop.pro/img/card_ed/MagicArcher.png' },
  { id: 'electro-dragon', name: 'Electro Dragon', imageUrl: 'https://www.deckshop.pro/img/card_ed/ElectroDragon.png' },
  { id: 'firecracker', name: 'Firecracker', imageUrl: 'https://www.deckshop.pro/img/card_ed/Firecracker.png' },
  { id: 'mighty-miner', name: 'Mighty Miner', imageUrl: 'https://www.deckshop.pro/img/card_ed/MightyMiner.png' },
  { id: 'elixir-golem', name: 'Elixir Golem', imageUrl: 'https://www.deckshop.pro/img/card_ed/ElixirGolem.png' },
  { id: 'battle-healer', name: 'Battle Healer', imageUrl: 'https://www.deckshop.pro/img/card_ed/BattleHealer.png' },
  { id: 'skeleton-king', name: 'Skeleton King', imageUrl: 'https://www.deckshop.pro/img/card_ed/SkeletonKing.png' },
  { id: 'archer-queen', name: 'Archer Queen', imageUrl: 'https://www.deckshop.pro/img/card_ed/ArcherQueen.png' },
  { id: 'golden-knight', name: 'Golden Knight', imageUrl: 'https://www.deckshop.pro/img/card_ed/GoldenKnight.png' },
  { id: 'monk', name: 'Monk', imageUrl: 'https://www.deckshop.pro/img/card_ed/Monk.png' },
  { id: 'skeleton-dragons', name: 'Skeleton Dragons', imageUrl: 'https://www.deckshop.pro/img/card_ed/SkeletonDragons.png' },
  { id: 'mother-witch', name: 'Mother Witch', imageUrl: 'https://www.deckshop.pro/img/card_ed/MotherWitch.png' },
  { id: 'electro-spirit', name: 'Electro Spirit', imageUrl: 'https://www.deckshop.pro/img/card_ed/ElectroSpirit.png' },
  { id: 'elite-barbarians', name: 'Elite Barbarians', imageUrl: 'https://www.deckshop.pro/img/card_ed/EliteBarbarians.png' },
  { id: 'yeti', name: 'Yeti', imageUrl: 'https://www.deckshop.pro/img/card_ed/Yeti.png' },
  { id: 'dragon-rider', name: 'Dragon Rider', imageUrl: 'https://www.deckshop.pro/img/card_ed/DragonRider.png' },
  { id: 'apprentice-champion', name: 'Apprentice Champion', imageUrl: 'https://www.deckshop.pro/img/card_ed/ApprenticeChampion.png' },
  { id: 'little-prince', name: 'Little Prince', imageUrl: 'https://www.deckshop.pro/img/card_ed/LittlePrince.png' }
];

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(imagesDir, filename));
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${filename}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
        file.close();
        fs.unlink(path.join(imagesDir, filename), () => {});
        resolve(); // Resolve to continue with other downloads
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${filename}: ${err.message}`);
      file.close();
      fs.unlink(path.join(imagesDir, filename), () => {});
      resolve(); // Resolve to continue with other downloads
    });
  });
}

async function downloadAllImages() {
  console.log('🚀 Starting download of Clash Royale card images from deckshop.pro...');
  
  const downloadPromises = characters.map(character => {
    const filename = `${character.id}.png`;
    return downloadImage(character.imageUrl, filename);
  });
  
  await Promise.all(downloadPromises);
  
  console.log('✅ Download complete!');
  console.log(`📁 Images saved to: ${imagesDir}`);
}

downloadAllImages(); 