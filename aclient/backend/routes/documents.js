const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Get available document types
router.get("/types", (req, res) => {
  res.json({
    types: [
      "TOR",
      "Good Moral",
      "Certificate of Enrollment",
      "Transfer Credentials",
    ],
  });
});

// Create reservation and survey
router.post("/reserve", auth, (req, res) => {
  const { document_type, reserved_date, reserved_time, survey } = req.body;
  const studentId = req.user.id; // id_number saved in token at login

  // Debug: Log the received data
  console.log("Received reservation request:", {
    document_type,
    reserved_date,
    reserved_time,
    survey,
  });

  if (!document_type || !reserved_date || !reserved_time) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // ✅ Fetch full name by concatenating columns
  db.query(
    `SELECT CONCAT(lastname, ', ', firstname, ' ', COALESCE(middlename, '')) AS full_name 
         FROM students 
         WHERE id_number = ?`,
    [studentId],
    (err, studentResult) => {
      if (err) {
        console.error("Error fetching student name:", err);
        return res.status(500).json({ message: "DB error" });
      }
      if (studentResult.length === 0) {
        return res.status(404).json({ message: "Student not found" });
      }

      const studentName = studentResult[0].full_name.trim();

      // 1️⃣ Insert into reservations
      db.query(
        "INSERT INTO reservations (student_id, document_type, reserved_date, reserved_time) VALUES (?, ?, ?, ?)",
        [studentId, document_type, reserved_date, reserved_time],
        (err2, reservationResult) => {
          if (err2) {
            console.error("Error inserting reservation:", err2);
            return res.status(500).json({ message: "DB error" });
          }

          const reservationId = reservationResult.insertId;

          // Prepare q1–q10 values from survey object
          let qValues = [];
          for (let i = 1; i <= 10; i++) {
            const answer = survey?.[`q${i}`] || "";
            qValues.push(answer);
          }

          // Debug: Log the values being inserted
          console.log("Q Values being inserted:", qValues);
          console.log("Survey object received:", survey);

          // 2️⃣ Insert into surveys table (student_name + q1–q10)
          db.query(
            `INSERT INTO surveys 
                        (reservation_id, student_name, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [reservationId, studentName, ...qValues],
            (err3) => {
              if (err3) {
                console.error("Error inserting survey answers:", err3);
                return res.status(500).json({ message: "DB error" });
              }
              res.json({
                message: "Reservation and survey created",
                reservationId,
              });
            }
          );
        }
      );
    }
  );
});

// Get current user's reservations
router.get("/my", auth, (req, res) => {
  db.query(
    "SELECT * FROM reservations WHERE student_id=? ORDER BY created_at DESC",
    [req.user.id],
    (err, results) => {
      if (err) {
        console.error("Error fetching reservations:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.json(results);
    }
  );
});

module.exports = router;
