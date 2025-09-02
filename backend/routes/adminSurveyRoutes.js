const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
function adminOnly(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}

// Deploy survey (select up to 10 questions)
router.post('/deploy-survey', auth, adminOnly, (req, res) => {
    const { questionIds } = req.body;

    if (!Array.isArray(questionIds) || questionIds.length === 0 || questionIds.length > 10) {
        return res.status(400).json({ message: 'You must select between 1 and 10 questions.' });
    }

    // Clear existing active survey
    db.query('DELETE FROM active_survey_questions', (err) => {
        if (err) return res.status(500).json({ message: 'DB error' });

        // Insert selected questions
        const values = questionIds.map(qId => [qId]);
        db.query('INSERT INTO active_survey_questions (question_id) VALUES ?', [values], (err2) => {
            if (err2) return res.status(500).json({ message: 'DB error' });
            res.json({ message: 'Survey deployed successfully.' });
        });
    });
});

// Get active survey for student side
router.get('/active-survey', (req, res) => {
    db.query(`
        SELECT sc.id, sc.question 
        FROM active_survey_questions as asq
        JOIN surveys_creation sc ON sc.id = asq.question_id
    `, (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        res.json(results);
    });
});

module.exports = router;
