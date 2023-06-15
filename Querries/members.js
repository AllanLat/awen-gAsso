import pool from '../Utils/pool.js';
import { createAddress, updateAddress } from './addresses.js';



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
export async function createMember(street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, association_id, certificate, subscription, paid) {
    // Créer une nouvelle adresse
    const address = await createAddress(street, postal_code, city);

    // Créer les détails du membre en utilisant l'ID de l'adresse créée
    const memberDetails = await createMemberDetails(address, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature);

    // Créer le membre en utilisant les détails du membre créés précédemment
    const [result] = await pool.query(`
    INSERT INTO members (firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
        [firstname, lastname, file_status, payment_status, memberDetails, photo, association_id, certificate, subscription, paid]);
    return result;
}

// Modifie les détails d'un membre existant
export async function updateMemberDetails(detailsId, addressId, mail, birthday, contraindication, phoneNumber, emergencyNumber, birthplace, livingWith, imageRightsSignature) {
    await pool.query(`
        UPDATE member_details
        SET address_id = ?, mail = ?, birthday = ?, contraindication = ?, phone_number = ?, emergency_number = ?, birthplace = ?, living_with = ?, image_rights_signature = ?
        WHERE id = ?
    `,
        [addressId, mail, birthday, contraindication, phoneNumber, emergencyNumber, birthplace, livingWith, imageRightsSignature, detailsId]);
}

// Modifie un membre existant
export async function updateMember(member_id, address_id, member_details_id, street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, association_id, certificate, subscription, paid) {
    // Modifier l'adresse existante
    await updateAddress(address_id, street, postal_code, city);

    // Modifier les détails du membre existant
    await updateMemberDetails(member_details_id, address_id, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature);

    // Modifier le membre
    await pool.query(`
        UPDATE members
        SET firstname = ?, lastname = ?, file_status = ?, payment_status = ?, member_details_id = ?, photo = ?, association_id = ?, certificate = ?, subscription = ?, paid = ?
        WHERE id = ?
    `,
        [firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid, member_id]);
}

// retourne tous les membres d'une association en fonction de son id
export async function getMembers(id) {
    const [rows] = await pool.query('SELECT * FROM members WHERE association_id = ?', [id]);
    return rows;
}

//retourne le nombre de membre d'une association en fonction de son id
export async function getMembersCount(id) {
    const count = await pool.query('SELECT COUNT(*) FROM members WHERE association_id = ?', [id]);
    const members_count = count[0][0]["COUNT(*)"];
    return members_count;
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