const mysql = require('mysql2');


const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: 'root',
    password: '',
    database: 'tsp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();
