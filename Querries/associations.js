import pool from '../Utils/pool.js';

// retourne toutes les associations sous forme d'objets dans un tabeau
export async function getAssociations() {
    const [rows] = await pool.query('SELECT * FROM associations');
    return rows;
}

// retourne une association sous forme d'objet en fonction de son id
export async function getAssociation(id) {
    const [rows] = await pool.query('SELECT * FROM associations WHERE id = ?', [id]);
    return rows[0];
}

// ajoute une association
export async function createAssociation(name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color) {
    const [result] = await pool.query(`
        INSERT INTO associations (name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color]);

    // on retourne la nouvelle association grâce à son id
    const id = result.insertId;
    return getAssociation(id);
}

// modifie une association en fonction de son id
export async function updateAssociation(id, name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color) {
    const [result] = await pool.query(`
        UPDATE associations
        SET name = ?, mail = ?, members_max = ?, members_count = ?, address_id = ?, logo = ?, primary_light_color = ?, secondary_light_color = ?, primary_dark_color = ?, secondary_dark_color = ?
        WHERE id = ?
    `,
        [name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color, id]);
    return getAssociation(id);
}

// supprime une association en fonction de son id
export async function deleteAssociation(id) {
    const [result] = await pool.query(`
        DELETE FROM associations
        WHERE id = ?
    `, [id]);
}

// retourne tous les users d'une association en fonction de son id 
export async function getUsersByAssociationId(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE association_id = ?', [id]);
    return rows;
}

// retourne tous les groupes du jour (ou 0 = lundi, 1 = mardi, ...) d'une association en fonction de son id
export async function getDayGroupsByAssociationId(id) {
    // on trouve le numéro correspondant à aujourd'hui
    let actualDay = new Date().getDay();
    // si le numéro est 0 (dimanche) alors on le passe à 7 pour coller à notre bdd
    if (actualDay === 0) actualDay = 7;

    const [rows] = await pool.query('SELECT * FROM `groups` WHERE association_id = ? AND group_day = ?', [id, actualDay]);
    return rows;
}

// retourne tous les membres d'une association en fonction de son id
export async function getMembersByAssociationId(id) {
    const [rows] = await pool.query('SELECT * FROM members WHERE association_id = ?', [id]);
    return rows;
}

// retourne le membre en fonction de son id et de son association
export async function getMemberByIdAndAssociation(member_id, association_id) {
    const [rows] = await pool.query('SELECT * FROM members WHERE id = ? AND association_id = ?', [member_id, association_id]);
    return rows[0];
}

// retourne les détails d'un membre en fonction de son id
export async function getMemberDetailsById(id) {
    const [rows] = await pool.query('SELECT * FROM member_details WHERE id = ?', [id]);
    return rows[0];
}

// retourne une adresse en fonction de son id
export async function getAddressById(id) {
    const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [id]);
    return rows[0];
}

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
