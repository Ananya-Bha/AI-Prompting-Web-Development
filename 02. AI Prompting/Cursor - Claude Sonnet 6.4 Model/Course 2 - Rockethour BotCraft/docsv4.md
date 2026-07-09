# ModAPI Building Documentation

## Core Functions

### 1. Block Placement
```javascript
setBlockState(blockType, posArray, color?, direction?)
```
Places or modifies blocks in the Minecraft world.

**Parameters:**
- `blockType`: String - The type of block to place (see Block Types list)
- `posArray`: [x, y, z] - Array of 3 integer coordinates
- `color`: (Optional) String - Block color (see Colors list)
- `direction`: (Optional) String - Block orientation (see Directions list)

**Examples:**
```javascript
// Place a red wool block at coordinates (10, 64, -5)
setBlockState("wool", [10, 64, -5], "red");

// Place a torch facing north
setBlockState("torch", [15, 70, 0], null, "north");

// Place a simple stone block
setBlockState("stone", [0, 64, 0]);
```

### 2. Chat Messages
```javascript
sendChatMessage(message)
```
Sends a message to the player's chat window.

**Parameters:**
- `message`: String - The message to display

**Example:**
```javascript
sendChatMessage("Building complete!");
```

### 3. Player Position
```javascript
p.getPosition()
```
Returns the player's current position in the world.

**Returns:** Object with properties:
- `x`: number - X coordinate
- `y`: number - Y coordinate
- `z`: number - Z coordinate

**Example:**
```javascript
const pos = p.getPosition();
// Place a block above the player
setBlockState("diamond_block", [
    Math.floor(pos.x),
    Math.floor(pos.y) + 1,
    Math.floor(pos.z)
]);
```

## Reference Lists

### Available Colors
The following colors can be used with blocks that support coloring (like wool, stained glass, etc.):
- white
- orange
- magenta
- light_blue
- yellow
- lime
- pink
- gray
- light_gray
- cyan
- purple
- blue
- brown
- green
- red
- black

### Available Directions
The following directions can be used with blocks that support orientation:
- north
- south
- east
- west

### Colorable Blocks
These blocks can use the color parameter:
- wool
- stained_glass
- stained_glass_pane
- stained_hardened_clay
- carpet

### Orientable Blocks
These blocks can use the direction parameter:
- torch
- ladder
- chest
- furnace
- piston
- stairs (all varieties)
- door (all varieties)

## Important Rules and Best Practices

### 1. Integer Coordinates
All coordinates must be integers. When performing calculations that might result in decimal numbers, always use Math functions to convert to integers.

```javascript
// INCORRECT - Will throw an error
setBlockState("stone", [10.5, 64, -5]);

// CORRECT - Using Math.floor()
setBlockState("stone", [Math.floor(10.5), 64, -5]);

// CORRECT - Using Math.round()
setBlockState("stone", [Math.round(10.5), 64, -5]);
```

### 2. Building Patterns

#### Relative Positioning
When building structures, use player position as reference:
```javascript
const pos = p.getPosition();
const startX = Math.floor(pos.x) + 5;  // 5 blocks away
const startY = Math.floor(pos.y);       // Ground level
const startZ = Math.floor(pos.z);       // Same Z position
```

#### Building in Loops
When creating larger structures, use loops with integer coordinates:
```javascript
// Create a 5x5 platform
const pos = p.getPosition();
const size = 5;

for(let x = 0; x < size; x++) {
    for(let z = 0; z < size; z++) {
        setBlockState("stone", [
            Math.floor(pos.x) + x,
            Math.floor(pos.y) - 1,
            Math.floor(pos.z) + z
        ]);
    }
}
```

### 3. Common Errors to Avoid

1. **Non-Integer Coordinates**
   ```javascript
   // WRONG
   const radius = 5;
   const angle = Math.PI / 4;
   setBlockState("stone", [
       radius * Math.cos(angle),  // Will throw error
       64,
       radius * Math.sin(angle)   // Will throw error
   ]);

   // CORRECT
   setBlockState("stone", [
       Math.round(radius * Math.cos(angle)),
       64,
       Math.round(radius * Math.sin(angle))
   ]);
   ```

2. **Invalid Block Types**
   ```javascript
   // WRONG - Invalid block name
   setBlockState("diamond", [0, 64, 0]);

   // CORRECT
   setBlockState("diamond_block", [0, 64, 0]);
   ```

3. **Invalid Color/Direction Combinations**
   ```javascript
   // WRONG - Cannot specify both color and direction
   setBlockState("wool", [0, 64, 0], "red", "north");

   // WRONG - Cannot color a torch
   setBlockState("torch", [0, 64, 0], "red");

   // WRONG - Cannot orient wool
   setBlockState("wool", [0, 64, 0], null, "north");
   ```

## Available Block Types

The following blocks are organized by category for easier reference:

### Basic Building Blocks
```javascript
[
    // Natural Materials
    "stone", "dirt", "grass", "cobblestone", "gravel", "sand", "clay",
    "hardened_clay", "ice", "packed_ice", "snow", "snow_layer",
    
    // Processed Materials
    "planks", "brick_block", "stonebrick", "sandstone", "red_sandstone",
    "quartz_block", "coal_block", "prismarine",
    
    // Precious Materials
    "gold_block", "iron_block", "diamond_block", "emerald_block", "lapis_block",
    "obsidian", "glowstone", "sea_lantern"
]
```

### Natural & Ore Blocks
```javascript
[
    // Ores
    "coal_ore", "iron_ore", "gold_ore", "diamond_ore", "emerald_ore",
    "lapis_ore", "quartz_ore", "redstone_ore", "lit_redstone_ore",
    
    // Plant Life
    "log", "log2", "leaves", "leaves2", "sapling", "tallgrass", "deadbush",
    "yellow_flower", "red_flower", "brown_mushroom", "red_mushroom",
    "brown_mushroom_block", "red_mushroom_block", "vine", "waterlily",
    "double_plant", "wheat", "carrots", "potatoes", "reeds", "cactus",
    "pumpkin", "melon_block", "cocoa"
]
```

### Decorative Blocks
```javascript
[
    // Glass Types
    "glass", "glass_pane", "stained_glass", "stained_glass_pane",
    
    // Wool & Related
    "wool", "carpet",
    
    // Clay Variants
    "stained_hardened_clay",
    
    // Fences & Walls
    "oak_fence", "spruce_fence", "birch_fence", "jungle_fence",
    "dark_oak_fence", "acacia_fence", "nether_brick_fence",
    "cobblestone_wall", "iron_bars",
    
    // Stairs
    "oak_stairs", "stone_stairs", "brick_stairs", "stone_brick_stairs",
    "nether_brick_stairs", "sandstone_stairs", "spruce_stairs",
    "birch_stairs", "jungle_stairs", "quartz_stairs", "acacia_stairs",
    "dark_oak_stairs", "red_sandstone_stairs",
    
    // Slabs
    "stone_slab", "wooden_slab", "stone_slab2", "double_stone_slab",
    "double_stone_slab2", "double_wooden_slab"
]
```

### Functional Blocks
```javascript
[
    // Storage & Crafting
    "chest", "trapped_chest", "ender_chest", "crafting_table", "furnace",
    "lit_furnace", "brewing_stand", "cauldron", "hopper", "dropper",
    "dispenser",
    
    // Redstone Components
    "redstone_wire", "redstone_block", "redstone_torch", "unlit_redstone_torch",
    "piston", "sticky_piston", "piston_head", "piston_extension",
    "unpowered_repeater", "powered_repeater", "unpowered_comparator",
    "powered_comparator", "daylight_detector", "daylight_detector_inverted",
    "command_block",
    
    // Rails
    "rail", "golden_rail", "detector_rail", "activator_rail",
    
    // Doors & Gates
    "oak_door", "spruce_door", "birch_door", "jungle_door", "acacia_door",
    "dark_oak_door", "iron_door", "trapdoor", "iron_trapdoor",
    "oak_fence_gate", "spruce_fence_gate", "birch_fence_gate",
    "jungle_fence_gate", "dark_oak_fence_gate", "acacia_fence_gate"
]
```

### Interactive & Mechanism Blocks
```javascript
[
    // Buttons & Pressure Plates
    "stone_button", "wooden_button", "stone_pressure_plate",
    "wooden_pressure_plate", "light_weighted_pressure_plate",
    "heavy_weighted_pressure_plate",
    
    // Signs & Banners
    "standing_sign", "wall_sign", "standing_banner", "wall_banner",
    
    // Other Interactive
    "lever", "tripwire_hook", "tripwire", "noteblock", "jukebox",
    "enchanting_table", "anvil", "beacon", "flower_pot", "skull"
]
```

### Special Blocks
```javascript
[
    // Technical
    "air", "barrier",
    
    // Liquids
    "water", "flowing_water", "lava", "flowing_lava",
    
    // Portal Blocks
    "portal", "end_portal", "end_portal_frame",
    
    // Nether
    "netherrack", "soul_sand", "nether_brick", "nether_wart",
    
    // End
    "end_stone", "dragon_egg",
    
    // Misc Special
    "bedrock", "sponge", "mob_spawner", "monster_egg", "cake",
    "fire", "bookshelf", "hay_block", "slime_block", "tnt"
]
```

Each block can be used with the `setBlockState` function as shown in previous examples. Remember that some blocks have special properties:
- Colored blocks (like wool) can use the `color` parameter
- Directional blocks (like stairs) can use the `direction` parameter
- Some blocks (like doors) have special placement rules

### Blocks Supporting Color Parameter
```javascript
[
    // Wool & Carpet
    "wool",           // All 16 colors
    "carpet",         // All 16 colors
    
    // Glass
    "stained_glass",         // All 16 colors
    "stained_glass_pane",    // All 16 colors
    
    // Clay
    "stained_hardened_clay", // All 16 colors
    
    // Concrete & Concrete Powder
    "concrete",              // All 16 colors
    "concrete_powder"        // All 16 colors
]

// Available colors for these blocks:
const colors = [
    "white", "orange", "magenta", "light_blue",
    "yellow", "lime", "pink", "gray",
    "light_gray", "cyan", "purple", "blue",
    "brown", "green", "red", "black"
];
```

### Blocks Supporting Direction Parameter
```javascript
[
    // Basic Directional
    "torch",
    "ladder",
    "furnace", "lit_furnace",
    "chest", "trapped_chest", "ender_chest",
    
    // Pistons
    "piston",
    "sticky_piston",
    
    // Stairs (all varieties)
    "oak_stairs", "stone_stairs", "brick_stairs",
    "stone_brick_stairs", "nether_brick_stairs",
    "sandstone_stairs", "spruce_stairs", "birch_stairs",
    "jungle_stairs", "quartz_stairs", "acacia_stairs",
    "dark_oak_stairs", "red_sandstone_stairs",
    
    // Doors
    "oak_door", "spruce_door", "birch_door",
    "jungle_door", "acacia_door", "dark_oak_door",
    "iron_door",
    
    // Redstone Components
    "dispenser",
    "dropper",
    "hopper",
    "unpowered_repeater", "powered_repeater",
    "unpowered_comparator", "powered_comparator",
    
    // Signs
    "wall_sign",
    "wall_banner",
    
    // Other
    "lever",
    "button",
    "tripwire_hook"
]

// Available directions:
const directions = ["north", "south", "east", "west"];

// Note: Some blocks like stairs have additional orientation properties
// beyond the basic cardinal directions
```

## Available JavaScript Features
- All native JavaScript functions (Math, Array methods, etc.)
- Timing functions (setTimeout, setInterval)
- Math functions (Math.pow, Math.floor, Math.round, Math.sqrt, Math.abs, etc.) 