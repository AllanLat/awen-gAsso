import pool from '../Utils/pool.js';

// ajoute une adresse 
export async function createAddress(street, postal_code, city) {
    const [result] = await pool.query(`
        INSERT INTO addresses (street, postal_code, city)
        VALUES (?, ?, ?)
    `,
        [street, postal_code, city]);
    return result.insertId;
}

// Modifie une adresse existante
export async function updateAddress(addressId, street, postalCode, city) {
    await pool.query(`
        UPDATE addresses
        SET street = ?, postal_code = ?, city = ?
        WHERE id = ?
    `,
        [street, postalCode, city, addressId]);
}

// retourne une adresse en fonction de son id
export async function getAddressById(id) {
    const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
    return rows[0];
}