const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./auth/auth'); // Adjust the path as necessary
const favoriteRoutes = require('./routes/favorites'); // New route for favorites

app.use(cors());
app.use(express.json());

// Use the auth routes
app.use('/api/auth', authRoutes);

// Use the favorite routes
app.use('/api/favorites', favoriteRoutes); // Handle favorites

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

