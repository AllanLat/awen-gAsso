import pool from '../Utils/pool.js';

// retourne tous les groupes d'un jour (ou 0 = lundi, 1 = mardi, ...) en fonction de son id
export async function getDayGroups(association_id, day) {
    const [rows] = await pool.query('SELECT * FROM `groups` WHERE association_id = ? AND group_day = ?', [association_id, day]);
    return rows;
}

// retourne le nombre de groupes du jour
export async function getDayGroupsCount(association_id, day) {
    const count = await pool.query('SELECT COUNT(*) FROM `groups` WHERE association_id = ? AND group_day = ?', [association_id, day]);
    return count[0][0]["COUNT(*)"];
}

// retourne un groupe en fonction de son id 
export async function getGroup(group_id, association_id) {
    const [rows] = await pool.query('SELECT * FROM `groups` WHERE id = ? AND association_id = ?' , [group_id, association_id]);
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

// Retourne tous les users d'un groupe en fonction de son ID
export async function getGroupUsers(group_id) {
    const [rows] = await pool.query(
        'SELECT users.* FROM users JOIN users_groups ON users.id = users_groups.user_id WHERE users_groups.group_id = ?',
        [group_id]
    );
    return rows;
}

// ajoute un membre à un groupe en fonction de son ID
export async function addMemberToGroup(group_id, member_id) {
    const [result] = await pool.query(
        'INSERT INTO members_groups (group_id, member_id) VALUES (?, ?)',
        [group_id, member_id]
    );
}

// ajoute un user à un groupe en fonction de son ID
export async function addUserToGroup(group_id, user_id) {
    const [result] = await pool.query(
        'INSERT INTO users_groups (group_id, user_id) VALUES (?, ?)',
        [group_id, user_id]
    );
}

// supprime un member d'un groupe en fonction de son ID
export async function deleteMemberFromGroup(group_id, member_id) {
    const [result] = await pool.query(
        'DELETE FROM members_groups WHERE group_id = ? AND member_id = ?',
        [group_id, member_id]
    );
}

// supprime un user d'un groupe en fonction de son ID
export async function deleteUserFromGroup(group_id, user_id) {
    // vérifie si la paire existe dans users_groups
    const [result] = await pool.query(
        'DELETE FROM users_groups WHERE group_id = ? AND user_id = ?',
        [group_id, user_id]
    );
}

// supprime un groupe en fonction de son ID en supprimant ses paires associées avant dans users_groups et members_groups
export async function deleteGroup(group_id) {

    // A VOIR SI ON VEUT GARDER LES PRESENCES DANS LA PAIRE MEMBERS_GROUPS
    // supprime les paires associées avant dans users_groups et members_groups
    const [result] = await pool.query(
        'DELETE FROM users_groups WHERE group_id = ?',
        [group_id]
    )
    const [result2] = await pool.query(
        'DELETE FROM members_groups WHERE group_id = ?',
        [group_id]
    )
    // supprime le groupe
    const [result3] = await pool.query(
        'DELETE FROM groups WHERE id = ?',
        [group_id]
    )

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
    return result
}

// modifie un groupe
export async function updateGroup(id, name, group_day, members_max, start_time, end_time) {
    const [result] = await pool.query("UPDATE `groups` SET name = ?, group_day = ?, members_max = ?, start_time = ?, end_time = ? WHERE id = ?",
        [name, group_day, members_max, start_time, end_time, id]);
    return getGroup(id);
}

