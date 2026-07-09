/**
 * MISSION-JULIET - PLASMA-FOX
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'DRIH330K'
    );
    console.log('✓ mission-juliet plasma-fox.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
