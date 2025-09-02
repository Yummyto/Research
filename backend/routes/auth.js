// auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db.js'); // MySQL2/promise pool (do not change)
const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
    const { firstname, lastname, middlename, email, password } = req.body;

    if (!firstname || !lastname || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO admin_info (firstname, lastname, middlename, email, passwords) VALUES (?, ?, ?, ?, ?)',
            [firstname, lastname, middlename || null, email, hashedPassword]
        );

        res.status(200).json({ message: 'User registered' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Signup failed' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing email or password' });
    }

    try {
        const [results] = await pool.query(
            'SELECT * FROM admin_info WHERE email = ?',
            [email]
        );

        if (results.length === 0) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.passwords);

        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Do not include password in response
        const { passwords, ...safeUser } = user;

        res.status(200).json({ message: 'Login successful', user: safeUser });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});


module.exports = router;
