// routes/dashboard.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // DB connection

router.get('/active-survey', (req, res) => {
    const sql = `
        SELECT sc.id, sc.question
        FROM active_survey_questions AS asq
        JOIN surveys_creation AS sc ON asq.question_id = sc.id
        ORDER BY asq.id ASC
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching survey:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});

module.exports = router;
