// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) + 1; // 1 block away from player
const startY = Math.floor(pos.y);      // Same height as player
const startZ = Math.floor(pos.z);      // Same Z position as player

// Create a single orange wool block
setBlockState("wool", [startX, startY, startZ], "orange");

// Let the player know it's done
sendChatMessage("Orange cube created! 🟧"); 