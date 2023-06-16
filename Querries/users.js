import pool from '../Utils/pool.js';

const association_id = 7

// retourne tous les users d'une association
export async function getUsers() {
    const [rows] = await pool.query('SELECT * FROM users WHERE association_id = ?', [association_id]);
    return rows;
}

// retourne un user en fonction de son id
export async function getUser(id, association) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ? AND association_id = ?', [id, association]);
    return rows[0];
}

// retourne un user en fonction de son login
export async function getUserByLogin(login) {
    const [rows] = await pool.query('SELECT * FROM users WHERE login = ?', [login]);
    return rows[0];
}

// ajoute un user 
export async function createUser(firstname, lastname, mail, login, password, phone_number) {
    const [result] = await pool.query(`
        INSERT INTO users (association_id, firstname, lastname, mail, login, password, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [association_id, firstname, lastname, mail, login, password, phone_number]);
}

// modifie un user
export async function updateUser(id, firstname, lastname, mail, login, password, phone_number) {
    const [result] = await pool.query(`
        UPDATE users
        SET firstname = ?, lastname = ?, mail = ?, login = ?, password = ?, phone_number = ?
        WHERE id = ?
    `, [firstname, lastname, mail, login, password, phone_number, id]);
}

// retourne tous les groupes d'un user 
export async function getGroups(user_id) {
    const [rows] = await pool.query(
        'SELECT `groups`.* FROM `groups` JOIN users_groups ON groups.id = users_groups.group_id WHERE users_groups.user_id = ?',
        [user_id]
    );
    return rows;
}

/* 'SELECT members.* FROM members JOIN members_groups ON members.id = members_groups.member_id WHERE members_groups.group_id = ?', */