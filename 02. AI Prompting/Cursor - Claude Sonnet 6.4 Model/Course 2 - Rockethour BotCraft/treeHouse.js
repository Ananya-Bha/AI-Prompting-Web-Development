// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x);
const startY = Math.floor(pos.y);
const startZ = Math.floor(pos.z);

// Function to create the main tree trunk
function createTrunk() {
    // Create large trunk (5x5)
    for(let y = 0; y < 15; y++) {
        for(let x = -2; x <= 2; x++) {
            for(let z = -2; z <= 2; z++) {
                // Make trunk hollow from inside
                if(x === -2 || x === 2 || z === -2 || z === 2) {
                    setBlockState("log", [startX + x, startY + y, startZ + z]);
                }
            }
        }
    }
    
    // Add some roots at the base
    const roots = [
        [-3, 0, -1], [-3, 0, 0], [-3, 0, 1],
        [3, 0, -1], [3, 0, 0], [3, 0, 1],
        [-1, 0, -3], [0, 0, -3], [1, 0, -3],
        [-1, 0, 3], [0, 0, 3], [1, 0, 3]
    ];
    
    roots.forEach(coord => {
        setBlockState("log", [startX + coord[0], startY + coord[1], startZ + coord[2]]);
    });
}

// Function to create spiral staircase
function createStaircase() {
    // Create spiral stairs inside the trunk
    for(let y = 0; y < 15; y++) {
        const angle = (y * Math.PI) / 2; // 90 degree rotation every 4 blocks
        const x = Math.round(Math.cos(angle));
        const z = Math.round(Math.sin(angle));
        
        // Place oak stairs
        setBlockState("oak_stairs", 
            [startX + x, startY + y, startZ + z],
            null,
            getStairDirection(angle)
        );
        
        // Add glowstone every 4 blocks for lighting
        if(y % 4 === 0) {
            setBlockState("glowstone", [startX + x, startY + y + 1, startZ + z]);
        }
    }
}

// Helper function to determine stair direction based on angle
function getStairDirection(angle) {
    const normalized = angle % (2 * Math.PI);
    if(normalized < Math.PI/4 || normalized > 7*Math.PI/4) return "east";
    if(normalized < 3*Math.PI/4) return "north";
    if(normalized < 5*Math.PI/4) return "west";
    return "south";
}

// Function to create the treehouse
function createHouse() {
    // Create main platform (9x9)
    for(let x = -4; x <= 4; x++) {
        for(let z = -4; z <= 4; z++) {
            setBlockState("planks", [startX + x, startY + 15, startZ + z]);
        }
    }
    
    // Create walls
    for(let y = 16; y <= 19; y++) {
        for(let x = -4; x <= 4; x++) {
            for(let z = -4; z <= 4; z++) {
                if(x === -4 || x === 4 || z === -4 || z === 4) {
                    setBlockState("planks", [startX + x, startY + y, startZ + z]);
                }
            }
        }
    }
    
    // Create windows
    const windows = [
        [-4, 17, 0], [-4, 17, 1], [-4, 17, -1], // Left window
        [4, 17, 0], [4, 17, 1], [4, 17, -1],    // Right window
        [0, 17, -4], [1, 17, -4], [-1, 17, -4], // Front window
        [0, 17, 4], [1, 17, 4], [-1, 17, 4]     // Back window
    ];
    
    windows.forEach(coord => {
        setBlockState("glass", [startX + coord[0], startY + coord[1], startZ + coord[2]]);
    });
    
    // Create roof
    for(let x = -5; x <= 5; x++) {
        for(let z = -5; z <= 5; z++) {
            setBlockState("wooden_slab", [startX + x, startY + 20, startZ + z]);
        }
    }
}

// Function to add decorations
function addDecorations() {
    const flowers = [
        "red_flower", "yellow_flower", "blue_orchid", 
        "allium", "azure_bluet", "tulip", "oxeye_daisy"
    ];
    
    // Add flower boxes on platform edges
    for(let x = -4; x <= 4; x++) {
        if(x % 2 === 0) {
            const flower = flowers[Math.floor(Math.random() * flowers.length)];
            setBlockState(flower, [startX + x, startY + 16, startZ - 4]);
            setBlockState(flower, [startX + x, startY + 16, startZ + 4]);
        }
    }
    
    for(let z = -4; z <= 4; z++) {
        if(z % 2 === 0) {
            const flower = flowers[Math.floor(Math.random() * flowers.length)];
            setBlockState(flower, [startX - 4, startY + 16, startZ + z]);
            setBlockState(flower, [startX + 4, startY + 16, startZ + z]);
        }
    }
    
    // Add interior lighting
    setBlockState("glowstone", [startX + 2, startY + 19, startZ + 2]);
    setBlockState("glowstone", [startX - 2, startY + 19, startZ + 2]);
    setBlockState("glowstone", [startX + 2, startY + 19, startZ - 2]);
    setBlockState("glowstone", [startX - 2, startY + 19, startZ - 2]);
    
    // Add some vines hanging from the platform
    for(let y = 0; y < 15; y++) {
        if(Math.random() < 0.3) {
            setBlockState("vine", [startX - 4, startY + y, startZ - 4]);
            setBlockState("vine", [startX + 4, startY + y, startZ - 4]);
            setBlockState("vine", [startX - 4, startY + y, startZ + 4]);
            setBlockState("vine", [startX + 4, startY + y, startZ + 4]);
        }
    }
    
    // Add ground level garden
    for(let x = -5; x <= 5; x++) {
        for(let z = -5; z <= 5; z++) {
            if(Math.abs(x) > 2 || Math.abs(z) > 2) { // Outside trunk
                if(Math.random() < 0.4) {
                    setBlockState("grass", [startX + x, startY - 1, startZ + z]);
                    const flower = flowers[Math.floor(Math.random() * flowers.length)];
                    setBlockState(flower, [startX + x, startY, startZ + z]);
                }
            }
        }
    }
}

// Function to build everything
function buildTreeHouse() {
    createTrunk();
    createStaircase();
    createHouse();
    addDecorations();
    sendChatMessage("Cozy treehouse created! 🌳🏠✨");
}

// Execute the build
buildTreeHouse(); 