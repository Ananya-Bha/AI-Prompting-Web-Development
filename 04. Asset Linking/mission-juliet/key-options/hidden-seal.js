/**
 * MISSION-JULIET - HIDDEN-SEAL
 * Decoy key
 */

if (window.puzzleValidator) {
    window.puzzleValidator.register(
        'decoy',
        'mission-juliet',
        'K8SLL'
    );
    console.log('✓ mission-juliet hidden-seal.js loaded');
} else {
    console.error('❌ Puzzle validator not found.');
}
