// Official Clash Royale Card ID Mapping
// This maps our friendly card IDs to the official Clash Royale card IDs used in deck links

export const cardIdMapping = {
  // Common Cards
  "skeletons": "26000024",
  "ice-spirit": "26000077", 
  "fire-spirit": "26000061",
  "electro-spirit": "26000017",
  "heal-spirit": "26000010",
  "goblins": "26000084",
  "spear-goblins": "28000026",
  "bats": "28000015",
  "zap": "28000013",
  "giant-snowball": "28000014",
  "wall-breakers": "28000016",
  "archers": "26000001",
  "knight": "26000002",
  "minions": "26000003",
  "cannon": "27000000",
  "barbarians": "26000004",
  "royal-giant": "26000005",
  "musketeer": "26000006",
  "valkyrie": "26000007",
  "hog-rider": "26000008",
  "wizard": "26000009",
  "giant": "26000011",
  "fireball": "28000000",
  "rocket": "28000001",
  "baby-dragon": "26000012",
  "prince": "26000013",
  "dark-prince": "26000014",
  "witch": "26000015",
  "balloon": "26000016",
  "goblin-barrel": "28000002",
  "freeze": "28000003",
  "poison": "28000004",
  "lightning": "28000005",
  "pekka": "26000018",
  "golem": "26000019",
  "the-log": "28000006",
  "miner": "26000020",
  "princess": "26000021",
  "ice-wizard": "26000022",
  "royal-ghost": "26000023",
  "bandit": "26000025",
  "lumberjack": "26000026",
  "inferno-dragon": "26000027",
  "electro-wizard": "26000028",
  "magic-archer": "26000029",
  "night-witch": "26000030",
  "mother-witch": "26000031",
  "ram-rider": "26000032",
  "graveyard": "28000007",
  "sparky": "26000033",
  "lava-hound": "26000034",
  "mega-knight": "26000035",
  "little-prince": "26000036",
  "golden-knight": "26000037",
  "skeleton-king": "26000038",
  "mighty-miner": "26000039",
  "archer-queen": "26000040",
  "monk": "26000041",
  "fisherman": "26000042",
  "cannon-cart": "27000001",
  "barbarian-hut": "27000002",
  "furnace": "27000003",
  "goblin-hut": "27000004",
  "tombstone": "27000005",
  "tesla": "27000006",
  "x-bow": "27000007",
  "mortar": "27000008",
  "inferno-tower": "27000009",
  "bomb-tower": "27000010",
  "goblin-cage": "27000011",
  "goblin-drill": "27000012",
  "goblin-gang": "28000008",
  "skeleton-army": "28000009",
  "skeleton-barrel": "28000010",
  "skeleton-dragons": "28000011",
  "minion-horde": "28000012",
  "three-musketeers": "28000017",
  "elite-barbarians": "28000018",
  "royal-hogs": "28000019",
  "royal-delivery": "28000020",
  "royal-recruits": "28000021",
  "rascals": "28000022",
  "zappies": "28000023",
  "battle-ram": "28000024",
  "battle-healer": "28000025",
  "clone": "28000027",
  "mirror": "28000028",
  "rage": "28000029",
  "tornado": "28000030",
  "goblin-giant": "26000043",
  "executioner": "26000044",
  "flying-machine": "26000045",
  "hunter": "26000046",
  "bowler": "26000047",
  "dart-goblin": "26000048",
  "cannoneer": "26000049",
  
  // Creator Cards (these won't have official IDs, so we'll use placeholder IDs)
  // Users will need to replace these with real cards
  "jynxzi": "00000000", // Placeholder - needs replacement
  "juicyj": "00000000", // Placeholder - needs replacement  
  "thebigyazz": "00000000", // Placeholder - needs replacement
  "ken": "00000000", // Placeholder - needs replacement
  "oj": "00000000", // Placeholder - needs replacement
  "xqc": "00000000", // Placeholder - needs replacement
  "reckers": "00000000", // Placeholder - needs replacement
  "bobby": "00000000", // Placeholder - needs replacement
  "Mr-ClashBroyale": "00000000" // Placeholder - needs replacement
};

// Function to check if a card has a valid official ID
export const hasValidCardId = (cardId) => {
  return cardIdMapping[cardId] && cardIdMapping[cardId] !== "00000000";
};

// Function to get official card ID
export const getOfficialCardId = (cardId) => {
  return cardIdMapping[cardId] || "00000000";
};
