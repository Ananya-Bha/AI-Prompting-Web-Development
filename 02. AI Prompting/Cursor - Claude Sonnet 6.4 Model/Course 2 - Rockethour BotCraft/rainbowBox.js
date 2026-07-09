// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) - 5; // Center the box on player (10 blocks wide)
const startY = Math.floor(pos.y) + 3; // Start 3 blocks above player
const startZ = Math.floor(pos.z) - 5; // Center on player

// Define colors for each layer (12 colors for 12 layers)
const colors = [
    "red",
    "orange", 
    "yellow",
    "lime",
    "light_blue",
    "cyan",
    "blue",
    "purple",
    "magenta",
    "pink",
    "white",
    "light_gray"
];

// Build the box layer by layer
for(let y = 0; y < 12; y++) {
    // Current layer color
    const color = colors[y];
    
    // Create each layer
    for(let x = 0; x < 10; x++) {
        for(let z = 0; z < 10; z++) {
            // Only place blocks on the edges to make it hollow
            if (x === 0 || x === 9 || z === 0 || z === 9) {
                setBlockState("wool", 
                    [startX + x, startY + y, startZ + z],
                    color
                );
            }
        }
    }
}

// Add a message when complete
sendChatMessage("Rainbow box created! 🌈"); 