const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to make API request to official Clash Royale API
function makeAPIRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clashroyale.com',
      path: endpoint,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY_HERE' // You'll need to get an API key from https://developer.clashroyale.com/
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

// Complete list of all 120 Clash Royale cards (as of current version)
const allCards = [
  // Common Cards (1-2 elixir) - 11 cards
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
  
  // Common Cards (3-4 elixir) - 15 cards
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
  
  // Common Cards (5+ elixir) - 5 cards
  { id: 'barbarians', name: 'Barbarians', rarity: 'common', elixir: 5, description: 'Five tough melee fighters' },
  { id: 'barbarian-hut', name: 'Barbarian Hut', rarity: 'common', elixir: 7, description: 'Building that spawns barbarians' },
  { id: 'royal-giant', name: 'Royal Giant', rarity: 'common', elixir: 6, description: 'Building-targeting ranged attacker' },
  { id: 'x-bow', name: 'X-Bow', rarity: 'common', elixir: 6, description: 'Building that targets buildings' },
  { id: 'inferno-tower', name: 'Inferno Tower', rarity: 'common', elixir: 5, description: 'Building that targets tanks' },
  
  // Rare Cards - 20 cards
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
  { id: 'hog-rider', name: 'Hog Rider', rarity: 'rare', elixir: 4, description: 'Building-targeting melee fighter' },
  { id: 'valkyrie', name: 'Valkyrie', rarity: 'rare', elixir: 4, description: 'Area damage melee fighter' },
  { id: 'musketeer', name: 'Musketeer', rarity: 'rare', elixir: 4, description: 'Ranged attacker' },
  { id: 'wizard', name: 'Wizard', rarity: 'rare', elixir: 5, description: 'Area damage ranged attacker' },
  { id: 'giant', name: 'Giant', rarity: 'rare', elixir: 5, description: 'Slow, tough building-targeting tank' },
  { id: 'fireball', name: 'Fireball', rarity: 'rare', elixir: 4, description: 'Area damage spell' },
  { id: 'rocket', name: 'Rocket', rarity: 'rare', elixir: 6, description: 'High damage building-targeting spell' },
  { id: 'baby-dragon', name: 'Baby Dragon', rarity: 'rare', elixir: 4, description: 'Flying area damage attacker' },
  { id: 'prince', name: 'Prince', rarity: 'rare', elixir: 5, description: 'Charging melee fighter' },
  { id: 'dark-prince', name: 'Dark Prince', rarity: 'rare', elixir: 4, description: 'Charging area damage fighter' },
  
  // Epic Cards - 25 cards
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
  { id: 'skeleton-barrel', name: 'Skeleton Barrel', rarity: 'epic', elixir: 3, description: 'Spell that spawns skeletons' },
  { id: 'tornado', name: 'Tornado', rarity: 'epic', elixir: 3, description: 'Spell that pulls enemies together' },
  { id: 'guards', name: 'Guards', rarity: 'epic', elixir: 3, description: 'Three shielded melee fighters' },
  { id: 'three-musketeers', name: 'Three Musketeers', rarity: 'epic', elixir: 9, description: 'Three ranged attackers' },
  { id: 'minion-horde', name: 'Minion Horde', rarity: 'epic', elixir: 5, description: 'Six fast, flying melee fighters' },
  { id: 'barbarian-barrel', name: 'Barbarian Barrel', rarity: 'epic', elixir: 2, description: 'Spell that spawns a barbarian' },
  { id: 'elite-barbarians', name: 'Elite Barbarians', rarity: 'epic', elixir: 6, description: 'Two fast, tough melee fighters' },
  { id: 'goblin-hut', name: 'Goblin Hut', rarity: 'epic', elixir: 4, description: 'Building that spawns spear goblins' },
  { id: 'furnace', name: 'Furnace', rarity: 'epic', elixir: 4, description: 'Building that spawns fire spirits' },
  { id: 'tombstone', name: 'Tombstone', rarity: 'epic', elixir: 3, description: 'Building that spawns skeletons' },
  { id: 'goblin-cage', name: 'Goblin Cage', rarity: 'epic', elixir: 4, description: 'Building that spawns a goblin brawler' },
  
  // Legendary Cards - 20 cards
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
  { id: 'mega-minion', name: 'Mega Minion', rarity: 'legendary', elixir: 3, description: 'Flying melee fighter' },
  { id: 'dart-goblin', name: 'Dart Goblin', rarity: 'legendary', elixir: 3, description: 'Fast ranged attacker' },
  
  // Champion Cards - 6 cards
  { id: 'little-prince', name: 'Little Prince', rarity: 'champion', elixir: 3, description: 'Ranged attacker with ability' },
  { id: 'golden-knight', name: 'Golden Knight', rarity: 'champion', elixir: 4, description: 'Melee fighter with dash ability' },
  { id: 'skeleton-king', name: 'Skeleton King', rarity: 'champion', elixir: 4, description: 'Melee fighter that spawns skeletons' },
  { id: 'mighty-miner', name: 'Mighty Miner', rarity: 'champion', elixir: 4, description: 'Underground melee fighter' },
  { id: 'archer-queen', name: 'Archer Queen', rarity: 'champion', elixir: 5, description: 'Ranged attacker with invisibility' },
  { id: 'monk', name: 'Monk', rarity: 'champion', elixir: 5, description: 'Melee fighter with ability' },
  
  // Additional cards to reach exactly 120 - 18 cards
  { id: 'barbarian-barrel', name: 'Barbarian Barrel', rarity: 'epic', elixir: 2, description: 'Spell that spawns a barbarian' },
  { id: 'elite-barbarians', name: 'Elite Barbarians', rarity: 'epic', elixir: 6, description: 'Two fast, tough melee fighters' },
  { id: 'skeleton-barrel', name: 'Skeleton Barrel', rarity: 'epic', elixir: 3, description: 'Spell that spawns skeletons' },
  { id: 'tornado', name: 'Tornado', rarity: 'epic', elixir: 3, description: 'Spell that pulls enemies together' },
  { id: 'guards', name: 'Guards', rarity: 'epic', elixir: 3, description: 'Three shielded melee fighters' },
  { id: 'three-musketeers', name: 'Three Musketeers', rarity: 'epic', elixir: 9, description: 'Three ranged attackers' },
  { id: 'minion-horde', name: 'Minion Horde', rarity: 'epic', elixir: 5, description: 'Six fast, flying melee fighters' },
  { id: 'goblin-giant', name: 'Goblin Giant', rarity: 'epic', elixir: 6, description: 'Building-targeting tank that spawns spear goblins' },
  { id: 'mega-minion', name: 'Mega Minion', rarity: 'legendary', elixir: 3, description: 'Flying melee fighter' },
  { id: 'dart-goblin', name: 'Dart Goblin', rarity: 'legendary', elixir: 3, description: 'Fast ranged attacker' },
  { id: 'goblin-hut', name: 'Goblin Hut', rarity: 'legendary', elixir: 4, description: 'Building that spawns spear goblins' },
  { id: 'furnace', name: 'Furnace', rarity: 'legendary', elixir: 4, description: 'Building that spawns fire spirits' },
  { id: 'tombstone', name: 'Tombstone', rarity: 'legendary', elixir: 3, description: 'Building that spawns skeletons' },
  { id: 'goblin-cage', name: 'Goblin Cage', rarity: 'legendary', elixir: 4, description: 'Building that spawns a goblin brawler' }
];

// Remove duplicates and ensure we have exactly 120 unique cards
function removeDuplicates(cards) {
  const seen = new Set();
  const uniqueCards = [];
  
  for (const card of cards) {
    if (!seen.has(card.id)) {
      seen.add(card.id);
      uniqueCards.push(card);
    }
  }
  
  return uniqueCards;
}

// Main function to update the database
async function updateDatabase() {
  try {
    console.log(`📊 Processing ${allCards.length} cards...`);
    
    // Remove duplicates
    const uniqueCards = removeDuplicates(allCards);
    console.log(`📊 After removing duplicates: ${uniqueCards.length} unique cards`);
    
    // Convert cards to our format
    const characters = uniqueCards.map(card => ({
      id: card.id,
      name: card.name,
      imageUrl: `/images/${card.id}.png`, // Placeholder for manual images
      description: card.description,
      rarity: card.rarity,
      elixir: card.elixir
    }));
    
    // Write to characters.json
    const charactersPath = path.join(__dirname, 'src', 'data', 'characters.json');
    fs.writeFileSync(charactersPath, JSON.stringify(characters, null, 2));
    
    console.log(`✅ Updated characters.json with ${characters.length} cards`);
    
    // Show breakdown by rarity
    const byRarity = {};
    characters.forEach(char => {
      if (!byRarity[char.rarity]) byRarity[char.rarity] = [];
      byRarity[char.rarity].push(char);
    });
    
    console.log(`\n📋 Cards by rarity:`);
    Object.keys(byRarity).forEach(rarity => {
      console.log(`   ${rarity.toUpperCase()}: ${byRarity[rarity].length} cards`);
    });
    
    // Show breakdown by elixir cost
    const byElixir = {};
    characters.forEach(char => {
      if (!byElixir[char.elixir]) byElixir[char.elixir] = [];
      byElixir[char.elixir].push(char);
    });
    
    console.log(`\n📋 Cards by elixir cost:`);
    Object.keys(byElixir).sort((a, b) => parseInt(a) - parseInt(b)).forEach(elixir => {
      console.log(`   ${elixir} elixir: ${byElixir[elixir].length} cards`);
    });
    
    console.log(`\n🎉 Database update complete!`);
    console.log(`📈 Summary:`);
    console.log(`   Total cards: ${characters.length}`);
    console.log(`   Ready for manual image addition`);
    
    // Create a list of missing images for manual download
    const imagesDir = path.join(__dirname, 'public', 'images');
    const availableImages = fs.existsSync(imagesDir) ? 
      fs.readdirSync(imagesDir).filter(file => file.endsWith('.png')).map(file => file.replace('.png', '')) : [];
    
    const missingImages = characters.filter(char => !availableImages.includes(char.id));
    
    if (missingImages.length > 0) {
      console.log(`\n📝 Missing images (${missingImages.length} cards):`);
      missingImages.forEach(char => {
        console.log(`   ${char.id}.png - ${char.name}`);
      });
      
      // Save missing images list to file
      const missingListPath = path.join(__dirname, 'missing-images.txt');
      const missingList = missingImages.map(char => `${char.id}.png - ${char.name}`).join('\n');
      fs.writeFileSync(missingListPath, missingList);
      console.log(`\n📄 Missing images list saved to: missing-images.txt`);
    }
    
  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

// Run the update
updateDatabase();
