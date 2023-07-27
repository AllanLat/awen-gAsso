import pool from "../Utils/pool.js"

export async function viewAllMemberPayments(member_id) {

    const [rows] = await pool.query('SELECT * FROM members_payments WHERE member_id = ? ORDER BY id DESC', 
    [member_id])

    return rows
}