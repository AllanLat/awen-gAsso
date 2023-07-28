import pool from "../Utils/pool.js"

export async function viewAllMemberPayments(member_id) {

    const [rows] = await pool.query('SELECT * FROM members_payments JOIN payments ON members_payments.payment_id = payments.id WHERE member_id = ? ORDER BY payment_date DESC', 
    [member_id])

    return rows
}