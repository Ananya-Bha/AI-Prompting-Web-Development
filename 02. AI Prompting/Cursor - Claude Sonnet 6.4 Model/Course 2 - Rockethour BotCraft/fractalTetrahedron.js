// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x);
const startY = Math.floor(pos.y) + 5; // Start 5 blocks above player
const startZ = Math.floor(pos.z);

// Function to create a single tetrahedron point
function createPoint(x, y, z) {
    setBlockState("diamond_block", [x, y, z]);
}

// Function to create a tetrahedron at given position with given size
function createTetrahedron(x, y, z, size, depth) {
    // Base case: if we've reached depth 0 or minimum size, create a point
    if(depth === 0 || size < 2) {
        createPoint(x, y, z);
        return;
    }
    
    // Calculate new size (half of current)
    const newSize = Math.floor(size / 2);
    
    // Create four smaller tetrahedrons:
    
    // Bottom front
    createTetrahedron(
        x,
        y,
        z,
        newSize,
        depth - 1
    );
    
    // Bottom left
    createTetrahedron(
        x - newSize,
        y,
        z - newSize,
        newSize,
        depth - 1
    );
    
    // Bottom right
    createTetrahedron(
        x + newSize,
        y,
        z - newSize,
        newSize,
        depth - 1
    );
    
    // Top center
    createTetrahedron(
        x,
        y + newSize,
        z - newSize,
        newSize,
        depth - 1
    );
}

// Function to clear space
function clearSpace(x, y, z, size) {
    for(let dy = 0; dy < size * 2; dy++) {
        for(let dx = -size; dx <= size; dx++) {
            for(let dz = -size; dz <= size; dz++) {
                setBlockState("air", [x + dx, y + dy, z + dz]);
            }
        }
    }
}

// Function to add decorative elements
function addDecorations(x, y, z, size) {
    // Add glowstone highlights at key points
    const points = [
        [0, 0, 0],          // Base center
        [-size, 0, -size],  // Base left
        [size, 0, -size],   // Base right
        [0, size, -size]    // Top point
    ];
    
    points.forEach(point => {
        setBlockState("glowstone", 
            [x + point[0], y + point[1], z + point[2]]
        );
    });
    
    // Add glass frame outline
    for(let i = 0; i <= size; i++) {
        // Vertical edges
        setBlockState("glass", [x - size + i, y + i, z - size]);
        setBlockState("glass", [x + size - i, y + i, z - size]);
        setBlockState("glass", [x, y + i, z]);
        
        // Base edges
        setBlockState("glass", [x - size + i, y, z - size]);
        setBlockState("glass", [x + i, y, z - i]);
        setBlockState("glass", [x - i, y, z - i]);
    }
}

// Main function to build the 3D fractal
function build3DFractal() {
    // Parameters
    const size = 8;        // Size of the largest tetrahedron
    const depth = 3;       // Number of recursive iterations
    
    // Clear building area
    clearSpace(startX, startY, startZ, size * 2);
    
    // Create the main fractal
    createTetrahedron(
        startX,
        startY,
        startZ,
        size,
        depth
    );
    
    // Add decorative elements
    addDecorations(startX, startY, startZ, size);
    
    // Add explanation messages
    sendChatMessage("3D Sierpinski Tetrahedron created! 🔺");
    sendChatMessage("This fractal has:");
    sendChatMessage("- Size: " + size + " blocks");
    sendChatMessage("- Depth: " + depth + " iterations");
    sendChatMessage("- Self-similar pattern at each level");
}

// Execute the build
build3DFractal(); 