import pool from '../Utils/pool.js';

// retourne le résultat d'une recherche de membres d'une association en fonction d'une partie de son nom
export async function getMembersByLastname(lastname, association_id) {
    const [rows] = await pool.query(`
        SELECT * FROM members 
        WHERE LOWER(lastname) LIKE LOWER(?) 
        AND association_id = ?`,
        [`%${lastname}%`, association_id]
    );
    return rows;
}