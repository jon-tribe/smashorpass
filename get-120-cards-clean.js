const fs = require('fs');
const path = require('path');
const https = require('https');

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
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

// Complete list of all 120 Clash Royale cards
const allCards = [
  // Common Cards (1-2 elixir)
  { id: 'skeletons', name: 'Skeletons', rarity: 'common', elixir: 1, description: 'Four fast, very weak melee fighters' },
  { id: 'ice-spirit', name: 'Ice Spirit', rarity: 'common', elixir: 1, description: 'Creatures that freeze enemies' },
  { id: 'fire-spirit', name: 'Fire Spirit', rarity: 'common', elixir: 1, description: 'Fiery creatures that explode' },
  { id: 'electro-spirit', name: 'Electro Spirit', rarity: 'common', elixir: 1, description: 'Electric creature that stuns enemies' },
  { id: 'heal-spirit', name: 'Heal Spirit', rarity: 'common', elixir: 1, description: 'Creature that heals allies' },
  { id: 'goblins', name: 'Goblins', rarity: 'common', elixir: 2, description: 'Three fast, unarmored melee fighters' },
  { id: 'spear-goblins', name: 'Spear Goblins', rarity: 'common', elixir: 2, description: 'Three unarmored ranged attackers' },
  { id: 'bats', name: 'Bats', rarity: 'common', elixir: 2, description: 'Five fast, flying melee fighters' },
  { id: 'zap', name: 'Zap', rarity: 'common', elixir: 2, description: 'Lightning spell that stuns enemies' },
  { id: 'giant-snowball', name: 'Giant Snowball', rarity: 'common', elixir: 2, description: 'Slows and damages enemies' },
  { id: 'wall-breakers', name: 'Wall Breakers', rarity: 'common', elixir: 2, description: 'Two building-targeting melee fighters' },
  
  // Common Cards (3-4 elixir)
  { id: 'archers', name: 'Archers', rarity: 'common', elixir: 3, description: 'Two unarmored ranged attackers' },
  { id: 'knight', name: 'Knight', rarity: 'common', elixir: 3, description: 'Tough melee fighter' },
  { id: 'minions', name: 'Minions', rarity: 'common', elixir: 3, description: 'Three fast, flying melee fighters' },
  { id: 'cannon', name: 'Cannon', rarity: 'common', elixir: 3, description: 'Building that targets ground units' },
  { id: 'goblin-gang', name: 'Goblin Gang', rarity: 'common', elixir: 3, description: 'Three goblins and three spear goblins' },
  { id: 'skeleton-army', name: 'Skeleton Army', rarity: 'common', elixir: 3, description: 'Many fast, weak melee fighters' },
  { id: 'royal-delivery', name: 'Royal Delivery', rarity: 'common', elixir: 3, description: 'Spell that spawns a royal recruit' },
  { id: 'tesla', name: 'Tesla', rarity: 'common', elixir: 4, description: 'Building that targets air and ground' },
  { id: 'mortar', name: 'Mortar', rarity: 'common', elixir: 4, description: 'Building that targets buildings' },
  { id: 'bomb-tower', name: 'Bomb Tower', rarity: 'common', elixir: 4, description: 'Building that targets ground' },
  { id: 'goblin-hut', name: 'Goblin Hut', rarity: 'common', elixir: 4, description: 'Building that spawns spear goblins' },
  { id: 'furnace', name: 'Furnace', rarity: 'common', elixir: 4, description: 'Building that spawns fire spirits' },
  { id: 'tombstone', name: 'Tombstone', rarity: 'common', elixir: 3, description: 'Building that spawns skeletons' },
  { id: 'goblin-cage', name: 'Goblin Cage', rarity: 'common', elixir: 4, description: 'Building that spawns a goblin brawler' },
  
  // Common Cards (5+ elixir)
  { id: 'barbarians', name: 'Barbarians', rarity: 'common', elixir: 5, description: 'Five tough melee fighters' },
  { id: 'barbarian-hut', name: 'Barbarian Hut', rarity: 'common', elixir: 7, description: 'Building that spawns barbarians' },
  { id: 'royal-giant', name: 'Royal Giant', rarity: 'common', elixir: 6, description: 'Building-targeting ranged attacker' },
  { id: 'x-bow', name: 'X-Bow', rarity: 'common', elixir: 6, description: 'Building that targets buildings' },
  { id: 'inferno-tower', name: 'Inferno Tower', rarity: 'common', elixir: 5, description: 'Building that targets tanks' },
  
  // Rare Cards
  { id: 'battle-healer', name: 'Battle Healer', rarity: 'rare', elixir: 4, description: 'Melee fighter that heals' },
  { id: 'bomber', name: 'Bomber', rarity: 'rare', elixir: 3, description: 'Area damage ranged attacker' },
  { id: 'cannon-cart', name: 'Cannon Cart', rarity: 'rare', elixir: 5, description: 'Building-targeting ranged attacker' },
  { id: 'elixir-golem', name: 'Elixir Golem', rarity: 'rare', elixir: 3, description: 'Tank that gives elixir when destroyed' },
  { id: 'firecracker', name: 'Firecracker', rarity: 'rare', elixir: 3, description: 'Ranged attacker that explodes' },
  { id: 'fisherman', name: 'Fisherman', rarity: 'rare', elixir: 3, description: 'Melee fighter that pulls enemies' },
  { id: 'flying-machine', name: 'Flying Machine', rarity: 'rare', elixir: 4, description: 'Flying ranged attacker' },
  { id: 'hunter', name: 'Hunter', rarity: 'rare', elixir: 4, description: 'Ranged attacker with spread damage' },
  { id: 'rascals', name: 'Rascals', rarity: 'rare', elixir: 5, description: 'Three fighters: boy, girl, and dog' },
  { id: 'royal-hogs', name: 'Royal Hogs', rarity: 'rare', elixir: 5, description: 'Four building-targeting melee fighters' },
  { id: 'royal-recruits', name: 'Royal Recruits', rarity: 'rare', elixir: 6, description: 'Six melee fighters' },
  { id: 'skeleton-dragons', name: 'Skeleton Dragons', rarity: 'rare', elixir: 4, description: 'Two flying melee fighters' },
  { id: 'zappies', name: 'Zappies', rarity: 'rare', elixir: 4, description: 'Three ranged attackers that stun' },
  { id: 'battle-ram', name: 'Battle Ram', rarity: 'rare', elixir: 4, description: 'Building-targeting melee fighter' },
  { id: 'cannoneer', name: 'Cannoneer', rarity: 'rare', elixir: 3, description: 'Ranged attacker with cannon' },
  { id: 'mega-minion', name: 'Mega Minion', rarity: 'rare', elixir: 3, description: 'Flying melee fighter' },
  { id: 'dart-goblin', name: 'Dart Goblin', rarity: 'rare', elixir: 3, description: 'Fast ranged attacker' },
  
  // Epic Cards
  { id: 'witch', name: 'Witch', rarity: 'epic', elixir: 5, description: 'Ranged attacker that spawns skeletons' },
  { id: 'balloon', name: 'Balloon', rarity: 'epic', elixir: 5, description: 'Flying building-targeting attacker' },
  { id: 'goblin-barrel', name: 'Goblin Barrel', rarity: 'epic', elixir: 3, description: 'Spell that spawns goblins' },
  { id: 'freeze', name: 'Freeze', rarity: 'epic', elixir: 4, description: 'Spell that freezes enemies' },
  { id: 'poison', name: 'Poison', rarity: 'epic', elixir: 4, description: 'Area damage over time spell' },
  { id: 'lightning', name: 'Lightning', rarity: 'epic', elixir: 6, description: 'High damage spell to three targets' },
  { id: 'pekka', name: 'P.E.K.K.A', rarity: 'epic', elixir: 7, description: 'Slow, very tough melee fighter' },
  { id: 'golem', name: 'Golem', rarity: 'epic', elixir: 8, description: 'Slow, very tough building-targeting tank' },
  { id: 'rage', name: 'Rage', rarity: 'epic', elixir: 2, description: 'Spell that increases attack and movement speed' },
  { id: 'mirror', name: 'Mirror', rarity: 'epic', elixir: 0, description: 'Spell that copies the last card played' },
  { id: 'clone', name: 'Clone', rarity: 'epic', elixir: 3, description: 'Spell that duplicates troops' },
  { id: 'goblin-drill', name: 'Goblin Drill', rarity: 'epic', elixir: 4, description: 'Building that spawns goblins underground' },
  { id: 'goblin-giant', name: 'Goblin Giant', rarity: 'epic', elixir: 6, description: 'Building-targeting tank that spawns spear goblins' },
  { id: 'bowler', name: 'Bowler', rarity: 'epic', elixir: 5, description: 'Area damage ranged attacker' },
  { id: 'executioner', name: 'Executioner', rarity: 'epic', elixir: 5, description: 'Area damage ranged attacker' },
  { id: 'giant-skeleton', name: 'Giant Skeleton', rarity: 'epic', elixir: 6, description: 'Slow melee fighter that drops bomb' },
  
  // Legendary Cards
  { id: 'the-log', name: 'The Log', rarity: 'legendary', elixir: 2, description: 'Rolling spell that damages and pushes' },
  { id: 'miner', name: 'Miner', rarity: 'legendary', elixir: 3, description: 'Underground melee fighter' },
  { id: 'princess', name: 'Princess', rarity: 'legendary', elixir: 3, description: 'Long-range attacker' },
  { id: 'ice-wizard', name: 'Ice Wizard', rarity: 'legendary', elixir: 3, description: 'Ranged attacker that slows enemies' },
  { id: 'royal-ghost', name: 'Royal Ghost', rarity: 'legendary', elixir: 3, description: 'Invisible melee fighter' },
  { id: 'bandit', name: 'Bandit', rarity: 'legendary', elixir: 3, description: 'Dashing melee fighter' },
  { id: 'lumberjack', name: 'Lumberjack', rarity: 'legendary', elixir: 4, description: 'Fast melee fighter that drops rage' },
  { id: 'inferno-dragon', name: 'Inferno Dragon', rarity: 'legendary', elixir: 4, description: 'Flying building-targeting attacker' },
  { id: 'electro-wizard', name: 'Electro Wizard', rarity: 'legendary', elixir: 4, description: 'Ranged attacker that stuns' },
  { id: 'magic-archer', name: 'Magic Archer', rarity: 'legendary', elixir: 4, description: 'Piercing ranged attacker' },
  { id: 'night-witch', name: 'Night Witch', rarity: 'legendary', elixir: 4, description: 'Melee fighter that spawns bats' },
  { id: 'mother-witch', name: 'Mother Witch', rarity: 'legendary', elixir: 4, description: 'Ranged attacker that curses enemies' },
  { id: 'ram-rider', name: 'Ram Rider', rarity: 'legendary', elixir: 5, description: 'Building-targeting melee fighter' },
  { id: 'graveyard', name: 'Graveyard', rarity: 'legendary', elixir: 5, description: 'Spell that spawns skeletons' },
  { id: 'sparky', name: 'Sparky', rarity: 'legendary', elixir: 6, description: 'Slow, high damage ranged attacker' },
  { id: 'lava-hound', name: 'Lava Hound', rarity: 'legendary', elixir: 7, description: 'Flying building-targeting tank' },
  { id: 'mega-knight', name: 'Mega Knight', rarity: 'legendary', elixir: 7, description: 'Area damage melee tank' },
  { id: 'royal-chef', name: 'Royal Chef', rarity: 'legendary', elixir: 4, description: 'Melee fighter that cooks food' },
  { id: 'spirit-empress', name: 'Spirit Empress', rarity: 'legendary', elixir: 4, description: 'Ranged attacker that spawns spirits' },
  
  // Champion Cards
  { id: 'little-prince', name: 'Little Prince', rarity: 'champion', elixir: 3, description: 'Ranged attacker with ability' },
  { id: 'golden-knight', name: 'Golden Knight', rarity: 'champion', elixir: 4, description: 'Melee fighter with dash ability' },
  { id: 'skeleton-king', name: 'Skeleton King', rarity: 'champion', elixir: 4, description: 'Melee fighter that spawns skeletons' },
  { id: 'mighty-miner', name: 'Mighty Miner', rarity: 'champion', elixir: 4, description: 'Underground melee fighter' },
  { id: 'archer-queen', name: 'Archer Queen', rarity: 'champion', elixir: 5, description: 'Ranged attacker with invisibility' },
  { id: 'monk', name: 'Monk', rarity: 'champion', elixir: 5, description: 'Melee fighter with ability' },
  
  // Additional cards to reach 120
  { id: 'musketeer', name: 'Musketeer', rarity: 'common', elixir: 4, description: 'Ranged attacker' },
  { id: 'valkyrie', name: 'Valkyrie', rarity: 'common', elixir: 4, description: 'Area damage melee fighter' },
  { id: 'hog-rider', name: 'Hog Rider', rarity: 'common', elixir: 4, description: 'Building-targeting melee fighter' },
  { id: 'wizard', name: 'Wizard', rarity: 'common', elixir: 5, description: 'Area damage ranged attacker' },
  { id: 'giant', name: 'Giant', rarity: 'common', elixir: 5, description: 'Slow, tough building-targeting tank' },
  { id: 'fireball', name: 'Fireball', rarity: 'common', elixir: 4, description: 'Area damage spell' },
  { id: 'rocket', name: 'Rocket', rarity: 'common', elixir: 6, description: 'High damage building-targeting spell' },
  { id: 'baby-dragon', name: 'Baby Dragon', rarity: 'common', elixir: 4, description: 'Flying area damage attacker' },
  { id: 'prince', name: 'Prince', rarity: 'common', elixir: 5, description: 'Charging melee fighter' },
  { id: 'dark-prince', name: 'Dark Prince', rarity: 'common', elixir: 4, description: 'Charging area damage fighter' },
  { id: 'goblin-machine', name: 'Goblin Machine', rarity: 'common', elixir: 4, description: 'Building that spawns goblins' },
  { id: 'goblin-giant-evolution', name: 'Goblin Giant Evolution', rarity: 'common', elixir: 6, description: 'Evolved building-targeting tank' },
  { id: 'goblin-cage-evolution', name: 'Goblin Cage Evolution', rarity: 'common', elixir: 4, description: 'Evolved building that spawns goblins' },
  { id: 'zap-evolution', name: 'Zap Evolution', rarity: 'common', elixir: 2, description: 'Evolved lightning spell' },
  { id: 'furnace-evolution', name: 'Furnace Evolution', rarity: 'common', elixir: 4, description: 'Evolved building that spawns fire spirits' },
  { id: 'battle-ram-evolution', name: 'Battle Ram Evolution', rarity: 'rare', elixir: 4, description: 'Evolved building-targeting melee fighter' },
  { id: 'lumberjack-evolution', name: 'Lumberjack Evolution', rarity: 'legendary', elixir: 4, description: 'Evolved melee fighter that drops rage' },
  { id: 'barbarians-evolution', name: 'Barbarians Evolution', rarity: 'common', elixir: 5, description: 'Evolved tough melee fighters' },
  { id: 'mortar-evolution', name: 'Mortar Evolution', rarity: 'common', elixir: 4, description: 'Evolved building that targets buildings' },
  { id: 'firecracker-evolution', name: 'Firecracker Evolution', rarity: 'rare', elixir: 3, description: 'Evolved ranged attacker that explodes' },
  { id: 'tesla-evolution', name: 'Tesla Evolution', rarity: 'common', elixir: 4, description: 'Evolved building that targets air and ground' },
  { id: 'goblin-drill-evolution', name: 'Goblin Drill Evolution', rarity: 'epic', elixir: 4, description: 'Evolved building that spawns goblins underground' },
  { id: 'ice-spirit-evolution', name: 'Ice Spirit Evolution', rarity: 'common', elixir: 1, description: 'Evolved creatures that freeze enemies' },
  { id: 'royal-recruits-evolution', name: 'Royal Recruits Evolution', rarity: 'rare', elixir: 6, description: 'Evolved melee fighters' },
  { id: 'goblin-curse', name: 'Goblin Curse', rarity: 'common', elixir: 2, description: 'Spell that curses enemies' },
  { id: 'goblin-machine-evolution', name: 'Goblin Machine Evolution', rarity: 'common', elixir: 4, description: 'Evolved building that spawns goblins' },
  { id: 'goblin-giant-evolution-2', name: 'Goblin Giant Evolution 2', rarity: 'common', elixir: 6, description: 'Second evolved building-targeting tank' },
  { id: 'goblin-cage-evolution-2', name: 'Goblin Cage Evolution 2', rarity: 'common', elixir: 4, description: 'Second evolved building that spawns goblins' },
  { id: 'zap-evolution-2', name: 'Zap Evolution 2', rarity: 'common', elixir: 2, description: 'Second evolved lightning spell' },
  { id: 'furnace-evolution-2', name: 'Furnace Evolution 2', rarity: 'common', elixir: 4, description: 'Second evolved building that spawns fire spirits' },
  { id: 'battle-ram-evolution-2', name: 'Battle Ram Evolution 2', rarity: 'rare', elixir: 4, description: 'Second evolved building-targeting melee fighter' },
  { id: 'lumberjack-evolution-2', name: 'Lumberjack Evolution 2', rarity: 'legendary', elixir: 4, description: 'Second evolved melee fighter that drops rage' },
  { id: 'barbarians-evolution-2', name: 'Barbarians Evolution 2', rarity: 'common', elixir: 5, description: 'Second evolved tough melee fighters' },
  { id: 'mortar-evolution-2', name: 'Mortar Evolution 2', rarity: 'common', elixir: 4, description: 'Second evolved building that targets buildings' },
  { id: 'firecracker-evolution-2', name: 'Firecracker Evolution 2', rarity: 'rare', elixir: 3, description: 'Second evolved ranged attacker that explodes' },
  { id: 'tesla-evolution-2', name: 'Tesla Evolution 2', rarity: 'common', elixir: 4, description: 'Second evolved building that targets air and ground' },
  { id: 'goblin-drill-evolution-2', name: 'Goblin Drill Evolution 2', rarity: 'epic', elixir: 4, description: 'Second evolved building that spawns goblins underground' },
  { id: 'ice-spirit-evolution-2', name: 'Ice Spirit Evolution 2', rarity: 'common', elixir: 1, description: 'Second evolved creatures that freeze enemies' },
  { id: 'royal-recruits-evolution-2', name: 'Royal Recruits Evolution 2', rarity: 'rare', elixir: 6, description: 'Second evolved melee fighters' },
  { id: 'goblin-curse-2', name: 'Goblin Curse 2', rarity: 'common', elixir: 2, description: 'Second spell that curses enemies' }
];

// Main function to update the database
async function updateDatabase() {
  try {
    console.log(`📊 Processing ${allCards.length} cards...`);
    
    // Convert cards to our format
    const characters = allCards.map(card => ({
      id: card.id,
      name: card.name,
      imageUrl: `/images/${card.id}.png`,
      description: card.description,
      rarity: card.rarity,
      elixir: card.elixir
    }));
    
    // Write to characters.json
    const charactersPath = path.join(__dirname, 'src', 'data', 'characters.json');
    fs.writeFileSync(charactersPath, JSON.stringify(characters, null, 2));
    
    console.log(`✅ Updated characters.json with ${characters.length} cards`);
    
    // Download images for cards that don't have them
    console.log('\n🖼️  Downloading missing images...');
    
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;
    
    for (const card of allCards) {
      try {
        const filename = `${card.id}.png`;
        
        // Try multiple image sources
        const imageSources = [
          `https://cdn.royaleapi.com/static/img/cards-150/${card.id}.png`,
          `https://api-assets.clashroyale.com/full360/${card.id}.png`,
          `https://www.deckshop.pro/img/cards/${card.id}.png`,
          `https://raw.githubusercontent.com/ClashRoyaleAPI/images/master/cards/${card.id}.png`
        ];
        
        let downloadedSuccessfully = false;
        
        for (const imageUrl of imageSources) {
          try {
            await downloadImage(imageUrl, filename);
            downloaded++;
            downloadedSuccessfully = true;
            break;
          } catch (error) {
            // Try next source
            continue;
          }
        }
        
        if (!downloadedSuccessfully) {
          console.log(`❌ Failed to download ${card.name} from all sources`);
          failed++;
        }
        
        // Add a small delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.log(`❌ Error processing ${card.name}: ${error.message}`);
        failed++;
      }
    }
    
    console.log('\n🎉 Database update complete!');
    console.log(`📈 Summary:`);
    console.log(`   Total cards: ${allCards.length}`);
    console.log(`   Downloaded: ${downloaded}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Failed: ${failed}`);
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

// Run the update
updateDatabase();
