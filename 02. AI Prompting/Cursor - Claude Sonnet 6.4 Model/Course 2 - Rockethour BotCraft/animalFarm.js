// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) - 10; // Center the farm
const startY = Math.floor(pos.y);
const startZ = Math.floor(pos.z) - 10;

// Function to create fenced pen
function createPen(x, z, width, length) {
    // Create grass floor with more flowers
    for(let i = 0; i < width; i++) {
        for(let j = 0; j < length; j++) {
            // Place grass blocks for the pen floor
            setBlockState("grass", [startX + x + i, startY - 1, startZ + z + j]);
            
            // Add random flowers and grass (40% chance)
            if(Math.random() < 0.4) {
                const flowers = ["red_flower", "yellow_flower", "blue_orchid", "allium", "azure_bluet", "tulip"];
                const flower = flowers[Math.floor(Math.random() * flowers.length)];
                setBlockState(flower, [startX + x + i, startY, startZ + z + j]);
            }
        }
    }
    
    // Create colorful fence border alternating between oak and birch
    for(let i = 0; i <= width; i++) {
        const fenceType = i % 2 === 0 ? "oak_fence" : "birch_fence";
        setBlockState(fenceType, [startX + x + i, startY, startZ + z]);
        setBlockState(fenceType, [startX + x + i, startY, startZ + z + length]);
    }
    for(let j = 0; j <= length; j++) {
        const fenceType = j % 2 === 0 ? "oak_fence" : "birch_fence";
        setBlockState(fenceType, [startX + x, startY, startZ + z + j]);
        setBlockState(fenceType, [startX + x + width, startY, startZ + z + j]);
    }
    
    // Add gate in middle of front side
    setBlockState("oak_fence_gate", 
        [startX + x + Math.floor(width/2), startY, startZ + z],
        null, "south"
    );
}

// Function to create a small pond
function createPond(x, z) {
    const pondShape = [
        [0,1,1,0],
        [1,2,2,1],
        [1,2,2,1],
        [0,1,1,0]
    ];
    
    for(let i = 0; i < pondShape.length; i++) {
        for(let j = 0; j < pondShape[i].length; j++) {
            if(pondShape[i][j] > 0) {
                // Dig pond
                setBlockState("dirt", [startX + x + i, startY - 2, startZ + z + j]);
                // Add water
                setBlockState("water", [startX + x + i, startY - 1, startZ + z + j]);
                
                // Add more lily pads (50% chance)
                if(pondShape[i][j] === 1 && Math.random() < 0.5) {
                    setBlockState("waterlily", [startX + x + i, startY, startZ + z + j]);
                }
            }
        }
    }
    
    // Add flowers around pond
    for(let i = -1; i <= 4; i++) {
        for(let j = -1; j <= 4; j++) {
            if(i === -1 || i === 4 || j === -1 || j === 4) {
                if(Math.random() < 0.7) {
                    const flowers = ["red_flower", "yellow_flower", "blue_orchid", "allium"];
                    const flower = flowers[Math.floor(Math.random() * flowers.length)];
                    setBlockState(flower, [startX + x + i, startY, startZ + z + j]);
                }
            }
        }
    }
}

// Function to create crop area
function createCropArea(x, z) {
    const crops = ["wheat", "carrots", "potatoes", "beetroots"];
    
    // Create farmland and crops
    for(let i = 0; i < 5; i++) {
        for(let j = 0; j < 4; j++) {
            // Place farmland
            setBlockState("farmland", [startX + x + i, startY - 1, startZ + z + j]);
            // Place random crops
            const crop = crops[Math.floor(Math.random() * crops.length)];
            setBlockState(crop, [startX + x + i, startY, startZ + z + j]);
        }
    }
    
    // Add water line for irrigation
    for(let j = 0; j < 4; j++) {
        setBlockState("water", [startX + x + 5, startY - 1, startZ + z + j]);
    }
    
    // Add flower border around crops
    for(let i = -1; i <= 6; i++) {
        setBlockState("red_flower", [startX + x + i, startY, startZ + z - 1]);
        setBlockState("yellow_flower", [startX + x + i, startY, startZ + z + 4]);
    }
}

// Function to spawn animals in a pen
function spawnAnimals(type, x, z, width, length, count) {
    for(let i = 0; i < count; i++) {
        // Random position within pen
        const posX = startX + x + 1 + Math.floor(Math.random() * (width - 2));
        const posZ = startZ + z + 1 + Math.floor(Math.random() * (length - 2));
        
        // Spawn the animal
        spawnEntity(type, [posX, startY, posZ]);
    }
}

// Function to build the entire farm
function buildFarm() {
    // Create chicken pen (8x6) and spawn chickens
    createPen(0, 0, 8, 6);
    spawnAnimals("chicken", 0, 0, 8, 6, 6);
    // Add some hay blocks for nests
    setBlockState("hay_block", [startX + 2, startY, startZ + 2]);
    setBlockState("hay_block", [startX + 6, startY, startZ + 4]);
    
    // Create cow pen (8x8) and spawn cows
    createPen(0, 8, 8, 8);
    spawnAnimals("cow", 0, 8, 8, 8, 4);
    // Add water trough
    setBlockState("water", [startX + 4, startY - 1, startZ + 12]);
    
    // Create sheep pen (8x6) and spawn sheep
    createPen(10, 0, 8, 6);
    spawnAnimals("sheep", 10, 0, 8, 6, 5);
    
    // Create pig pen (8x8) and spawn pigs
    createPen(10, 8, 8, 8);
    spawnAnimals("pig", 10, 8, 8, 8, 4);
    // Add mud (brown concrete powder)
    setBlockState("concrete_powder", [startX + 14, startY - 1, startZ + 12], "brown");
    setBlockState("concrete_powder", [startX + 15, startY - 1, startZ + 13], "brown");
    
    // Create crop area
    createCropArea(20, 0);
    
    // Create decorative pond
    createPond(20, 8);
    
    // Add some trees around the farm (oak and birch saplings)
    const treePositions = [
        [0, -2], [8, -2], [16, -2],  // Front row
        [-2, 6], [20, 6],            // Sides
        [8, 18], [16, 18]            // Back row
    ];
    
    treePositions.forEach(pos => {
        // Alternate between oak and birch saplings
        const saplingType = Math.random() < 0.5 ? "sapling" : "birch_sapling";
        setBlockState(saplingType, [startX + pos[0], startY, startZ + pos[1]]);
        
        // Add flower ring around each tree
        for(let i = -1; i <= 1; i++) {
            for(let j = -1; j <= 1; j++) {
                if(i !== 0 || j !== 0) {
                    if(Math.random() < 0.7) {
                        const flowers = ["red_flower", "yellow_flower", "blue_orchid", "allium", "azure_bluet", "tulip"];
                        const flower = flowers[Math.floor(Math.random() * flowers.length)];
                        setBlockState(flower, [startX + pos[0] + i, startY, startZ + pos[1] + j]);
                    }
                }
            }
        }
    });
}

// Build the farm
buildFarm();
sendChatMessage("Colorful farm created with animals! 🌾🐔🐄🐑🐖"); 