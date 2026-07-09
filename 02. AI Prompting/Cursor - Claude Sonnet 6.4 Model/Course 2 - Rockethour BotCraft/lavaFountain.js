// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) + 10; // 10 blocks away from player
const startY = Math.floor(pos.y);
const startZ = Math.floor(pos.z);

// Function to create the base of the fountain
function createBase() {
    // Create a 5x5 platform of obsidian
    for(let x = -2; x <= 2; x++) {
        for(let z = -2; z <= 2; z++) {
            // Make the base 2 blocks thick
            setBlockState("obsidian", [startX + x, startY, startZ + z]);
            setBlockState("obsidian", [startX + x, startY + 1, startZ + z]);
        }
    }
    
    // Create a decorative rim around the base
    for(let x = -2; x <= 2; x++) {
        for(let z = -2; z <= 2; z++) {
            // Only place blocks on the edges
            if (x === -2 || x === 2 || z === -2 || z === 2) {
                setBlockState("obsidian", [startX + x, startY + 2, startZ + z]);
            }
        }
    }
}

// Function to create the central pillar
function createPillar() {
    // Create the main pillar
    for(let y = 2; y < 10; y++) {
        // Create a 3x3 pillar
        for(let x = -1; x <= 1; x++) {
            for(let z = -1; z <= 1; z++) {
                // Make the pillar hollow
                if (x === -1 || x === 1 || z === -1 || z === 1) {
                    setBlockState("obsidian", [startX + x, startY + y, startZ + z]);
                }
            }
        }
    }
}

// Function to create the top fountain piece
function createTop() {
    const topY = startY + 10;
    
    // Create the top bowl shape
    for(let x = -2; x <= 2; x++) {
        for(let z = -2; z <= 2; z++) {
            // Create bowl shape with obsidian
            if (Math.abs(x) === 2 || Math.abs(z) === 2) {
                setBlockState("obsidian", [startX + x, topY, startZ + z]);
                setBlockState("obsidian", [startX + x, topY - 1, startZ + z]);
            }
        }
    }
    
    // Add decorative corners
    for(let x = -2; x <= 2; x += 4) {
        for(let z = -2; z <= 2; z += 4) {
            setBlockState("obsidian", [startX + x, topY + 1, startZ + z]);
        }
    }
}

// Function to add the lava flows
function addLava() {
    // Add lava source blocks at the top
    for(let x = -1; x <= 1; x++) {
        for(let z = -1; z <= 1; z++) {
            if (!(x === 0 && z === 0)) {
                setBlockState("lava", [startX + x, startY + 10, startZ + z]);
            }
        }
    }
    
    // Add central lava pillar
    for(let y = 2; y < 10; y++) {
        setBlockState("lava", [startX, startY + y, startZ]);
    }
    
    // Add lava pool at the base
    for(let x = -1; x <= 1; x++) {
        for(let z = -1; z <= 1; z++) {
            setBlockState("lava", [startX + x, startY + 2, startZ + z]);
        }
    }
}

// Function to add some decorative elements
function addDecorations() {
    // Add glowstone for lighting
    for(let x = -2; x <= 2; x += 4) {
        for(let z = -2; z <= 2; z += 4) {
            setBlockState("glowstone", [startX + x, startY + 1, startZ + z]);
        }
    }
    
    // Add some netherrack accents
    for(let x = -3; x <= 3; x++) {
        for(let z = -3; z <= 3; z++) {
            if (Math.abs(x) === 3 || Math.abs(z) === 3) {
                if(Math.random() < 0.7) {
                    setBlockState("netherrack", [startX + x, startY, startZ + z]);
                    // Add fire on some netherrack (50% chance)
                    if(Math.random() < 0.5) {
                        setBlockState("fire", [startX + x, startY + 1, startZ + z]);
                    }
                }
            }
        }
    }
}

// Build the fountain
function buildLavaFountain() {
    createBase();
    createPillar();
    createTop();
    addLava();
    addDecorations();
    sendChatMessage("Lava fountain created! 🌋");
}

// Execute the build
buildLavaFountain(); 