import mysql from 'mysql2';

import dotenv from 'dotenv';
dotenv.config();

// paramètres de connexion à la DB
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 8889
}).promise()

//console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME)

export default pool