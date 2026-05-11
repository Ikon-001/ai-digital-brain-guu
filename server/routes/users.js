const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Register
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

// Request PIN (login or post-registration)
router.post('/request-pin', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        // check user exists
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('email', email)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ error: 'No account found with that email.' });
        }

        // generate 4-digit PIN
        const pin = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

        // save PIN to user record
        const { error: updateError } = await supabase
            .from('users')
            .update({ pin, pin_expires_at: expiresAt })
            .eq('email', email);

        if (updateError) throw updateError;

        // send PIN via SendGrid
        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
            },
            body: JSON.stringify({
                personalizations: [{ to: [{ email }] }],
                from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'GUU AI Digital Brain' },
                subject: 'Your GUU Login PIN',
                content: [{
                    type: 'text/plain',
                    value: `Hi ${user.name},\n\nYour GUU AI Digital Brain login PIN is:\n\n${pin}\n\nThis PIN expires in 10 minutes. Do not share it with anyone.\n\nIf you did not request this, please ignore this email.\n\n— GUU AI Digital Brain`
                }]
            })
        });

        if (!sgResponse.ok) {
            const sgError = await sgResponse.json();
            throw new Error(JSON.stringify(sgError));
        }

        res.json({ success: true, message: 'PIN sent to your email.' });

    } catch (error) {
        console.error('Request PIN error:', error);
        res.status(500).json({ error: 'Failed to send PIN. Please try again.' });
    }
});

// Verify PIN
router.post('/verify-pin', async (req, res) => {
    const { email, pin } = req.body;

    if (!email || !pin) {
        return res.status(400).json({ error: 'Email and PIN are required' });
    }

    try {
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (fetchError || !user) {
            return res.status(404).json({ error: 'No account found with that email.' });
        }

        // check PIN matches
        if (user.pin !== pin) {
            return res.status(400).json({ error: 'Incorrect PIN. Please try again.' });
        }

        // check PIN not expired
        if (!user.pin_expires_at || new Date() > new Date(user.pin_expires_at)) {
            return res.status(400).json({ error: 'PIN has expired. Please request a new one.' });
        }

        // clear PIN after successful use
        await supabase
            .from('users')
            .update({ pin: null, pin_expires_at: null })
            .eq('email', email);

        // return user data (excluding PIN)
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
                level: user.level,
                staff_role: user.staff_role,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error('Verify PIN error:', error);
        res.status(500).json({ error: 'Verification failed. Please try again.' });
    }
});

module.exports = router;