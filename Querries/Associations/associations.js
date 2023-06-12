import pool from '../../Utils/pool.js';

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
export async function getUsers(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE association_id = ?', [id]);
    return rows;
}

// retourne tous les groupes d'un jour (ou 0 = lundi, 1 = mardi, ...) en fonction de son id
export async function getDayGroups(association_id, day) {
    const [rows] = await pool.query('SELECT * FROM `groups` WHERE association_id = ? AND group_day = ?', [association_id, day]);
    return rows;
}

// retourne un groupe en fonction de son id 
export async function getGroup(group_id) {
    const [rows] = await pool.query('SELECT * FROM `groups` WHERE id = ?', [group_id]);
    return rows[0];
}

// Retourne tous les membres d'un groupe en fonction de son ID
export async function getGroupMembers(group_id) {
    const [rows] = await pool.query(
        'SELECT members.* FROM members JOIN members_groups ON members.id = members_groups.member_id WHERE members_groups.group_id = ?',
        [group_id]
    );
    return rows;
}

// ajoute 1 à presence_count de la table members_groups pour chaque membre d'un tableau de membres
export async function updateGroupPresence(group_id, membersList) {
    const [result] = await pool.query(
        'UPDATE members_groups SET presence_count = presence_count + 1 WHERE group_id = ? AND member_id IN (?)',
        [group_id, membersList]
    );
}

// ajoute un groupe 
export async function createGroup(name, association_id, group_day, members_max, start_time, end_time) {
    const [result] = await pool.query("INSERT INTO `groups` (name, association_id, group_day, members_max, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)",
        [name, association_id, group_day, members_max, start_time, end_time]);
    return getGroup(result.insertId);
}

// modifie un groupe
export async function updateGroup(id, name, association_id, group_day, members_max, start_time, end_time) {
    const [result] = await pool.query("UPDATE `groups` SET name = ?, association_id = ?, group_day = ?, members_max = ?, start_time = ?, end_time = ? WHERE id = ?",
        [name, association_id, group_day, members_max, start_time, end_time, id]);
    return getGroup(id);
}

// retourne tous les membres d'une association en fonction de son id
export async function getMembers(id) {
    const [rows] = await pool.query('SELECT * FROM members WHERE association_id = ?', [id]);
    return rows;
}

// retourne le membre en fonction de son id et de son association
export async function getMemberById(member_id, association_id) {
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

// ajoute une adresse 
export async function createAddress(street, postal_code, city) {
    const [result] = await pool.query(`
        INSERT INTO addresses (street, postal_code, city)
        VALUES (?, ?, ?)
    `,
        [street, postal_code, city]);
    return result.insertId;
}

// ajoute les détails d'un membre 
export async function createMemberDetails(address_id, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature) {
    const [result] = await pool.query(`
        INSERT INTO member_details (address_id, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [address_id, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature]);
    return result.insertId;
}

// ajoute un membre
export async function createMember(firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid) {
    const [result] = await pool.query(`
        INSERT INTO members (firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid]);
    return getMemberById(result.insertId, association_id);
}