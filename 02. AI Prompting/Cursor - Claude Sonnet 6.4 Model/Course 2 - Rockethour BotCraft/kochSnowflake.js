// Get player position
const pos = p.getPosition();
const startX = Math.floor(pos.x);
const startY = Math.floor(pos.y) + 10; // 10 blocks above player
const startZ = Math.floor(pos.z);

// Function to create a line segment
function createLine(x1, z1, x2, z2) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    // Create blocks along the line
    for(let i = 0; i <= distance; i++) {
        const t = i / distance;
        const x = Math.round(x1 + dx * t);
        const z = Math.round(z1 + dz * t);
        setBlockState("snow_block", [startX + x, startY, startZ + z]);
    }
}

// Function to calculate Koch curve points
function calculateKochPoints(x1, z1, x2, z2) {
    const points = [];
    
    // Calculate the points for one segment of Koch curve
    const dx = x2 - x1;
    const dz = z2 - z1;
    
    // First point
    points.push([x1, z1]);
    
    // Calculate points for the Koch curve
    const p2x = x1 + dx / 3;
    const p2z = z1 + dz / 3;
    points.push([p2x, p2z]);
    
    // Calculate the point for the spike (60-degree angle)
    const angle = Math.PI / 3; // 60 degrees
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;
    const length = Math.sqrt(dx * dx + dz * dz) / 3;
    const p3x = midX + Math.cos(angle) * length;
    const p3z = midZ + Math.sin(angle) * length;
    points.push([p3x, p3z]);
    
    const p4x = x1 + 2 * dx / 3;
    const p4z = z1 + 2 * dz / 3;
    points.push([p4x, p4z]);
    
    // Last point
    points.push([x2, z2]);
    
    return points;
}

// Recursive function to create Koch curve
function createKochCurve(x1, z1, x2, z2, depth) {
    if(depth === 0) {
        createLine(x1, z1, x2, z2);
        return;
    }
    
    const points = calculateKochPoints(x1, z1, x2, z2);
    
    // Recursively create Koch curves for each segment
    for(let i = 0; i < points.length - 1; i++) {
        createKochCurve(
            points[i][0], points[i][1],
            points[i + 1][0], points[i + 1][1],
            depth - 1
        );
    }
}

// Function to create the snowflake
function createSnowflake(size, depth) {
    // Calculate triangle height
    const height = size * Math.sqrt(3) / 2;
    
    // Define the three points of the triangle
    const points = [
        [0, height/2],           // Top
        [-size/2, -height/2],    // Bottom left
        [size/2, -height/2]      // Bottom right
    ];
    
    // Create the three sides of the snowflake
    for(let i = 0; i < 3; i++) {
        const nextI = (i + 1) % 3;
        createKochCurve(
            points[i][0], points[i][1],
            points[nextI][0], points[nextI][1],
            depth
        );
    }
}

// Function to clear space
function clearSpace(size) {
    const height = Math.ceil(size * Math.sqrt(3) / 2);
    for(let x = -size; x <= size; x++) {
        for(let z = -height; z <= height; z++) {
            setBlockState("air", [startX + x, startY, startZ + z]);
        }
    }
}

// Main function to build the snowflake
function buildSnowflake() {
    // Parameters for a smaller snowflake
    const size = 12;    // Base triangle size
    const depth = 3;    // Recursion depth
    
    // Clear space and create snowflake
    clearSpace(size);
    createSnowflake(size, depth);
    
    // Add message
    sendChatMessage("Koch Snowflake created! ❄️");
}

// Execute the build
buildSnowflake(); 