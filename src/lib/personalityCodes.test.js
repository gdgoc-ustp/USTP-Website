/**
 * Test file for personality code validation
 * Run with: npm test personalityCodes.test.js
 */

import { isValidPersonalityCode, VALID_POSITION_LETTERS } from './personalityCodes';

describe('Personality Code Validation', () => {
    test('should validate correct personality codes', () => {
        // Test valid codes from each position combination
        expect(isValidPersonalityCode('IDCFRXSLBH')).toBe(true);
        expect(isValidPersonalityCode('ETSFNYFLVK')).toBe(true);
        expect(isValidPersonalityCode('IDSANYFZBH')).toBe(true);
    });

    test('should reject invalid codes', () => {
        // Wrong length
        expect(isValidPersonalityCode('IDCF')).toBe(false);
        expect(isValidPersonalityCode('IDCFRXSLBHX')).toBe(false);
        
        // Invalid characters
        expect(isValidPersonalityCode('1DCFRXSLBH')).toBe(false);
        expect(isValidPersonalityCode('IDCFRXSLB@')).toBe(false);
        
        // Invalid letters for positions
        expect(isValidPersonalityCode('XDCFRXSLBH')).toBe(false); // X not valid for position 1
        expect(isValidPersonalityCode('IPCFRXSLBH')).toBe(false); // P not valid for position 2
        expect(isValidPersonalityCode('IDQFRXSLBH')).toBe(false); // Q not valid for position 3
    });

    test('should handle edge cases', () => {
        expect(isValidPersonalityCode('')).toBe(false);
        expect(isValidPersonalityCode(null)).toBe(false);
        expect(isValidPersonalityCode(undefined)).toBe(false);
        expect(isValidPersonalityCode(123)).toBe(false);
    });

    test('should be case insensitive', () => {
        expect(isValidPersonalityCode('idcfrxslbh')).toBe(true);
        expect(isValidPersonalityCode('IdCfRxSlBh')).toBe(true);
    });

    test('should validate all position constraints', () => {
        // Test that each position only accepts its valid letters
        for (let i = 0; i < 10; i++) {
            const validLetters = VALID_POSITION_LETTERS[i];
            
            // Test valid letters for this position
            for (const letter of validLetters) {
                const testCode = 'IDCFRXSLBH'.split('');
                testCode[i] = letter;
                expect(isValidPersonalityCode(testCode.join(''))).toBe(true);
            }
            
            // Test invalid letters for this position (use letters not in valid set)
            const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const invalidLetters = allLetters.split('').filter(l => !validLetters.includes(l));
            
            for (const letter of invalidLetters.slice(0, 3)) { // Test first 3 invalid letters
                const testCode = 'IDCFRXSLBH'.split('');
                testCode[i] = letter;
                expect(isValidPersonalityCode(testCode.join(''))).toBe(false);
            }
        }
    });
});

// Performance test
describe('Performance Test', () => {
    test('should validate codes quickly', () => {
        const start = performance.now();
        
        // Test 1000 validations
        for (let i = 0; i < 1000; i++) {
            isValidPersonalityCode('IDCFRXSLBH');
        }
        
        const end = performance.now();
        const duration = end - start;
        
        // Should complete 1000 validations in under 10ms
        expect(duration).toBeLessThan(10);
        console.log(`1000 validations completed in ${duration.toFixed(2)}ms`);
    });
});
