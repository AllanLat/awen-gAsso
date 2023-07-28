import pool from "../Utils/pool.js"

export async function viewAllMemberPayments(member_id) {

    const [rows] = await pool.query('SELECT * FROM members_payments JOIN payments ON members_payments.payment_id = payments.id WHERE member_id = ? ORDER BY payment_date DESC', 
    [member_id])
   
    
    

    return rows
}

export async function addPaymentMember(member_id, payment_id) {

    const[input] = await pool.query('INSERT INTO members_payments (member_id, payment_id) VALUE (?,?)',
    [member_id, payment_id])

    const [inputAddMember] = await pool.query('UPDATE members SET paid = paid')

    return input
}

export async function addPaymentInMember(member_id, pay){

    
}

