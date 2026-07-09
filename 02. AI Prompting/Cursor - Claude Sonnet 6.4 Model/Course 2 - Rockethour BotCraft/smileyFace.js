// Get player position
const pos = p.getPosition();
const centerX = Math.floor(pos.x);
const centerY = Math.floor(pos.y) + 5; // 5 blocks above ground
const centerZ = Math.floor(pos.z) + 7; // 7 blocks in front of player

// Function to create a circle in vertical plane (X-Y plane)
function createCircle(radius, color) {
    for(let x = -radius; x <= radius; x++) {
        for(let y = -radius; y <= radius; y++) {
            // Use circle equation (x²+y²=r²) to determine if point is within circle
            if(Math.round(Math.sqrt(x*x + y*y)) <= radius) {
                setBlockState("wool", 
                    [centerX + x, centerY + y, centerZ],
                    color
                );
            }
        }
    }
}

// Create yellow face (radius 6)
createCircle(6, "yellow");

// Create black eyes
setBlockState("wool", [centerX - 2, centerY + 2, centerZ], "black");
setBlockState("wool", [centerX + 2, centerY + 2, centerZ], "black");

// Create smile (semi-circle)
for(let x = -3; x <= 3; x++) {
    for(let y = -2; y >= -4; y--) {
        // Create curved smile using a modified circle equation
        if(Math.round(Math.sqrt(x*x + (y+1)*(y+1))) === 3) {
            setBlockState("wool", 
                [centerX + x, centerY + y, centerZ],
                "black"
            );
        }
    }
}

// Add a message when complete
sendChatMessage("Vertical smiley face created! 😊"); 