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

// Soft delete a notification
router.patch('/notifications/:id/delete', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_deleted: true })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true, message: 'Notification deleted successfully.' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete notification. Please try again.' });
    }
});

// Restore a soft deleted notification
router.patch('/notifications/:id/restore', async (req, res) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('notifications')
            .update({ is_deleted: false })
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true, message: 'Notification restored successfully.' });
    } catch (error) {
        console.error('Restore error:', error);
        res.status(500).json({ error: 'Failed to restore notification. Please try again.' });
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