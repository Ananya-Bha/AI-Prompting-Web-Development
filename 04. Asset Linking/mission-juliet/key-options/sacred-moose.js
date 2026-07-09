/**
 * MISSION-JULIET - SACRED-MOOSE
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'MWRMVIC'
    );
    console.log('✓ mission-juliet sacred-moose.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
