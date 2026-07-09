// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) - 15; // Center the palace (30 blocks wide)
const startY = Math.floor(pos.y);
const startZ = Math.floor(pos.z) - 15; // Center the palace (30 blocks wide)

// Function to create the main palace structure
function buildPalace() {
    // Build the walls and corners (40 blocks high)
    for(let y = 0; y < 40; y++) {
        for(let x = 0; x < 30; x++) {
            for(let z = 0; z < 30; z++) {
                // Only place blocks for walls (edges) and make it hollow
                if (x === 0 || x === 29 || z === 0 || z === 29) {
                    setBlockState("glass", [startX + x, startY + y, startZ + z]);
                }
            }
        }
    }

    // Add floor
    for(let x = 0; x < 30; x++) {
        for(let z = 0; z < 30; z++) {
            setBlockState("quartz_block", [startX + x, startY, startZ + z]);
        }
    }
}

// Function to build the rooftop pool
function buildPool() {
    const poolY = startY + 40; // Pool starts at top of palace
    
    // Create pool floor
    for(let x = 0; x < 30; x++) {
        for(let z = 0; z < 30; z++) {
            setBlockState("glass", [startX + x, poolY, startZ + z]);
        }
    }
    
    // Create pool walls
    for(let y = 1; y <= 3; y++) {
        for(let x = 0; x < 30; x++) {
            for(let z = 0; z < 30; z++) {
                if (x === 0 || x === 29 || z === 0 || z === 29) {
                    setBlockState("glass", [startX + x, poolY + y, startZ + z]);
                }
            }
        }
    }
    
    // Fill pool with water
    for(let x = 1; x < 29; x++) {
        for(let z = 1; z < 29; z++) {
            setBlockState("water", [startX + x, poolY + 1, startZ + z]);
        }
    }
}

// Function to create the garden
function buildGarden() {
    const flowers = ["red_flower", "yellow_flower"];
    const tall_flowers = ["double_plant"]; // Sunflowers, lilac, rose bush, peony
    
    // Create garden border (3 blocks wide around palace)
    for(let x = -3; x < 33; x++) {
        for(let z = -3; z < 33; z++) {
            // Skip if inside palace footprint
            if (x >= 0 && x < 30 && z >= 0 && z < 30) continue;
            
            // Place grass blocks
            setBlockState("grass", [startX + x, startY - 1, startZ + z]);
            
            // Randomly place flowers
            if (Math.random() < 0.3) { // 30% chance for a flower
                const flower = flowers[Math.floor(Math.random() * flowers.length)];
                setBlockState(flower, [startX + x, startY, startZ + z]);
            } else if (Math.random() < 0.1) { // 10% chance for tall flowers
                const tallFlower = tall_flowers[Math.floor(Math.random() * tall_flowers.length)];
                setBlockState(tallFlower, [startX + x, startY, startZ + z]);
            }
        }
    }
}

// Build everything
function buildGlassPalace() {
    buildPalace();
    buildPool();
    buildGarden();
    sendChatMessage("Glass palace with rooftop pool and garden created! ✨");
}

// Execute the build
buildGlassPalace(); 