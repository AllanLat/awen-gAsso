import mysql from 'mysql2';

// connection to database parameters
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'g_asso'
}).promise()


const [rows] = await pool.execute('SELECT * FROM associations');
/*  
    equals to :
    const result = await pool.query('SELECT * FROM associations');
    const rows = result[0]; 
*/

console.log(rows);