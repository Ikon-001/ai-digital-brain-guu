const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/', async (req, res) => {
    const { title, message, target, sent_by } = req.body;

    if (!title || !message || !target) {
        return res.status(400).json({ error: 'Title, message and target are required' });
    }

    try {
        // Get recipient emails from Supabase
        let query = supabase.from('users').select('email');

        if (target !== 'all') {
            // target format: "dept:Computer Science" or "level:300"
            const [type, value] = target.split(':');
            if (type === 'dept') {
                query = query.eq('department', value);
            } else if (type === 'level') {
                query = query.eq('level', value);
            }
        }

        const { data: users, error: userError } = await query;

        if (userError) throw userError;

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found for this target group' });
        }

        // Send emails via SendGrid
        const emails = users.map(u => u.email);

        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
            },
            body: JSON.stringify({
                personalizations: [{
                    to: emails.map(email => ({ email }))
                }],
                from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'GUU AI Digital Brain' },
                subject: title,
                content: [{ type: 'text/plain', value: message }]
            })
        });

        if (!sgResponse.ok) {
            const sgError = await sgResponse.json();
            throw new Error(JSON.stringify(sgError));
        }

        // Save notification log to Supabase
        await supabase.from('notifications').insert({
            title,
            message,
            target,
            sent_by: sent_by || 'admin',
            status: 'sent'
        });

        res.json({ 
            success: true, 
            message: `Notification sent to ${emails.length} recipient(s)` 
        });

    } catch (error) {
        console.error('Notify error:', error);
        res.status(500).json({ error: 'Failed to send notification. Please try again.' });
    }
});

module.exports = router;