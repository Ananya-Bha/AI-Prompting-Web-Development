/**
 * MISSION-JULIET - NOBLE-HORNET
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'N64X'
    );
    console.log('✓ mission-juliet noble-hornet.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
