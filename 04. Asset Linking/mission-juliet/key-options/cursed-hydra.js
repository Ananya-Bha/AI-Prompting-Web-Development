/**
 * MISSION-JULIET - CURSED-HYDRA
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'M3FF'
    );
    console.log('✓ mission-juliet cursed-hydra.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
