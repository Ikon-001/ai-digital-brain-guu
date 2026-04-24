const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/', async (req, res) => {
    const { message, user_email } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are the AI assistant for Gregory University, Uturu (GUU), a private university located in Uturu, Abia State, Nigeria, established in 2012. You help students and staff with academic and administrative queries. Be helpful, friendly, and concise.\n\nStudent question: ${message}`
                        }]
                    }]
                })
            }
        );

        const data = await response.json();
        console.log('Gemini response:', JSON.stringify(data, null, 2));
const aiResponse = data.candidates[0].content.parts[0].text;

        // Save to Supabase
        await supabase.from('chat_logs').insert({
            user_message: message,
            ai_response: aiResponse,
            user_email: user_email || null
        });

        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

module.exports = router;