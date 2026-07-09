// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) - 5; // Center the tower (10 blocks wide)
const startY = Math.floor(pos.y);
const startZ = Math.floor(pos.z) - 5;

// Function to create the base structure
function createBase() {
    // Create a 10x10 foundation
    for(let x = 0; x < 10; x++) {
        for(let z = 0; z < 10; z++) {
            // Make foundation 2 blocks thick
            setBlockState("quartz_block", [startX + x, startY, startZ + z]);
            setBlockState("quartz_block", [startX + x, startY + 1, startZ + z]);
        }
    }
    
    // Create entrance doorway
    setBlockState("air", [startX + 4, startY + 2, startZ]);
    setBlockState("air", [startX + 5, startY + 2, startZ]);
    setBlockState("air", [startX + 4, startY + 3, startZ]);
    setBlockState("air", [startX + 5, startY + 3, startZ]);
}

// Function to create the main tower structure
function createTower() {
    // Tower will taper as it goes up
    for(let y = 2; y < 50; y++) {
        const shrinkFactor = Math.floor(y / 10); // Shrink every 10 blocks
        
        for(let x = 0 + shrinkFactor; x < 10 - shrinkFactor; x++) {
            for(let z = 0 + shrinkFactor; z < 10 - shrinkFactor; z++) {
                // Create outer glass walls
                if(x === 0 + shrinkFactor || x === 9 - shrinkFactor || 
                   z === 0 + shrinkFactor || z === 9 - shrinkFactor) {
                    setBlockState("glass", [startX + x, startY + y, startZ + z]);
                }
                // Create inner floor every 5 blocks with flower decorations
                else if(y % 5 === 0) {
                    setBlockState("quartz_block", [startX + x, startY + y, startZ + z]);
                    // Add flowers on the edges of each floor
                    if((x === 1 + shrinkFactor || x === 8 - shrinkFactor || 
                        z === 1 + shrinkFactor || z === 8 - shrinkFactor) && 
                       Math.random() < 0.7) {
                        const flowers = ["red_flower", "yellow_flower", "blue_orchid", 
                                      "allium", "azure_bluet", "tulip", "oxeye_daisy"];
                        const flower = flowers[Math.floor(Math.random() * flowers.length)];
                        setBlockState(flower, [startX + x, startY + y + 1, startZ + z]);
                    }
                }
            }
        }
    }
}

// Function to create the spire at the top
function createSpire() {
    for(let y = 50; y < 60; y++) {
        const spireSize = 60 - y;
        
        for(let x = 0; x < spireSize; x++) {
            for(let z = 0; z < spireSize; z++) {
                if(x === 0 || x === spireSize - 1 || z === 0 || z === spireSize - 1) {
                    setBlockState("glass", [
                        startX + Math.floor((10 - spireSize) / 2) + x,
                        startY + y,
                        startZ + Math.floor((10 - spireSize) / 2) + z
                    ]);
                }
            }
        }
    }
}

// Function to add decorative elements
function addDecorations() {
    const flowers = [
        "red_flower", "yellow_flower", "blue_orchid", 
        "allium", "azure_bluet", "tulip", "oxeye_daisy"
    ];
    
    // Add flowers at the base (more dense garden)
    for(let x = -3; x < 13; x++) {
        for(let z = -3; z < 13; z++) {
            if(x < 0 || x >= 10 || z < 0 || z >= 10) { // Only around the base
                if(Math.random() < 0.8) { // Increased chance for flowers
                    // Place grass block
                    setBlockState("grass", [startX + x, startY - 1, startZ + z]);
                    // Place random flower
                    const flower = flowers[Math.floor(Math.random() * flowers.length)];
                    setBlockState(flower, [startX + x, startY, startZ + z]);
                }
            }
        }
    }
    
    // Add flowers at observation deck (top floor)
    for(let x = 2; x < 8; x++) {
        for(let z = 2; z < 8; z++) {
            if(x === 2 || x === 7 || z === 2 || z === 7) {
                const flower = flowers[Math.floor(Math.random() * flowers.length)];
                setBlockState(flower, [startX + x, startY + 49, startZ + z]);
            }
        }
    }
    
    // Add flower boxes at regular intervals on the outside
    for(let y = 10; y < 50; y += 10) {
        const shrinkFactor = Math.floor(y / 10);
        for(let x = 0 + shrinkFactor; x < 10 - shrinkFactor; x++) {
            for(let z = 0 + shrinkFactor; z < 10 - shrinkFactor; z++) {
                if(x === 0 + shrinkFactor || x === 9 - shrinkFactor || 
                   z === 0 + shrinkFactor || z === 9 - shrinkFactor) {
                    if(Math.random() < 0.5) {
                        const flower = flowers[Math.floor(Math.random() * flowers.length)];
                        setBlockState(flower, [startX + x, startY + y, startZ + z]);
                    }
                }
            }
        }
    }
    
    // Add some lighting
    for(let y = 5; y < 50; y += 5) {
        setBlockState("glowstone", [startX + 2, startY + y, startZ + 2]);
        setBlockState("glowstone", [startX + 7, startY + y, startZ + 7]);
    }
}

// Function to build the entire tower
function buildBurjKhalifa() {
    createBase();
    createTower();
    createSpire();
    addDecorations();
    sendChatMessage("Floral Glass Tower created! 🌸🏢✨");
}

// Execute the build
buildBurjKhalifa(); 