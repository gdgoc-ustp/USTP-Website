import { isValidPersonalityCode } from './personalityCodes.js';

/**
 * Analyzes a personality code using our secure API endpoint
 * @param {string} personalityCode - The 10-letter personality code
 * @returns {Promise<Object>} - The personality analysis JSON
 */
export const analyzePersonalityCode = async (personalityCode) => {
    if (!personalityCode || personalityCode.length !== 10) {
        throw new Error('Invalid personality code. Must be exactly 10 letters.');
    }

    // Validate the personality code against the valid combinations
    const isValid = isValidPersonalityCode(personalityCode);
    if (!isValid) {
        throw new Error('INVALID_CODE');
    }

    try {
        // Call our secure API endpoint instead of Gemini directly
        const response = await fetch('/api/analyze-personality', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalityCode: personalityCode.toUpperCase()
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Handle specific error cases
            if (response.status === 400 && errorData.error === 'INVALID_CODE') {
                throw new Error('INVALID_CODE');
            }

            throw new Error(errorData.error || `API error: ${response.status} ${response.statusText}`);
        }

        const personalityAnalysis = await response.json();

        // Check if the API returned an error for invalid code
        if (personalityAnalysis.error) {
            throw new Error('INVALID_CODE');
        }

        // Validate the response structure
        if (!personalityAnalysis.personalityCode || !personalityAnalysis.coreType || !personalityAnalysis.workStyleTraits) {
            throw new Error('Invalid personality analysis structure');
        }

        // Validate core type structure
        if (!personalityAnalysis.coreType.title || !personalityAnalysis.coreType.strengths) {
            throw new Error('Invalid core type structure');
        }

        return personalityAnalysis;

    } catch (error) {
        console.error('Error analyzing personality code:', error);
        throw error;
    }
};


