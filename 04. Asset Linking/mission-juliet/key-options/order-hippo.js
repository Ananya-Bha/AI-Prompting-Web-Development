/**
 * MISSION-JULIET - ORDER-HIPPO
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'WSPFB'
    );
    console.log('✓ mission-juliet order-hippo.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
