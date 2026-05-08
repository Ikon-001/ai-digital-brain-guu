const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/register', async (req, res) => {
    const { name, email, department, level, role, staff_role } = req.body;

    if (!name || !email || !department) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (role !== 'admin' && !level) {
        return res.status(400).json({ error: 'Academic level is required for students' });
    }

    try {
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
            level: role === 'admin' ? null : parseInt(level),
            role: role === 'admin' ? 'admin' : 'student',
            staff_role: role === 'admin' ? staff_role : null
        });

        if (error) throw error;

        res.json({
            message: role === 'admin'
                ? 'Admin account created successfully.'
                : 'Registration successful! You can now receive notifications.'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed. Please try again.' });
    }
});

module.exports = router;