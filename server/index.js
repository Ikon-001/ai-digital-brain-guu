const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'AI Digital Brain GUU — Server is running' });
});

// Routes (we'll add these as we build)
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notify', require('./routes/notify'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});