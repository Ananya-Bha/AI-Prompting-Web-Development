// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x) - 1;  // Center cube on player (-1 for 3x3)
const startY = Math.floor(pos.y) + 4;  // 4 blocks above player
const startZ = Math.floor(pos.z) - 1;  // Center on player (-1 for 3x3)

// Function to create the hollow cube with holes
function createHollowCube() {
    // Create each layer of the cube
    for(let y = 0; y < 3; y++) {
        for(let x = 0; x < 3; x++) {
            for(let z = 0; z < 3; z++) {
                // Skip center block of each face to create holes
                if (
                    // Skip middle of top and bottom faces
                    (y === 1 && x === 1 && z === 1) ||  // Center hole
                    (y === 0 && x === 1 && z === 1) ||  // Bottom hole
                    (y === 2 && x === 1 && z === 1) ||  // Top hole
                    (x === 1 && y === 1 && z === 0) ||  // Front hole
                    (x === 1 && y === 1 && z === 2) ||  // Back hole
                    (x === 0 && y === 1 && z === 1) ||  // Left hole
                    (x === 2 && y === 1 && z === 1)     // Right hole
                ) {
                    continue; // Skip these positions
                }
                
                // Place yellow wool blocks for the frame
                setBlockState("wool", 
                    [startX + x, startY + y, startZ + z],
                    "yellow"
                );
            }
        }
    }
}

// Build the cube
createHollowCube();
sendChatMessage("Hollow yellow cube created with holes! 🟨"); 