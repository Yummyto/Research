const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const pool = require('../dbDashboard');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/csv', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded!' });
    }

    const filePath = path.join(__dirname, '..', req.file.path);
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                for (const row of results) {
                    const {
                        firstname,
                        lastname,
                        middlename,
                        Department,
                        year_graduated,
                        field_of_work,
                        experience,
                        other_work,
                        company_name,
                    } = row;

                    // Parse experience safely as integer or null
                    const parsedExperience = experience && !isNaN(experience) ? parseInt(experience) : null;

                    await pool.query(
                        `INSERT INTO students
                         (firstname, lastname, middlename, Department, year_graduated, field_of_work, experience, other_work, company_name)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [
                            firstname,
                            lastname,
                            middlename,
                            Department,
                            year_graduated,
                            field_of_work,
                            parsedExperience,
                            other_work,
                            company_name,
                        ]
                    );
                }

                const io = req.app.get("io");
                io.emit("dataUpdated");

                fs.unlinkSync(filePath); // Delete uploaded file after processing
                res.status(200).json({ message: "CSV uploaded and data inserted successfully" });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: "Failed to insert data" });
            }
        });
});

module.exports = router;
