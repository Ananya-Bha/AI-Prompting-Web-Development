/**
 * MISSION-JULIET - ORDER-OTTER
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'RMBF8'
    );
    console.log('✓ mission-juliet order-otter.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
