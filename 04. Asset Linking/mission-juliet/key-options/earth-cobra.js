/**
 * MISSION-JULIET - EARTH-COBRA
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'QCET'
    );
    console.log('✓ mission-juliet earth-cobra.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
