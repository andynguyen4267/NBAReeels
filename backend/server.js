const express = require('express');
const app = express();
const authRoutes = require('./auth/auth'); // Adjust the path as necessary

app.use(express.json());

// Use the auth routes
app.use('/api/auth', authRoutes);

const PORT = 5432 || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
