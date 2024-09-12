// favorites.js

const express = require('express');
const pool = require('../db'); // Your database connection
const authenticateToken = require('../middleware/authMiddleware'); // Import the token middleware

const router = express.Router();

// Get user's favorite teams (protected route)
router.get('/teams', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Query the user's favorite teams
        const favorites = await pool.query('SELECT team_id FROM favorite_teams WHERE user_id = $1', [userId]);

        // Return the array of team IDs
        res.json(favorites.rows.map(row => row.team_id));
    } catch (err) {
        console.error('Error fetching favorite teams:', err.message);
        res.status(500).send('Server error');
    }
});

// Save a favorite team (protected route)
router.post('/teams', authenticateToken, async (req, res) => {
    const { teamId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the team is already favorited by the user
        const existingFavorite = await pool.query(
            'SELECT * FROM favorite_teams WHERE user_id = $1 AND team_id = $2',
            [userId, teamId]
        );

        if (existingFavorite.rows.length > 0) {
            return res.status(400).json({ message: 'Team is already in favorites' });
        }

        // Insert the favorite team into the database
        const newFavorite = await pool.query(
            'INSERT INTO favorite_teams (user_id, team_id) VALUES ($1, $2) RETURNING *',
            [userId, teamId]
        );

        res.json(newFavorite.rows[0]); // Return the inserted favorite
    } catch (err) {
        console.error('Error saving favorite team:', err.message);
        res.status(500).send('Server error');
    }
});

// Save a favorite player (protected route)
router.post('/players', authenticateToken, async (req, res) => {
    const { playerId } = req.body;
    const userId = req.user.id;

    try {
        // Check if the player is already favorited by the user
        const existingFavorite = await pool.query(
            'SELECT * FROM favorite_players WHERE user_id = $1 AND player_id = $2',
            [userId, playerId]
        );

        if (existingFavorite.rows.length > 0) {
            return res.status(400).json({ message: 'Player is already in favorites' });
        }

        // Insert the favorite player into the database
        const newFavorite = await pool.query(
            'INSERT INTO favorite_players (user_id, player_id) VALUES ($1, $2) RETURNING *',
            [userId, playerId]
        );

        res.json(newFavorite.rows[0]);
    } catch (err) {
        console.error('Error saving favorite player:', err.message);
        res.status(500).send('Server error');
    }
});

// Get user's favorite players (protected route)
router.get('/players', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Query the user's favorite players
        const favorites = await pool.query('SELECT player_id FROM favorite_players WHERE user_id = $1', [userId]);

        // Return the array of player IDs
        res.json(favorites.rows.map(row => row.player_id));
    } catch (err) {
        console.error('Error fetching favorite players:', err.message);
        res.status(500).send('Server error');
    }
});

// Delete a favorite player (protected route)
router.delete('/players/:playerId', authenticateToken, async (req, res) => {
    const playerId = req.params.playerId;
    const userId = req.user.id;

    try {
        // Check if the player is in the user's favorites
        const existingFavorite = await pool.query(
            'SELECT * FROM favorite_players WHERE user_id = $1 AND player_id = $2',
            [userId, playerId]
        );

        if (existingFavorite.rows.length === 0) {
            return res.status(404).json({ message: 'Player not found in favorites' });
        }

        // Remove the favorite player from the database
        await pool.query(
            'DELETE FROM favorite_players WHERE user_id = $1 AND player_id = $2',
            [userId, playerId]
        );

        res.status(200).json({ message: 'Player removed from favorites' });
    } catch (err) {
        console.error('Error removing favorite player:', err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
