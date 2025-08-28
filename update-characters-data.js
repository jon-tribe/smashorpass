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
const filteredCharacters = characters.filter(character => {
  const hasImage = availableImages.includes(character.id);
  if (!hasImage) {
    console.log(`❌ Removing ${character.name} (${character.id}) - no image available`);
  }
  return hasImage;
});

console.log(`\n✅ Characters with images: ${filteredCharacters.length}`);

// Write the updated characters data
fs.writeFileSync(charactersPath, JSON.stringify(filteredCharacters, null, 2));

console.log(`\n🎉 Updated characters.json with ${filteredCharacters.length} characters`);
console.log(`📝 Removed ${characters.length - filteredCharacters.length} characters without images`);

// Show the remaining characters
console.log(`\n📋 Characters with images:`);
filteredCharacters.forEach(char => {
  console.log(`   ✅ ${char.name} (${char.id})`);
});
