// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x);
const startY = Math.floor(pos.y);
const startZ = Math.floor(pos.z) + 5; // Start 5 blocks away from player

// Function to create a branch segment
function createBranch(x, y, z, length, thickness, angle) {
    // Create the branch using logs with varying thickness
    for(let i = 0; i < length; i++) {
        // Calculate position based on angle
        const dx = Math.round(Math.sin(angle) * i);
        const dz = Math.round(Math.cos(angle) * i);
        
        // Create branch with thickness
        for(let tx = 0; tx < thickness; tx++) {
            for(let tz = 0; tz < thickness; tz++) {
                setBlockState("log", [x + dx + tx, y + i, z + dz + tz]);
            }
        }
    }
}

// Function to create leaf cluster
function createLeafCluster(x, y, z, size) {
    const radius = size + 2;
    for(let dx = -radius; dx <= radius; dx++) {
        for(let dy = -radius; dy <= radius; dy++) {
            for(let dz = -radius; dz <= radius; dz++) {
                const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if(distance <= radius && Math.random() < 0.7) {
                    setBlockState("leaves", [x + dx, y + dy, z + dz]);
                }
            }
        }
    }
}

// Recursive function to create the fractal tree
function createFractalTree(x, y, z, length, thickness, angle, depth) {
    if(depth === 0 || length < 2) {
        createLeafCluster(x, y, z, thickness);
        return;
    }
    
    // Create main branch
    createBranch(x, y, z, length, thickness, angle);
    
    // Calculate endpoint of current branch
    const endX = x + Math.round(Math.sin(angle) * length);
    const endY = y + length;
    const endZ = z + Math.round(Math.cos(angle) * length);
    
    // Parameters for sub-branches
    const newLength = Math.floor(length * 0.75);
    const newThickness = Math.max(1, thickness - 1);
    
    // Create multiple sub-branches at different angles
    const numBranches = 5; // Number of branches at each split
    const angleSpread = Math.PI; // How wide the branches spread
    
    for(let i = 0; i < numBranches; i++) {
        // Calculate angle for each branch
        const newAngle = angle + (angleSpread * (i / (numBranches - 1)) - angleSpread/2);
        
        // Add some randomness to branch parameters
        const branchLength = newLength * (0.9 + Math.random() * 0.2);
        const branchThickness = Math.max(1, Math.floor(newThickness * (0.9 + Math.random() * 0.2)));
        
        // Create sub-branch with 90% probability
        if(Math.random() < 0.9) {
            createFractalTree(
                endX,
                endY,
                endZ,
                branchLength,
                branchThickness,
                newAngle,
                depth - 1
            );
        }
    }
}

// Function to clear space
function clearSpace(x, y, z, size) {
    for(let dy = 0; dy < size * 3; dy++) {
        for(let dx = -size * 2; dx <= size * 2; dx++) {
            for(let dz = -size * 2; dz <= size * 2; dz++) {
                setBlockState("air", [x + dx, y + dy, z + dz]);
            }
        }
    }
}

// Main function to build the tree
function buildFractalTree() {
    // Parameters for a large fractal tree
    const initialHeight = 25;    // Taller initial height
    const initialThickness = 3;  // Start with thick trunk
    const maxDepth = 6;         // More iterations for complexity
    const startAngle = 0;       // Start growing straight up
    
    // Clear space first
    clearSpace(startX, startY, startZ, initialHeight);
    
    // Create larger dirt base
    for(let dx = -3; dx <= 3; dx++) {
        for(let dz = -3; dz <= 3; dz++) {
            if(Math.sqrt(dx*dx + dz*dz) <= 3) {
                setBlockState("grass", [startX + dx, startY - 1, startZ + dz]);
            }
        }
    }
    
    // Create the fractal tree
    createFractalTree(
        startX,
        startY,
        startZ,
        initialHeight,
        initialThickness,
        startAngle,
        maxDepth
    );
    
    // Add explanation messages
    sendChatMessage("Complex fractal tree created! 🌳");
    sendChatMessage("This mathematical tree has:");
    sendChatMessage("- Height: " + initialHeight + " blocks");
    sendChatMessage("- " + maxDepth + " levels of branching");
    sendChatMessage("- " + Math.pow(5, maxDepth) + " potential end branches");
}

// Execute the build
buildFractalTree(); 