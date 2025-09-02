// backend/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       // e.g. 'root'
    password: 'Yumboy03!',   // e.g. 'password'
    database: 'alumniadmin',         // your database name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;
