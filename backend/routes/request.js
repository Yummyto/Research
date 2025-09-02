// backend/routes/request.js
const express = require("express");
const router = express.Router();
const dashboardPool = require("../dbDashboard");

// ================================
// 📌 Get all pending requests with student name
// ================================
router.get("/pending", async (req, res) => {
    try {
        const [rows] = await dashboardPool.query(
            `SELECT r.id, r.document_type, r.reserved_date, r.reserved_time,
                    CONCAT(s.firstname, ' ', s.lastname) AS student_name
             FROM reservations r
                      JOIN students s ON r.student_id = s.id_number
             WHERE r.status = 'pending'
             ORDER BY r.reserved_date DESC, r.reserved_time DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching pending requests:", err);
        res.status(500).json({ error: "Error fetching pending requests" });
    }
});

// ================================
// 📌 Get all approved requests with student name
// ================================
router.get("/approved", async (req, res) => {
    try {
        const [rows] = await dashboardPool.query(
            `SELECT r.id, r.document_type, r.reserved_date, r.reserved_time, 
                    CONCAT(s.firstname, ' ', s.lastname) AS student_name
             FROM reservations r
             JOIN students s ON r.student_id = s.id_number
             WHERE r.status = 'approved'
             ORDER BY r.reserved_date DESC, r.reserved_time DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching approved requests:", err);
        res.status(500).json({ error: "Error fetching approved requests" });
    }
});

// ================================
// 📌 Approve request
// ================================
router.put("/:id/approve", async (req, res) => {
    try {
        const { id } = req.params;
        await dashboardPool.query(
            "UPDATE reservations SET status = 'approved', decline_reason = NULL WHERE id = ?",
            [id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error("Error approving request:", err);
        res.status(500).json({ error: "Error approving request" });
    }
});

// ================================
// 📌 Decline request (store reason in DB)
// ================================
router.put("/:id/decline", async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        await dashboardPool.query(
            "UPDATE reservations SET status = 'declined', decline_reason = ? WHERE id = ?",
            [reason, id]
        );

        res.json({ success: true });
    } catch (err) {
        console.error("Error declining request:", err);
        res.status(500).json({ error: "Error declining request" });
    }
});

module.exports = router;
