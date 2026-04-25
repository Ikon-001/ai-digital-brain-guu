const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const Groq = require('groq-sdk');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
    const { message, user_email } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are the AI assistant for Gregory University, Uturu (GUU), a private university located in Uturu, Abia State, Nigeria, established in 2012. You help students and staff with academic and administrative queries. Be helpful, friendly, and concise.'
                },
                {
                    role: 'user',
                    content: message
                }
            ]
        });

        const aiResponse = completion.choices[0].message.content;

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