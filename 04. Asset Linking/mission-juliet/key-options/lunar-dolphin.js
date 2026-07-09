/**
 * MISSION-JULIET - LUNAR-DOLPHIN
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'XSDJWS3'
    );
    console.log('✓ mission-juliet lunar-dolphin.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
