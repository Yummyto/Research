const express = require('express');
const router = express.Router();
const pool = require('../dbDashboard');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

// Multer config to save uploaded CSVs to /uploads
const upload = multer({ dest: 'uploads/' });

/**
 * GET /api/dashboard/working-summary
 */
router.get('/working-summary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Department, COUNT(*) AS count
            FROM students
            WHERE
                Department IN ('COT', 'COED', 'COHTM')
              AND field_of_work IS NOT NULL
              AND field_of_work != ''
            GROUP BY Department
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error in working-summary:", err);
        res.status(500).json({ error: 'Failed to fetch working summary' });
    }
});

/**
 * GET /api/dashboard/department-summary
 */
router.get('/department-summary', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT Department, COUNT(*) AS count
            FROM students
            WHERE
                Department IN ('COT', 'COED', 'COHTM')
              AND field_of_work IS NOT NULL
              AND field_of_work != ''
            GROUP BY Department
        `);
        res.json(rows);
    } catch (err) {
        console.error("Error in department-summary:", err);
        res.status(500).json({ error: 'Failed to fetch department summary' });
    }
});

/**
 * POST /api/dashboard/upload-csv
 */
router.post('/upload-csv', upload.single('csv'), async (req, res) => {
    const filePath = req.file.path;
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    const {
                        name,
                        Department,
                        year_graduated,
                        field_of_work,
                        experience,
                        other_work,
                        company_name,
                    } = row;

                    await pool.query(
                        `INSERT INTO students
                         (name, Department, year_graduated, field_of_work, experience, other_work, company_name)
                         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [
                            name || null,
                            Department || null,
                            year_graduated || null,
                            field_of_work || null,
                            experience || null,
                            other_work || null,
                            company_name || null,
                        ]
                    );
                }

                fs.unlinkSync(filePath);
                req.app.get('io').emit('dataUpdated');

                res.json({ message: 'CSV uploaded and data inserted successfully!' });
            } catch (err) {
                console.error("Error inserting CSV data:", err);
                res.status(500).json({ error: 'Failed to insert CSV data' });
            }
        })
        .on('error', (err) => {
            console.error("Error reading CSV file:", err);
            res.status(500).json({ error: 'Failed to process CSV file' });
        });
});

// ================== CREATE SURVEY QUESTIONS ==================
router.post('/create-survey', async (req, res) => {
    try {
        const { question, category, questions } = req.body;

        if (Array.isArray(questions)) {
            if (questions.length === 0) {
                return res.status(400).json({ message: 'Questions array is empty.' });
            }
            if (questions.length > 10) {
                return res.status(400).json({ message: 'You can only add up to 10 questions.' });
            }

            const cleaned = questions.map(q => (typeof q === 'string' ? q.trim() : '')).filter(q => q.length > 0);
            if (cleaned.length === 0) {
                return res.status(400).json({ message: 'All provided questions are empty.' });
            }

            const conn = await pool.getConnection();
            try {
                await conn.beginTransaction();

                const insertSql = 'INSERT INTO surveys_creation (question, category) VALUES ?';
                const values = cleaned.map(q => [q, category || null]);

                await conn.query(insertSql, [values]);
                await conn.commit();
                res.status(201).json({ message: 'Survey questions added successfully', count: cleaned.length });
            } catch (txErr) {
                await conn.rollback();
                console.error('Transaction error inserting questions:', txErr);
                res.status(500).json({ message: 'Failed to add survey questions.' });
            } finally {
                conn.release();
            }
            return;
        }

        const finalQuestion = (typeof question === 'string' ? question.trim() : '');
        if (!finalQuestion) {
            return res.status(400).json({ message: 'Question is required' });
        }

        await pool.query(
            'INSERT INTO surveys_creation (question, category) VALUES (?, ?)',
            [finalQuestion, category || null]
        );

        res.status(201).json({ message: 'Survey question added successfully' });
    } catch (error) {
        console.error('Survey Creation Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ================== GET SURVEY QUESTIONS ==================
router.get('/surveys', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM surveys_creation ORDER BY created_at ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Fetch Survey Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ================== DEPLOY SURVEY (active_survey_questions) ==================
router.post('/deploy-survey', async (req, res) => {
    try {
        const { questionIds } = req.body;

        if (!Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({ message: 'Please select at least one question.' });
        }
        if (questionIds.length > 10) {
            return res.status(400).json({ message: 'You can only select up to 10 questions.' });
        }

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Clear previous active survey
            await conn.query('DELETE FROM active_survey_questions');

            // Insert new active questions
            const values = questionIds.map(qid => [qid]);
            await conn.query('INSERT INTO active_survey_questions (question_id) VALUES ?', [values]);

            await conn.commit();
            res.json({ message: 'Survey deployed successfully!' });
        } catch (err) {
            await conn.rollback();
            console.error("Deploy Survey Transaction Error:", err);
            res.status(500).json({ message: 'Failed to deploy survey.' });
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Deploy Survey Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ================== GET ACTIVE SURVEY QUESTIONS ==================
router.get('/active-survey', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT sc.id, sc.question
            FROM active_survey_questions asq
            JOIN surveys_creation sc ON asq.question_id = sc.id
            ORDER BY asq.id ASC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Fetch Active Survey Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
