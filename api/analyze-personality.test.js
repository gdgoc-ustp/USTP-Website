/**
 * Test file for the analyze-personality API endpoint
 * This can be used to test the API locally before deployment
 */

// Mock the environment variable for testing
process.env.GEMINI_API_KEY = 'test-key';

// Import the handler function
const handler = require('./analyze-personality.js').default;

// Mock request and response objects
const createMockReq = (body) => ({
    method: 'POST',
    body: body
});

const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
};

describe('Analyze Personality API', () => {
    test('should validate personality code length', async () => {
        const req = createMockReq({ personalityCode: 'INVALID' });
        const res = createMockRes();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Invalid personality code. Must be exactly 10 letters.'
        });
    });

    test('should validate personality code format', async () => {
        const req = createMockReq({ personalityCode: 'INVALIDCODE' });
        const res = createMockRes();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'INVALID_CODE'
        });
    });

    test('should accept valid personality code format', async () => {
        const req = createMockReq({ personalityCode: 'IDCFRXSLBH' });
        const res = createMockRes();

        // Mock fetch to avoid actual API call
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: jest.fn().mockResolvedValue({})
        });

        await handler(req, res);

        // Should not fail validation, but will fail on API call (which is expected in test)
        expect(res.status).not.toHaveBeenCalledWith(400);
    });

    test('should handle missing personality code', async () => {
        const req = createMockReq({});
        const res = createMockRes();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Personality code is required'
        });
    });

    test('should handle non-POST methods', async () => {
        const req = { method: 'GET' };
        const res = createMockRes();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(405);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Method not allowed'
        });
    });

    test('should handle OPTIONS requests', async () => {
        const req = { method: 'OPTIONS' };
        const res = createMockRes();

        await handler(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.end).toHaveBeenCalled();
    });
});

// Manual test function for local testing
async function manualTest() {
    console.log('Testing analyze-personality API...');
    
    const testCases = [
        { code: 'IDCFRXSLBH', expected: 'valid' },
        { code: 'EDCFRXSLBH', expected: 'valid' },
        { code: 'INVALID', expected: 'invalid length' },
        { code: 'INVALIDCODE', expected: 'invalid format' },
        { code: '', expected: 'missing' }
    ];

    for (const testCase of testCases) {
        console.log(`\nTesting: ${testCase.code || 'empty'} (${testCase.expected})`);
        
        const req = createMockReq({ personalityCode: testCase.code });
        const res = createMockRes();

        try {
            await handler(req, res);
            console.log('Status:', res.status.mock.calls[0]?.[0]);
            console.log('Response:', res.json.mock.calls[0]?.[0]);
        } catch (error) {
            console.log('Error:', error.message);
        }
    }
}

// Run manual test if this file is executed directly
if (require.main === module) {
    manualTest();
}

module.exports = { manualTest };
