import pool from '../Utils/pool.js';

import {
    createMember,
    updateMember,
    getMembers,
    getMemberById,
    getMemberDetailsById
} from './members.js';

import {
    getDayGroups,
    getGroup,
    getGroupMembers,
    getGroupUsers,
    addMemberToGroup,
    addUserToGroup,
    deleteMemberFromGroup,
    deleteUserFromGroup,
    deleteGroup,
    updateGroup,
    createGroup,
    updateGroupPresence
} from './groups.js';

import {
    getMembersByLastname
} from './searchs.js';

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






























export {
    createMember,
    updateMember,
    getMembers,
    getMemberById,
    getMemberDetailsById,
    getDayGroups,
    getGroup,
    getGroupMembers,
    getGroupUsers,
    addMemberToGroup,
    addUserToGroup,
    deleteMemberFromGroup,
    deleteUserFromGroup,
    deleteGroup,
    updateGroup,
    createGroup,
    updateGroupPresence,
    getMembersByLastname
}