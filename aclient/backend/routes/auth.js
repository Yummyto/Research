const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const {
            firstname,
            middlename,
            lastname,
            email,
            birthdate,
            year_graduated,
            department,
            password,
            currently_working,
            field_of_work,
            other_work,
            experience,
            company_name // <-- Added
        } = req.body;

        if (!firstname || !lastname || !email || !birthdate || !year_graduated || !department || !password) {
            return res.status(400).json({ message: 'All required fields must be filled.' });
        }

        // Verify student record exists
        db.query(
            `SELECT * FROM students
             WHERE firstname=? AND middlename=? AND lastname=?
               AND birthdate=? AND year_graduated=? AND Department=?`,
            [firstname, middlename, lastname, birthdate, year_graduated, department],
            async (err, results) => {
                if (err) {
                    console.error('DB error:', err);
                    return res.status(500).json({ message: 'Database error.' });
                }

                if (results.length === 0) {
                    return res.status(400).json({ message: 'Verification failed: Student not found.' });
                }

                const student = results[0];

                if (student.user_account === 1) {
                    return res.status(400).json({ message: 'Account already exists.' });
                }

                try {
                    const hashedPassword = await bcrypt.hash(password, 10);

                    // If field_of_work is not "Others", clear other_work
                    let otherWorkValue = field_of_work === "Others" ? other_work : null;

                    db.query(
                        `UPDATE students
                         SET user_email=?, user_password=?, user_account=1,
                             currently_working=?, field_of_work=?, other_work=?, experience=?, company_name=?
                         WHERE id_number=?`,
                        [
                            email,
                            hashedPassword,
                            currently_working || null,
                            field_of_work || null,
                            otherWorkValue,
                            experience || null,
                            company_name || null, // <-- Added
                            student.id_number
                        ],
                        (updateErr) => {
                            if (updateErr) {
                                console.error('Update error:', updateErr);
                                return res.status(500).json({ message: 'Error creating account.' });
                            }
                            res.json({ message: 'Account created successfully!' });
                        }
                    );
                } catch (hashErr) {
                    console.error('Hashing error:', hashErr);
                    res.status(500).json({ message: 'Password hashing failed.' });
                }
            }
        );
    } catch (e) {
        console.error('Signup error:', e);
        res.status(500).json({ message: 'Server error.' });
    }
});

// LOGIN
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.query(`SELECT * FROM students WHERE user_email=?`, [email], async (err, results) => {
        if (err) {
            console.error('DB error:', err);
            return res.status(500).json({ message: 'Database error.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const student = results[0];

        try {
            const isMatch = await bcrypt.compare(password, student.user_password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            const token = jwt.sign(
                { id: student.id_number, email: student.user_email },
                'secretkey',
                { expiresIn: '1h' }
            );

            res.json({ token, student });
        } catch (compareErr) {
            console.error('Compare error:', compareErr);
            res.status(500).json({ message: 'Error checking password.' });
        }
    });
});

module.exports = router;
