const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/register', async (req, res) => {
    const { name, email, department, level } = req.body;

    if (!name || !email || !department || !level) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Check if email already exists
        const { data: existing } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const { error } = await supabase.from('users').insert({
            name,
            email,
            department,
            level: parseInt(level),
            role: 'student'
        });

        if (error) throw error;

        res.json({ message: 'Registration successful! You can now receive notifications.' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

module.exports = router;