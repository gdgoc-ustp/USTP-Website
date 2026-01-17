// Test script to verify personality code validation
require('dotenv').config();

// Copy the validation logic from the API
const VALID_POSITION_LETTERS = [
    ['I', 'E'], // Position 1: Social energy (Introvert/Extrovert)
    ['D', 'T'], // Position 2: Work focus (Doing/Thinking)
    ['C', 'S'], // Position 3: Motivation style (Creating/Solving)
    ['F', 'A'], // Position 4: Curiosity driver (Making/Analyzing)
    ['R', 'N'], // Position 5: Problem preference (Repeating/New)
    ['X', 'Y'], // Position 6: Learning style (Self-taught/Social)
    ['S', 'F'], // Position 7: Work flow (Structured/Flow-based)
    ['L', 'Z'], // Position 8: Team dynamic (Listener/Driver)
    ['B', 'V'], // Position 9: Thinking preference (Bottom-up/Visionary)
    ['H', 'K']  // Position 10: Action style (Hacker/Planner)
];

function isValidPersonalityCode(code) {
    if (!code || typeof code !== 'string' || code.length !== 10) {
        return false;
    }

    const upperCode = code.toUpperCase();

    // Check each position against its valid letters
    for (let i = 0; i < 10; i++) {
        const letter = upperCode[i];
        const validLetters = VALID_POSITION_LETTERS[i];

        if (!validLetters.includes(letter)) {
            console.log(`❌ Invalid letter '${letter}' at position ${i + 1}`);
            console.log(`   Valid options for position ${i + 1}: ${validLetters.join(', ')}`);
            return false;
        } else {
            console.log(`✅ Position ${i + 1}: '${letter}' is valid (options: ${validLetters.join(', ')})`);
        }
    }

    return true;
}

// Test the specific code
const testCode = 'ETSANYFZVH';
console.log('='.repeat(50));
console.log(`Testing personality code: ${testCode}`);
console.log('='.repeat(50));

const isValid = isValidPersonalityCode(testCode);

console.log('='.repeat(50));
console.log(`Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
console.log('='.repeat(50));

if (isValid) {
    console.log('\n🎉 Your personality code is valid!');
    console.log('The issue is likely with the server setup, not your code.');
    console.log('\nNext steps:');
    console.log('1. Make sure the server is running');
    console.log('2. Check that the GEMINI_API_KEY is set in your .env file');
    console.log('3. Verify the API endpoint is accessible');
} else {
    console.log('\n❌ Your personality code has invalid characters.');
    console.log('Please check the questionnaire and make sure you selected valid options.');
}

// Also test a few other valid codes for comparison
console.log('\n' + '='.repeat(50));
console.log('Testing other valid codes for comparison:');
console.log('='.repeat(50));

const testCodes = ['IDCFRXSLBH', 'ETSFNYFLVK', 'IDSANYFZBH'];
testCodes.forEach(code => {
    const valid = isValidPersonalityCode(code);
    console.log(`${code}: ${valid ? '✅ VALID' : '❌ INVALID'}`);
});
