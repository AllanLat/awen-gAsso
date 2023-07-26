import pool from '../Utils/pool.js'

//retourne tous les paiements d'une association
export async function viewAll(associationId) {
    const [rows] = await pool.query('SELECT * FROM payments WHERE association_id = ? ORDER BY id DESC', [associationId])
    return rows
}

export async function addPayment(association_id, credit, debit, payment_method, payment_date, description, balance){
    const [result] = await pool.query(`INSERT INTO payments (association_id, credit, debit, payment_method, payment_date, description, balance)
    VALUE (?, ?, ?, ?, ?, ?, ?)
    `,
    [association_id, credit, debit, payment_method, payment_date, description, balance],
    )

    const [updateCred] = await pool.query('UPDATE payments SET balance = balance + ? WHERE id = (SELECT MAX(id)) AND description = ? AND association_id = ? AND payment_date = ?' , [credit, description, association_id, payment_date])
    const [updateDeb] = await pool.query('UPDATE payments SET balance = balance - ? WHERE id = (SELECT MAX(id)) AND description = ? AND association_id = ? AND payment_date = ?' , [debit, description, association_id, payment_date])
    const [link_table] = await pool.query('UPDATE payments SET ')
    return result, updateCred, updateDeb
}
 
export async function getBalance(association_id) {
    
    const[getLast] = await pool.query('SELECT balance FROM payments WHERE association_id = ? AND id = (SELECT MAX(id) FROM payments)',
    [association_id])

    return getLast

}

