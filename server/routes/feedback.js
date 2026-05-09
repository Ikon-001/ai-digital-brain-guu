const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Submit feedback
router.post('/', async (req, res) => {
    const { student_email, subject, message } = req.body;

    if (!student_email || !subject || !message) {
        return res.status(400).json({ error: 'Email, subject and message are required' });
    }

    try {
        const { error } = await supabase.from('feedback').insert({
            student_email,
            subject,
            message,
            status: 'unread'
        });

        if (error) throw error;

        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ error: 'Failed to submit feedback. Please try again.' });
    }
});

// Get all feedback (admin)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Feedback fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch feedback' });
    }
});

// Mark feedback as read (admin)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('feedback')
            .update({ status: 'read' })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true, message: 'Feedback marked as read' });
    } catch (error) {
        console.error('Feedback update error:', error);
        res.status(500).json({ error: 'Failed to update feedback' });
    }
});

module.exports = router;