// Get player position
const pos = p.getPosition();
const centerX = Math.floor(pos.x);
const centerY = Math.floor(pos.y) + 10; // 10 blocks above player
const centerZ = Math.floor(pos.z);

// Function to check if a point is within a sphere
function isInSphere(x, y, z, radius) {
    // Calculate distance from center
    const distance = Math.sqrt(x*x + y*y + z*z);
    // Return true if point is within the sphere
    return distance <= radius;
}

// Function to create the glowing orb
function createOrb() {
    const radius = 8;        // Outer radius of the orb
    const glassShell = 1;    // Thickness of glass shell
    
    // Create the orb layer by layer
    for(let x = -radius; x <= radius; x++) {
        for(let y = -radius; y <= radius; y++) {
            for(let z = -radius; z <= radius; z++) {
                // Check if point is within the sphere
                if(isInSphere(x, y, z, radius)) {
                    const distance = Math.sqrt(x*x + y*y + z*z);
                    
                    if(distance > radius - glassShell) {
                        // Outer glass shell (clear glass only)
                        setBlockState("glass", 
                            [centerX + x, centerY + y, centerZ + z]
                        );
                    } else {
                        // Solid glowstone interior
                        setBlockState("glowstone", 
                            [centerX + x, centerY + y, centerZ + z]
                        );
                    }
                }
            }
        }
    }
}

// Build the orb
function buildGlowingOrb() {
    createOrb();
    sendChatMessage("Large glowing orb created! ✨🔮✨");
}

// Execute the build
buildGlowingOrb(); 