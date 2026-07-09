/**
 * MISSION-JULIET - FIRE-PUMA
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'KPHCU'
    );
    console.log('✓ mission-juliet fire-puma.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
