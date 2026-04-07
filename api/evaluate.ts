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
            playbookContext?: string;
        };

        const { userText, stageContext, personaName, playbookContext } = body;

        const knowledgeBlock = playbookContext
            ? `\n\n## VERIFIED CONDENSE PRODUCT KNOWLEDGE (only use facts from this section):\n${playbookContext}`
            : '';

        const evaluatePrompt = `
You are an expert sales manager AI evaluating a sales rep's pitch.
The sales rep is talking to: ${personaName}.
The current concern they must address is: "${stageContext}"${knowledgeBlock}

The sales rep said: "${userText}"

Evaluate if the sales rep successfully, logically, and accurately addressed the core concern.
- If the answer is completely off-topic, return success: false.
- If it uses a keyword but makes no logical sense in context, return success: false.
- If it correctly and persuasively addresses the concern using accurate product knowledge, return success: true.
- Only accept claims that align with the verified knowledge above. Do not reward hallucinated features.

Output EXACTLY AND ONLY valid JSON:
{
  "success": boolean,
  "reasoning": "One sentence explaining why it passed or failed"
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
        
        let result = { success: false, reasoning: 'Failed to parse evaluation.' };
        try {
            result = JSON.parse(text);
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
