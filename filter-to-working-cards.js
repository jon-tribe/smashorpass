const fs = require('fs');
const path = require('path');

// Read the current characters data
const charactersPath = path.join(__dirname, 'src', 'data', 'characters.json');
const characters = JSON.parse(fs.readFileSync(charactersPath, 'utf8'));

// Get list of available images
const imagesDir = path.join(__dirname, 'public', 'images');
const availableImages = fs.readdirSync(imagesDir)
  .filter(file => file.endsWith('.png'))
  .map(file => file.replace('.png', ''));

console.log(`📊 Current status:`);
console.log(`   Total characters in JSON: ${characters.length}`);
console.log(`   Available images: ${availableImages.length}`);

// Filter characters to only include those with images
const workingCharacters = characters.filter(character => {
  const hasImage = availableImages.includes(character.id);
  if (!hasImage) {
    console.log(`❌ Removing ${character.name} (${character.id}) - no image available`);
  }
  return hasImage;
});

console.log(`\n✅ Characters with working images: ${workingCharacters.length}`);

// Write the filtered characters data
fs.writeFileSync(charactersPath, JSON.stringify(workingCharacters, null, 2));

console.log(`\n🎉 Updated characters.json with ${workingCharacters.length} working characters`);
console.log(`📝 Removed ${characters.length - workingCharacters.length} characters without images`);

// Show the working characters by rarity
const byRarity = {};
workingCharacters.forEach(char => {
  if (!byRarity[char.rarity]) byRarity[char.rarity] = [];
  byRarity[char.rarity].push(char);
});

console.log(`\n📋 Working characters by rarity:`);
Object.keys(byRarity).forEach(rarity => {
  console.log(`   ${rarity.toUpperCase()}: ${byRarity[rarity].length} cards`);
  byRarity[rarity].forEach(char => {
    console.log(`     ✅ ${char.name} (${char.elixir} elixir)`);
  });
});

console.log(`\n🎮 Your Smash or Pass app now has ${workingCharacters.length} working cards!`);
