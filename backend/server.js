const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./auth/auth'); // Adjust the path as necessary
const favoriteRoutes = require('./routes/favorites'); // New route for favorites

// app.use(cors());
app.use(cors({
    origin: 'https://nbareels.onrender.com', // Frontend URL
    credentials: true // If you're dealing with cookies or auth headers
}));
app.use(express.json());

// Use the auth routes
app.use('/api/auth', authRoutes);

// Use the favorite routes
app.use('/api/favorites', favoriteRoutes); // Handle favorites

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

