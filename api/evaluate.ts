export const config = {
    runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return new Response(
            JSON.stringify({ error: 'API Key missing' }),
            { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const body = await req.json() as {
            userText: string;
            stageContext: string;
            personaName: string;
        };

        const { userText, stageContext, personaName } = body;

        const evaluatePrompt = `
You are a helpful sales coach AI evaluating a sales trainee's pitch response.
The trainee is talking to: ${personaName}.
The concern they need to address:
"${stageContext}"

The trainee said:
"${userText}"

Carefully evaluate how well the trainee addressed the concern. Be encouraging and fair.

Scoring rules:
- "pass"   : The trainee fully and correctly addressed the concern with a logical, relevant answer.
- "near"   : The trainee is 80-90% correct — they got the core idea but missed 1-2 specific key points or used slightly wrong terms. Provide a hint with the missing part.
- "partial": The trainee gave a relevant but incomplete or vague answer that needs more depth. Provide a guiding question to help them expand.
- "fail"   : The answer is completely off-topic, irrelevant, too short, or makes no sense.

Output EXACTLY AND ONLY valid JSON in this format (no extra text):
{
  "result": "pass" | "near" | "partial" | "fail",
  "reasoning": "A 1-sentence coach-friendly explanation.",
  "hint": "(Only for near/partial) A short, kind hint or guiding question to help the trainee. Empty string for pass/fail."
}
`;

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

        const geminiRes = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: evaluatePrompt }] }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 150,
                    responseMimeType: "application/json"
                }
            }),
        });

        if (!geminiRes.ok) {
            console.error('Gemini Eval error:', await geminiRes.text());
            return new Response(JSON.stringify({ success: false, reasoning: 'API Error' }), {
                status: 200, // Degrade gracefully
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const data = await geminiRes.json() as {
            candidates?: { content?: { parts?: { text?: string }[] } }[]
        };

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
        
        let result: { result: string; reasoning: string; hint: string } = { result: 'fail', reasoning: 'Failed to parse evaluation.', hint: '' };
        try {
            result = JSON.parse(text);
            // Backwards compat: if old format with 'success' boolean
            if (typeof (result as any).success === 'boolean') {
                result.result = (result as any).success ? 'pass' : 'fail';
            }
        } catch (e) {
            console.error('Eval parse error:', text);
        }

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (err) {
        console.error('Eval proxy error:', err);
        return new Response(JSON.stringify({ success: false, reasoning: 'Internal Error' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
