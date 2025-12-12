const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool(
    process.env.MYSQL_URL || process.env.DATABASE_URL || {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'construction_erp',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    }
);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.code, err.message);
    } else {
        console.log('Connected to MySQL Database');
        connection.release();
    }
});

module.exports = pool.promise();
