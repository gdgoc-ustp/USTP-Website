// Import the personality code validation function
// Note: In serverless environment, we need to inline this function
// to avoid import issues with the src directory structure

/**
 * Valid letters for each position in the 10-character personality code
 * Based on the personality questionnaire options
 */
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

/**
 * Validates if a personality code is valid based on the questionnaire structure
 * @param {string} code - The 10-character personality code to validate
 * @returns {boolean} - True if the code is valid, false otherwise
 */
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
            return false;
        }
    }

    return true;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const SYSTEM_PROMPT = `You are a personality decoder for a tech-style personality quiz. The user will give you a 10-letter code.
The first 4 letters define the user's core type, while the last 6 letters define work style traits.
Your job is to interpret and generate a short personality analysis using this format:

Personality Code: {{USER_CODE}}

Core Type:
Title: (based on first 4 letters)
Summary: 4 - 6 sentence description of this core personality in the tech world
Strengths: (list key strengths)
Weakness: (list key weaknesses)
Ideal Work: (roles or activities they'd enjoy most)
Ideal Department for Core team: (Technology (Prefers technicalities) | Operations (Prefers structure or process) | Community Development (Loves interacting with people) | Communications (Creative, artistic person))
Work Style Traits (Last 6 Letters):
For each letter, briefly explain what it means about the person's way of working.

IMPORTANT: Respond with ONLY valid JSON in this exact format (no additional text):

{
  "personalityCode": "USER_CODE_HERE",
  "coreType": {
    "title": "Title based on first 4 letters",
    "summary": "4-6 sentence description",
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2", "weakness3"],
    "idealWork": "roles or activities they'd enjoy most",
    "idealDepartment": "Technology or Operations or Community Development or Communications",
    "joinReason": "Why join google developer groups on campus? How it will benefit me and how it will help them grow as a developer. Respond as first person noun (i.e: You should..)."
  },
  "workStyleTraits": {
    "LETTER1": "Brief explanation",
    "LETTER2": "Brief explanation",
    "LETTER3": "Brief explanation",
    "LETTER4": "Brief explanation",
    "LETTER5": "Brief explanation",
    "LETTER6": "Brief explanation"
  }
}

IMPORTANT: IF THE 10 LETTER COMBINATION IS INVALID, INVALID SEQUENCE AND NOT ON THE QUESTION CHOICES, RESPOND WITH THE FOLLOWING JSON ONLY:
{
  "error": "Invalid personality code"
}

For reference:
🧩 Trait Decoder
🎯 Core Personality (First 4 letters)
Code	Title	Description
IDCF	Solo Builder	Independent doer who loves building fast
IDCA	Quiet Creative	Visual and detail-oriented, focused on design and UX
IDSF	Silent Fixer	Calm problem-solver who handles systems and bugs
IDSA	Data Whisperer	Analytical and research-driven, sees patterns
EDCF	Startup Hacker	Fast-paced builder, thrives in chaos
EDCA	Team Designer	Design leader who bridges visual and technical
EDSF	Tech Lead	System thinker who guides teams and ships solid work
EDSA	Visionary Analyst	Sees trends, connects dots, builds insight from data
ITSA	Quiet Analyst	Independent thinker, slow and deep problem-solver

🔧 Work Style Traits (Last 6 letters)
Letter	Trait	Description
R	Repeater	Prefers optimizing existing systems
N	Navigator	Loves solving totally new problems
X	Self-Learner	Trial and error, self-taught, hands-on
Y	Social Learner	Learns better through collaboration or instruction
S	Structured	Works best with plans, schedules, order
F	Flow-Based	Goes with inspiration, flexible with tasks
L	Listener	Quietly keeps the team running smoothly
Z	Driver	Brings energy, leads discussions, pushes forward
B	Step Solver	Solves things one logical piece at a time
V	Visionary Thinker	Starts with the big picture and works downward
H	Hacker	Jumps into tools hands-on and figures it out fast
K	Planner	Studies first, thinks before acting or testing


`;

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Check if API key is configured
    if (!GEMINI_API_KEY) {
        console.error('Gemini API key is not configured');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const { personalityCode } = req.body;

        // Validate input
        if (!personalityCode || typeof personalityCode !== 'string') {
            return res.status(400).json({ error: 'Personality code is required' });
        }

        if (personalityCode.length !== 10) {
            return res.status(400).json({ error: 'Invalid personality code. Must be exactly 10 letters.' });
        }

        // Validate the personality code against the valid combinations
        const isValid = isValidPersonalityCode(personalityCode);
        if (!isValid) {
            return res.status(400).json({ error: 'INVALID_CODE' });
        }

        const prompt = `${SYSTEM_PROMPT}\n\nPersonality Code: ${personalityCode.toUpperCase()}`;

        // Call Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API error:', response.status, response.statusText, errorData);
            return res.status(500).json({ 
                error: `Gemini API error: ${response.status} ${response.statusText}` 
            });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid response from Gemini API:', data);
            return res.status(500).json({ error: 'Invalid response from Gemini API' });
        }

        const generatedText = data.candidates[0].content.parts[0].text;

        // Try to extract JSON from the response
        let jsonString = '';
        
        // First, try to find JSON wrapped in code blocks
        const codeBlockMatch = generatedText.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
            jsonString = codeBlockMatch[1].trim();
        } else {
            // Try to find JSON object directly
            const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonString = jsonMatch[0].trim();
            } else {
                // Try to find JSON array (in case it's wrapped in an array)
                const arrayMatch = generatedText.match(/\[[\s\S]*?\{[\s\S]*?\}[\s\S]*?\]/);
                if (arrayMatch) {
                    const parsed = JSON.parse(arrayMatch[0]);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        jsonString = JSON.stringify(parsed[0]);
                    } else {
                        jsonString = arrayMatch[0].trim();
                    }
                }
            }
        }

        if (!jsonString) {
            console.error('Could not extract JSON from Gemini response:', generatedText.substring(0, 500));
            return res.status(500).json({ 
                error: `Could not extract JSON from Gemini response. Response was: ${generatedText.substring(0, 500)}...` 
            });
        }

        let personalityAnalysis;
        try {
            personalityAnalysis = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError.message, jsonString);
            
            // Check if the response was truncated/incomplete
            if (jsonString.length > 0 && !jsonString.includes('}')) {
                return res.status(500).json({ 
                    error: 'The AI response was incomplete or truncated. Please try again.' 
                });
            } else if (jsonString.includes('"summary"') && !jsonString.endsWith('}')) {
                return res.status(500).json({ 
                    error: 'The AI response was cut off mid-generation. Please try again.' 
                });
            } else {
                return res.status(500).json({ 
                    error: `Failed to parse JSON response: ${parseError.message}. The response may be malformed or incomplete.` 
                });
            }
        }

        // Check if Gemini returned an error for invalid code
        if (personalityAnalysis.error) {
            return res.status(400).json({ error: 'INVALID_CODE' });
        }

        // Validate the response structure
        if (!personalityAnalysis.personalityCode || !personalityAnalysis.coreType || !personalityAnalysis.workStyleTraits) {
            return res.status(500).json({ error: 'Invalid personality analysis structure' });
        }

        // Validate core type structure
        if (!personalityAnalysis.coreType.title || !personalityAnalysis.coreType.strengths) {
            return res.status(500).json({ error: 'Invalid core type structure' });
        }

        return res.status(200).json(personalityAnalysis);

    } catch (error) {
        console.error('Error analyzing personality code:', error);
        return res.status(500).json({ 
            error: 'Internal server error while analyzing personality code' 
        });
    }
}
