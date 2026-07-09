// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x);
const startY = Math.floor(pos.y) + 10; // Changed to 10 blocks above player
const startZ = Math.floor(pos.z) + 5;  // 5 blocks away from player

// Function to create a single triangle
function createTriangle(x, y, z, size, blockType) {
    // Create a filled triangle of the given size
    for(let row = 0; row < size; row++) {
        // Each row gets wider as we go down
        for(let col = -row; col <= row; col++) {
            setBlockState(blockType, [x + col, y - row, z]);
        }
    }
}

// Recursive function to create the Sierpinski pattern
function createSierpinski(x, y, z, size, depth, blockType) {
    // Base case: if we've reached depth 0, create a single triangle
    if(depth === 0) {
        createTriangle(x, y, z, size, blockType);
        return;
    }
    
    // Calculate new size for sub-triangles (half of current)
    const newSize = Math.floor(size / 2);
    
    // Create three smaller Sierpinski triangles:
    
    // Top triangle
    createSierpinski(
        x,              // Same x position
        y,              // Same y position
        z,              // Same z position
        newSize,        // Half size
        depth - 1,      // Reduce depth by 1
        blockType
    );
    
    // Bottom left triangle
    createSierpinski(
        x - newSize,    // Shift left
        y - newSize,    // Shift down
        z,              // Same z position
        newSize,        // Half size
        depth - 1,      // Reduce depth by 1
        blockType
    );
    
    // Bottom right triangle
    createSierpinski(
        x + newSize,    // Shift right
        y - newSize,    // Shift down
        z,              // Same z position
        newSize,        // Half size
        depth - 1,      // Reduce depth by 1
        blockType
    );
}

// Function to clear space before building
function clearSpace(x, y, z, size) {
    // Clear a rectangular area
    for(let dy = 0; dy >= -size; dy--) {
        for(let dx = -size; dx <= size; dx++) {
            setBlockState("air", [x + dx, y + dy, z]);
        }
    }
}

// Main function to build the fractal
function buildSierpinskiTriangle() {
    // Parameters for the fractal
    const initialSize = 16;  // Size of the largest triangle
    const depth = 4;         // Number of recursive iterations
    
    // Clear building area (adjusted for new height)
    clearSpace(startX, startY, startZ, initialSize);
    
    // Create the fractal using diamond blocks (removed the +5 since height is already adjusted)
    createSierpinski(
        startX,             // Starting x position
        startY,             // Starting y position (already elevated)
        startZ,             // Starting z position
        initialSize,        // Initial size
        depth,              // Recursion depth
        "diamond_block"     // Block type
    );
    
    // Add some explanation messages
    sendChatMessage("Sierpinski Triangle created 10 blocks above! 📐");
    sendChatMessage("This is a fractal pattern where:");
    sendChatMessage("- Each triangle is made up of 3 smaller triangles");
    sendChatMessage("- The pattern repeats " + depth + " times");
    sendChatMessage("- Total size: " + initialSize + " blocks");
}

// Execute the build
buildSierpinskiTriangle(); 