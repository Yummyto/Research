// backend/dbDashboard.js
const mysql = require('mysql2/promise');

const dashboardPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Yumboy03!',
    database: 'school_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = dashboardPool;
