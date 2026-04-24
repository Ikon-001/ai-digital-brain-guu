const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get all chat logs
router.get('/chats', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('chat_logs')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Logs error:', error);
        res.status(500).json({ error: 'Failed to fetch chat logs' });
    }
});

// Get all notification logs
router.get('/notifications', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Logs error:', error);
        res.status(500).json({ error: 'Failed to fetch notification logs' });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Logs error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

module.exports = router;