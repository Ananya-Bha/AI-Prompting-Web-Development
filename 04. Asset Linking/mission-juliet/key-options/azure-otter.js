/**
 * MISSION-JULIET - AZURE-OTTER
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'AALF'
    );
    console.log('✓ mission-juliet azure-otter.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
