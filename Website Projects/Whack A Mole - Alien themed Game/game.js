/*
===============================
WHACK-A-MOLE GAME JAVASCRIPT
===============================

This file contains all the "brains" of our game - the code that makes everything work!

Think of JavaScript like a set of instructions you give to the computer.
Just like you might give someone directions to bake a cake, JavaScript gives
the browser directions on what to do when things happen in our game.

For students who are completely new to programming:
- Variables are like labeled boxes that store information
- Functions are like recipes - they contain steps to do something specific
- Events are like when someone rings a doorbell - the computer "hears" clicks and responds
*/

// ===============================
// GAME SETTINGS - STUDENTS CAN CHANGE THESE!
// ===============================

/*
These are the numbers that control how our game works.
Think of these like the settings on a video game - you can change them
to make the game easier, harder, faster, or slower!

DEV MODE: This is like a secret cheat code for testing
When this is "true", it shows a special menu to jump between levels
When this is "false", the game works normally
*/
const DEV_MODE = true;

/*
TOTAL LIVES: How many chances does the player get?
If they miss this many moles, the game ends.
Think of this like having 3 tries to pass a test.
*/
const TOTAL_LIVES = 5;

/*
LEVEL 1 SETTINGS: The easiest level to help players learn
All times are measured in milliseconds (1000 = 1 second)
*/
const LEVEL1_MIN_HIDE_TIME = 1000;  // Alien hides for at least 1 second
const LEVEL1_MAX_HIDE_TIME = 1000;  // Alien hides for at most 1 second
const LEVEL1_SHOW_TIME = 1000;      // Alien appears for 1 second
const LEVEL1_MOLES_TO_CATCH = 10;   // Need to catch 10 aliens to advance

/*
LEVEL 2 SETTINGS: A bit faster and more challenging
*/
const LEVEL2_MIN_HIDE_TIME = 2000;  // Mole hides for at least 2 seconds
const LEVEL2_MAX_HIDE_TIME = 2000;  // Mole hides for at most 2 seconds
const LEVEL2_SHOW_TIME = 2000;      // Mole appears for 2 seconds
const LEVEL2_MOLES_TO_CATCH = 6;    // Need to catch 6 moles to advance

/*
LEVEL 3 SETTINGS: Getting quite fast now!
*/
const LEVEL3_MIN_HIDE_TIME = 1500;  // Mole hides for at least 1.5 seconds
const LEVEL3_MAX_HIDE_TIME = 1500;  // Mole hides for at most 1.5 seconds
const LEVEL3_SHOW_TIME = 2000;      // Mole appears for 2 seconds
const LEVEL3_MOLES_TO_CATCH = 5;   // Need to catch 5 moles to advance

/*
LEVEL 4 SETTINGS: Expert level - very challenging!
*/
const LEVEL4_MIN_HIDE_TIME = 1000;   // Mole hides for at least 0.8 seconds
const LEVEL4_MAX_HIDE_TIME = 1000;  // Mole hides for at most 2 seconds
const LEVEL4_SHOW_TIME = 1000;      // Mole appears for 1 second
const LEVEL4_MOLES_TO_CATCH = 4;   // Need to catch 4 moles to win the game!

/*
TRANSITION SETTINGS: How long between levels
*/
const FADE_DURATION = 1000;         // How long the fade effect takes (1 second)
const TIME_TO_START = 2000;         // Wait 2 seconds before first mole appears

// ===============================
// GAME STATE VARIABLES - THE COMPUTER'S MEMORY
// ===============================

/*
These variables are like the computer's memory of what's happening in the game right now.
Think of them like a scorekeeper at a sports game - they keep track of important information.
*/

// This box holds the current score - how many moles the player has caught
let currentScore = 0;

// This box holds how many lives the player has left
let currentLives = TOTAL_LIVES;

// This box holds what level the player is currently on (1, 2, 3, or 4)
let currentLevel = 1;

// This box holds how many moles the player has caught in the current level
let molesHitThisLevel = 0;

// This tells us if a mole is currently showing (true) or hidden (false)
let moleIsShowing = false;

// This remembers which grid square currently has the mole in it (0-8, representing the 9 squares)
let currentMolePosition = -1;

// This is like a timer that the computer uses to control when moles appear and disappear
let gameTimer = null;

// This tells us if the game is currently running (true) or stopped (false)
let gameRunning = false;

// ===============================
// UTILITY FUNCTIONS - HELPFUL RECIPES
// ===============================

/*
FUNCTION: getRandomNumber
This is like rolling dice - it gives us a random number between two values.

Why do we need this? 
- To pick random squares for moles to appear in
- To create random timing so the game isn't predictable

How it works:
1. Take the minimum number we want
2. Take the maximum number we want  
3. Use Math.random() (computer's dice roller) to pick a number in between
4. Return (give back) that number
*/
function getRandomNumber(min, max) {
    // Math.random() gives us a decimal between 0 and 1
    // We multiply and add to get the range we want
    // Math.floor() cuts off the decimal to make it a whole number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
FUNCTION: getCurrentLevelSettings
This is like looking up the rules for the current level.

Think of this like checking the instructions for different difficulty levels
in a board game - each level has different rules!

Returns (gives back) an object with all the settings for the current level.
*/
function getCurrentLevelSettings() {
    // We use "if" statements to check which level we're on
    // Think of this like checking "If it's Monday, do this. If it's Tuesday, do that."
    
    if (currentLevel === 1) {
        // Return Level 1 settings - easiest
        return {
            minHideTime: LEVEL1_MIN_HIDE_TIME,
            maxHideTime: LEVEL1_MAX_HIDE_TIME,
            showTime: LEVEL1_SHOW_TIME,
            molesToCatch: LEVEL1_MOLES_TO_CATCH
        };
    } else if (currentLevel === 2) {
        // Return Level 2 settings
        return {
            minHideTime: LEVEL2_MIN_HIDE_TIME,
            maxHideTime: LEVEL2_MAX_HIDE_TIME,
            showTime: LEVEL2_SHOW_TIME,
            molesToCatch: LEVEL2_MOLES_TO_CATCH
        };
    } else if (currentLevel === 3) {
        // Return Level 3 settings
        return {
            minHideTime: LEVEL3_MIN_HIDE_TIME,
            maxHideTime: LEVEL3_MAX_HIDE_TIME,
            showTime: LEVEL3_SHOW_TIME,
            molesToCatch: LEVEL3_MOLES_TO_CATCH
        };
    } else {
        // Return Level 4 settings - hardest
        return {
            minHideTime: LEVEL4_MIN_HIDE_TIME,
            maxHideTime: LEVEL4_MAX_HIDE_TIME,
            showTime: LEVEL4_SHOW_TIME,
            molesToCatch: LEVEL4_MOLES_TO_CATCH
        };
    }
}

// ===============================
// DISPLAY UPDATE FUNCTIONS - UPDATING THE SCREEN
// ===============================

/*
FUNCTION: updateHUD
HUD stands for "Heads Up Display" - the information bar at the top of the screen.

This function's job is to update the score, level, and lives that the player sees.
Think of this like updating a scoreboard at a sports game.

How it works:
1. Find the HTML elements that show score, level, and lives
2. Change their content to show the current values
3. The player immediately sees the updated information
*/
function updateHUD() {
    // Find the HTML element that shows the score and update it
    // document.getElementById is like saying "find the thing with this name tag"
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        // .textContent is like writing new text on a sign
        scoreElement.textContent = currentScore;
    }
    
    // Find and update the level display
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = currentLevel;
    }
    
    // Update the lives display with heart symbols
    const livesElement = document.getElementById('lives');
    if (livesElement) {
        // Clear out the old hearts
        livesElement.innerHTML = '<span>Lives:</span>';
        
        // Add the correct number of heart icons
        for (let i = 0; i < currentLives; i++) {
            // Create a new heart image for each life
            const heartImg = document.createElement('img');
            heartImg.src = 'assets/heart.svg';  // Path to our heart image
            heartImg.classList.add('heart');    // Add CSS styling
            heartImg.alt = 'Life';               // Description for accessibility
            livesElement.appendChild(heartImg);  // Add it to the lives display
        }
    }
}

/*
FUNCTION: showMole
This makes a mole appear in a random grid square.

Think of this like a magician making a rabbit appear in a hat -
but our "hat" is one of the 9 grid squares, chosen randomly!

How it works:
1. Pick a random number from 0 to 8 (representing our 9 squares)
2. Find that grid square on the screen
3. Create a mole image and put it in that square
4. Remember that the mole is now showing
*/
function showMole() {
    // Don't show a new mole if one is already showing
    if (moleIsShowing) {
        return;
    }

    // For Level 1: Only use the center square (square-4)
    if (currentLevel === 1) {
        currentMolePosition = 4;
    } else {
        // For other levels, pick a random square (0 to 8)
        currentMolePosition = getRandomNumber(0, 8);
    }

    const gridSquare = document.getElementById(`square-${currentMolePosition}`);

    if (gridSquare) {
        // For Level 1, use an emoji instead of an image
        let moleElem;
        if (currentLevel === 1) {
            moleElem = document.createElement('span');
            moleElem.textContent = '👽';
            moleElem.classList.add('alien-emoji');
            moleElem.id = 'current-mole';
            moleElem.setAttribute('aria-label', 'Alien to click');
        } else {
            moleElem = document.createElement('img');
            moleElem.src = 'assets/mole.svg';
            moleElem.classList.add('mole');
            moleElem.id = 'current-mole';
            moleElem.alt = 'Mole to click';
        }
        moleElem.addEventListener('click', onMoleClicked);
        gridSquare.appendChild(moleElem);
        moleIsShowing = true;
        const settings = getCurrentLevelSettings();
        gameTimer = setTimeout(hideMole, settings.showTime);
    }
}

/*
FUNCTION: hideMole
This makes the mole disappear and causes the player to lose a life.

Think of this like the mole going back into its hole - if the player
didn't click it in time, they miss their chance and lose a life!
*/
function hideMole() {
    // Find the current mole image
    const currentMole = document.getElementById('current-mole');
    
    if (currentMole && moleIsShowing) {
        // Remove the mole from the screen
        currentMole.remove();  // This deletes the mole image
        
        // Player missed the mole - lose a life!
        currentLives--;
        
        // Update the display to show the new number of lives
        updateHUD();
        
        // Check if the player has run out of lives
        if (currentLives <= 0) {
            // Game Over!
            endGame();
            return;  // Stop here - don't schedule the next mole
        }
        
        // Reset our memory
        moleIsShowing = false;
        currentMolePosition = -1;
        
        // Schedule the next mole to appear after a random delay
        scheduleNextMole();
    }
}

/*
FUNCTION: scheduleNextMole
This sets up when the next mole will appear.

Think of this like setting an alarm clock - we tell the computer
"wait for a random amount of time, then show the next mole."
*/
function scheduleNextMole() {
    // Only schedule if the game is still running
    if (!gameRunning) {
        return;
    }
    
    // Get the settings for the current level
    const settings = getCurrentLevelSettings();
    
    // Pick a random time between the minimum and maximum hide time
    const hideTime = getRandomNumber(settings.minHideTime, settings.maxHideTime);
    
    // Set up a timer - after 'hideTime' milliseconds, show a new mole
    gameTimer = setTimeout(showMole, hideTime);
}

// ===============================
// GAME EVENT FUNCTIONS - WHAT HAPPENS WHEN THINGS OCCUR
// ===============================

/*
FUNCTION: onMoleClicked
This is what happens when a player successfully clicks a mole.

Think of this like scoring a goal in soccer - lots of things happen:
1. You get points
2. The crowd cheers (well, we update the score)
3. The game continues with the next play

This function handles all the things that should happen when a mole is clicked.
*/
function onMoleClicked(event) {
    // Stop the event from doing anything else (prevents bugs)
    event.preventDefault();
    event.stopPropagation();
    
    // Make sure this is really the current mole by checking if the element actually exists
    // This prevents race conditions where the timer sets the flag but element still exists
    const currentMole = document.getElementById('current-mole');
    if (!currentMole) {
        return;  // If no mole element exists, ignore this click
    }
    
    // Player hit the mole! Good job!
    currentScore++;              // Add 1 to the score
    molesHitThisLevel++;        // Add 1 to this level's count
    
    // Remove the mole from the screen immediately
    // (We already confirmed the element exists above)
    currentMole.remove();
    
    // Clear the timer that was going to hide the mole
    if (gameTimer) {
        clearTimeout(gameTimer);  // Cancel the "hide mole" timer
        gameTimer = null;
    }
    
    // Reset our memory
    moleIsShowing = false;
    currentMolePosition = -1;
    
    // Update the score display
    updateHUD();
    
    // Check if the player has caught enough moles to advance to the next level
    const settings = getCurrentLevelSettings();
    if (molesHitThisLevel >= settings.molesToCatch) {
        // Player completed this level!
        advanceLevel();
    } else {
        // Continue with the current level - schedule the next mole
        scheduleNextMole();
    }
}

/*
FUNCTION: advanceLevel
This handles moving the player to the next level.

Think of this like finishing one chapter of a book and moving to the next -
we need to prepare everything for the new challenge!
*/
function advanceLevel() {
    // Stop the current level
    gameRunning = false;
    
    // Clear any pending timers
    if (gameTimer) {
        clearTimeout(gameTimer);
        gameTimer = null;
    }
    
    // Check if player has completed all levels
    if (currentLevel >= 4) {
        // Player beat the entire game! Take them to the victory screen
        window.location.href = 'end.html?score=' + currentScore + '&won=true';
        return;
    }
    
    // Move to the next level
    currentLevel++;
    
    // Reset the counter for this new level
    molesHitThisLevel = 0;
    
    // Take player to the level intro page
    window.location.href = `level${currentLevel}-intro.html?score=${currentScore}&lives=${currentLives}`;
}

/*
FUNCTION: endGame
This handles when the player runs out of lives and the game ends.

Think of this like when a sports game ends - we need to wrap everything up
and show the final results.
*/
function endGame() {
    // Stop the game completely
    gameRunning = false;
    
    // Clear any timers that might still be running
    if (gameTimer) {
        clearTimeout(gameTimer);
        gameTimer = null;
    }
    
    // Take the player to the game over screen with their final score
    window.location.href = 'end.html?score=' + currentScore + '&won=false';
}

// ===============================
// GAME CONTROL FUNCTIONS - STARTING AND STOPPING
// ===============================

/*
FUNCTION: startGame
This begins a new game or level.

Think of this like the referee blowing a whistle to start a soccer match -
it sets everything up and gets the action going!
*/
function startGame() {
    // Set up the game state
    gameRunning = true;
    moleIsShowing = false;
    currentMolePosition = -1;
    
    // Update the display with current information
    updateHUD();
    
    // Wait a moment, then start showing moles
    gameTimer = setTimeout(showMole, TIME_TO_START);
}

/*
FUNCTION: restartGame
This starts the game over from the very beginning.

Think of this like starting a board game over - we reset everything
to how it was at the start and begin again.
*/
function restartGame() {
    // Reset all the game variables to their starting values
    currentScore = 0;
    currentLives = TOTAL_LIVES;
    currentLevel = 1;
    molesHitThisLevel = 0;
    gameRunning = false;
    moleIsShowing = false;
    currentMolePosition = -1;
    
    // Clear any running timers
    if (gameTimer) {
        clearTimeout(gameTimer);
        gameTimer = null;
    }
    
    // Go back to the very beginning
    window.location.href = 'index.html';
}

// ===============================
// PAGE SETUP FUNCTIONS - GETTING READY
// ===============================

/*
FUNCTION: getURLParameter
This reads information from the web address.

When we move between pages, we sometimes need to carry information with us.
Think of this like a note passed from one person to another - 
the URL can carry our score and lives between different pages.

For example: level2.html?score=5&lives=2
This tells us the player has 5 points and 2 lives remaining.
*/
function getURLParameter(name) {
    // This is a bit complex, but it searches the URL for the parameter we want
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

/*
FUNCTION: setupGameplayPage
This prepares a level page for playing.

Think of this like setting up a board game - we need to put all the pieces
in the right places before we can start playing.
*/
function setupGameplayPage() {
    // Get score and lives from the URL (passed from previous pages)
    const scoreFromURL = getURLParameter('score');
    const livesFromURL = getURLParameter('lives');

    // If we have score and lives info, use it (this happens when continuing from previous levels)
    if (scoreFromURL !== null) {
        currentScore = parseInt(scoreFromURL);
    }
    if (livesFromURL !== null) {
        currentLives = parseInt(livesFromURL);
    }

    // For Level 1: Hide all squares except the center one
    if (currentLevel === 1) {
        for (let i = 0; i < 9; i++) {
            const square = document.getElementById(`square-${i}`);
            if (square) {
                if (i === 4) {
                    square.style.display = 'flex';
                    square.classList.add('center-alien-square');
                } else {
                    square.style.display = 'none';
                    square.classList.remove('center-alien-square');
                }
            }
        }
    }

    // Set up the dev mode dropdown if dev mode is enabled
    if (DEV_MODE) {
        createDevDropdown();
    }

    // For Level 1: End the level after 12 seconds (total time)
    if (currentLevel === 1) {
        setTimeout(() => {
            if (gameRunning) {
                advanceLevel();
            }
        }, 12000);
    }

    // Start the game!
    startGame();
}

/*
FUNCTION: setupIntroPage  
This prepares level intro pages.

These are the pages that show "Level 2" before you start playing Level 2.
Think of this like the screen between rounds in a video game.
*/
function setupIntroPage() {
    // Get the current score and lives from the URL
    const scoreFromURL = getURLParameter('score');
    const livesFromURL = getURLParameter('lives');
    
    // Update our variables with the passed information
    if (scoreFromURL !== null) {
        currentScore = parseInt(scoreFromURL);
    }
    if (livesFromURL !== null) {
        currentLives = parseInt(livesFromURL);
    }
    
    // Find the "Start Level" button and set it up
    const startButton = document.getElementById('start-level-button');
    if (startButton) {
        startButton.addEventListener('click', function() {
            // When clicked, go to the actual gameplay page
            window.location.href = `level${currentLevel}.html?score=${currentScore}&lives=${currentLives}`;
        });
    }
}

// ===============================
// DEV MODE FUNCTIONS - FOR TESTING
// ===============================

/*
FUNCTION: createDevDropdown
This creates a special menu for developers/students to test the game.

Think of this like a secret cheat menu in a video game - it lets you
jump to any level instantly to test your changes.

This only appears when DEV_MODE is set to true at the top of this file.
*/
function createDevDropdown() {
    // Create the dropdown container
    const devContainer = document.createElement('div');
    devContainer.classList.add('dev-dropdown');
    
    // Create the dropdown menu
    const dropdown = document.createElement('select');
    dropdown.id = 'dev-level-select';
    
    // Add options for each level
    const options = [
        { value: '', text: 'Jump to Level...' },
        { value: '1', text: 'Level 1' },
        { value: '2', text: 'Level 2' },
        { value: '3', text: 'Level 3' },
        { value: '4', text: 'Level 4' },
        { value: 'end', text: 'End Screen' }
    ];
    
    // Add each option to the dropdown
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        dropdown.appendChild(optionElement);
    });
    
    // Add event listener for when someone selects a level
    dropdown.addEventListener('change', function() {
        const selectedLevel = this.value;
        if (selectedLevel) {
            // Jump to the selected level
            if (selectedLevel === 'end') {
                window.location.href = 'end.html?score=' + currentScore + '&won=true';
            } else {
                currentLevel = parseInt(selectedLevel);
                window.location.href = `level${selectedLevel}-intro.html?score=${currentScore}&lives=${currentLives}`;
            }
        }
    });
    
    // Add a label
    const label = document.createElement('span');
    label.textContent = 'DEV: ';
    label.style.color = 'white';
    label.style.fontSize = '12px';
    
    // Put it all together
    devContainer.appendChild(label);
    devContainer.appendChild(dropdown);
    
    // Add it to the page
    document.body.appendChild(devContainer);
}

// ===============================
// PAGE INITIALIZATION - THE STARTING POINT
// ===============================

/*
This is what happens when each page loads.

Think of this like the moment you open a book - the computer reads this
and says "Oh, I need to set up this page and get everything ready!"

DOMContentLoaded means "wait until the entire page is loaded, then do this"
It's like waiting for all the actors to be on stage before starting the play.
*/
document.addEventListener('DOMContentLoaded', function() {
    // Figure out what page we're on based on the filename
    const currentPage = window.location.pathname.split('/').pop();
    
    /*
    Based on which page we're on, we do different setup tasks:
    - Gameplay pages (level1.html, etc.) need the full game setup
    - Intro pages (level1-intro.html, etc.) need simpler setup
    - Other pages might need their own special setup
    */
    
    if (currentPage.match(/^level\d+\.html$/)) {
        // This is a gameplay page (level1.html, level2.html, etc.)
        // Extract the level number from the filename
        const levelNumber = parseInt(currentPage.match(/\d+/)[0]);
        currentLevel = levelNumber;
        
        // Set up the game
        setupGameplayPage();
        
    } else if (currentPage.match(/^level\d+-intro\.html$/)) {
        // This is a level intro page (level1-intro.html, etc.)
        // Extract the level number from the filename
        const levelNumber = parseInt(currentPage.match(/\d+/)[0]);
        currentLevel = levelNumber;
        
        // Set up the intro page
        setupIntroPage();
        
    } else if (currentPage === 'index.html' || currentPage === '') {
        // This is the main intro page
        // Set up the start game button
        const startButton = document.getElementById('start-game-button');
        if (startButton) {
            startButton.addEventListener('click', function() {
                window.location.href = 'instructions.html';
            });
        }
        
    } else if (currentPage === 'instructions.html') {
        // This is the instructions page
        // Set up the play game button
        const playButton = document.getElementById('play-game-button');
        if (playButton) {
            playButton.addEventListener('click', function() {
                window.location.href = 'level1-intro.html';
            });
        }
        
    } else if (currentPage === 'end.html') {
        // This is the end/game over page
        // Get the final score from the URL and display it
        const finalScore = getURLParameter('score') || '0';
        const won = getURLParameter('won') === 'true';
        
        // Update the page with the final score
        const scoreElement = document.getElementById('final-score');
        if (scoreElement) {
            scoreElement.textContent = finalScore;
        }
        
        // Update the message based on whether they won or lost
        const messageElement = document.getElementById('end-message');
        if (messageElement && won) {
            messageElement.textContent = 'Congratulations! You completed all levels!';
        }
        
        // Set up the play again button
        const playAgainButton = document.getElementById('play-again-button');
        if (playAgainButton) {
            playAgainButton.addEventListener('click', restartGame);
        }
    }
    
    // Set up restart button (appears on gameplay pages)
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
        restartButton.addEventListener('click', restartGame);
    }
});

/*
CONGRATULATIONS!
If you're reading this, you've made it through the entire game code!

Remember, this code is designed to be modified and experimented with.
Try changing the numbers at the top to make the game easier or harder.
Try changing the colors in the CSS file.
Try adding new features!

The most important thing is to have fun and keep learning!
*/