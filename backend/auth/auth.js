const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Import your PostgreSQL connection pool

const router = express.Router();

// Register Route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    console.log('Signup request received:', { username, email });

    try {
        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Signup request received:', { username, email });

        // Save the user to the database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, hashedPassword]
        );

        // Generate a JWT
        const token = jwt.sign({ id: newUser.rows[0].id }, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzI1NTUxMjQ3LCJleHAiOjE3MjU1NTQ4NDd9.sGgrnkhnJMCcAfLtHdDJV2Mf1pKgleDYCHAklJLurdA", {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT
        const token = jwt.sign({ id: user.rows[0].id }, "9c72cbf363b7b95a4728aea3b905afc87edba75365478ab41044c0427d61bfdb", {
            expiresIn: '1h',
        });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });

    }
});

module.exports = router;
