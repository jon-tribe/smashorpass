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

// Get list of character IDs that are already in the data
const existingIds = characters.map(char => char.id);

// Find images that don't have corresponding characters
const missingImages = availableImages.filter(imageId => !existingIds.includes(imageId));

console.log(`📊 Analysis:`);
console.log(`   Available images: ${availableImages.length}`);
console.log(`   Characters in JSON: ${characters.length}`);
console.log(`   Missing characters: ${missingImages.length}`);

// Add missing characters with placeholder data
const newCharacters = missingImages.map(imageId => {
  // Convert image ID to display name
  const displayName = imageId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    id: imageId,
    name: displayName,
    imageUrl: `/images/${imageId}.png`,
    description: `${displayName} - Clash Royale character`,
    rarity: "common", // Default rarity
    elixir: 4 // Default elixir cost
  };
});

// Combine existing and new characters
const updatedCharacters = [...characters, ...newCharacters];

// Write the updated characters data
fs.writeFileSync(charactersPath, JSON.stringify(updatedCharacters, null, 2));

console.log(`\n🎉 Updated characters.json with ${updatedCharacters.length} characters`);
console.log(`📝 Added ${newCharacters.length} new characters`);

// Show the new characters
console.log(`\n📋 New characters added:`);
newCharacters.forEach(char => {
  console.log(`   ✅ ${char.name} (${char.id})`);
});

console.log(`\n📋 Total characters now: ${updatedCharacters.length}`);
