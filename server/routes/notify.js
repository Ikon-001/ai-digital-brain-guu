const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

router.post('/', async (req, res) => {
    const { title, message, targets, logic, sent_by, is_emergency } = req.body;

    if (!title || !message || !targets || targets.length === 0) {
        return res.status(400).json({ error: 'Title, message and at least one target are required' });
    }

    try {
        let emails = [];

        // Emergency broadcast — send to everyone, skip target logic
        if (is_emergency) {
            const { data, error } = await supabase.from('users').select('email');
            if (error) throw error;
            emails = data?.map(u => u.email) || [];
        } else if (logic === 'AND') {
            let query = supabase.from('users').select('email');

            for (const target of targets) {
                if (target === 'all') {
                    break;
                } else if (target === 'all_students') {
                    query = query.eq('role', 'student');
                } else if (target === 'all_staff') {
                    query = query.eq('role', 'admin');
                } else if (target.startsWith('dept:')) {
                    query = query.eq('department', target.replace('dept:', ''));
                } else if (target.startsWith('level:')) {
                    query = query.eq('level', parseInt(target.replace('level:', '')));
                }
            }

            const { data, error } = await query;
            if (error) throw error;
            emails = data?.map(u => u.email) || [];

        } else {
            let emailSet = new Set();

            for (const target of targets) {
                let query = supabase.from('users').select('email');

                if (target === 'all') {
                    const { data } = await supabase.from('users').select('email');
                    data?.forEach(u => emailSet.add(u.email));
                    continue;
                } else if (target === 'all_students') {
                    query = query.eq('role', 'student');
                } else if (target === 'all_staff') {
                    query = query.eq('role', 'admin');
                } else if (target.startsWith('dept:')) {
                    query = query.eq('department', target.replace('dept:', ''));
                } else if (target.startsWith('level:')) {
                    query = query.eq('level', parseInt(target.replace('level:', '')));
                }

                const { data, error } = await query;
                if (error) throw error;
                data?.forEach(u => emailSet.add(u.email));
            }

            emails = [...emailSet];
        }

        if (emails.length === 0) {
            return res.status(404).json({ error: 'No users found for the selected target groups' });
        }

        // Send emails via SendGrid
        const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
            },
            body: JSON.stringify({
                personalizations: [{ to: emails.map(email => ({ email })) }],
                from: { email: process.env.SENDGRID_FROM_EMAIL, name: 'GUU AI Digital Brain' },
                subject: is_emergency ? `🚨 EMERGENCY: ${title}` : title,
                content: [{ type: 'text/plain', value: message }]
            })
        });

        if (!sgResponse.ok) {
            const sgError = await sgResponse.json();
            throw new Error(JSON.stringify(sgError));
        }

        await supabase.from('notifications').insert({
            title,
            message,
            target: is_emergency ? 'EMERGENCY — All Members' : `(${logic}) ${targets.join(', ')}`,
            sent_by: sent_by || 'admin',
            status: 'sent',
            recipient_count: emails.length,
            is_emergency: is_emergency || false
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