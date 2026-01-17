/**
 * Optimized personality code validation based on questionnaire structure
 * Each position has exactly 2 possible letters based on the quiz questions
 * This is much more efficient than storing all 1,024 combinations
 */

/**
 * Valid letters for each position in the 10-character personality code
 * Based on the personality questionnaire options
 */
export const VALID_POSITION_LETTERS = [
    ['I', 'E'], // Position 1: Social energy (Introvert/Extrovert)
    ['D', 'T'], // Position 2: Work focus (Doing/Thinking)
    ['C', 'S'], // Position 3: Motivation style (Creating/Solving)
    ['F', 'A'], // Position 4: Curiosity driver (Making/Analyzing)
    ['R', 'N'], // Position 5: Problem preference (Repeating/New)
    ['X', 'Y'], // Position 6: Learning style (Self-taught/Social)
    ['S', 'F'], // Position 7: Work flow (Structured/Flow-based)
    ['L', 'Z'], // Position 8: Team dynamic (Listener/Driver)
    ['B', 'V'], // Position 9: Thinking preference (Bottom-up/Visionary)
    ['H', 'K']  // Position 10: Tech approach (Hands-on/Knowledge-first)
];

/**
 * Validates if a personality code follows the correct format
 * @param {string} code - The 10-character personality code to validate
 * @returns {boolean} - Whether the code is valid
 */
export const isValidPersonalityCode = (code) => {
    // Basic format validation
    if (!code || typeof code !== 'string' || code.length !== 10) {
        return false;
    }

    // Check if all characters are letters
    if (!/^[A-Za-z]{10}$/.test(code)) {
        return false;
    }

    const upperCode = code.toUpperCase();

    // Validate each position against allowed letters
    for (let i = 0; i < 10; i++) {
        const letter = upperCode[i];
        const validLetters = VALID_POSITION_LETTERS[i];

        if (!validLetters.includes(letter)) {
            return false;
        }
    }

    return true;
};
