import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

// paramètres de connexion à la DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise()


export default pool