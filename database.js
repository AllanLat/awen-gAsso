import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

// connection to database parameters
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()


async function getAssociations () {
    const [rows] = await pool.execute('SELECT * FROM associations');
    return rows;
}

const associations = await getAssociations();
console.log(associations);