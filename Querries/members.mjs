import e from 'express';
import pool from '../Utils/pool.mjs';
import { createAddress, updateAddress } from './addresses.mjs';



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

    // on traite les blobs s'ils sont pas null
    if (photo !== null) {
        const photoBuffer = await photo.arrayBuffer();
        const photoBytes = new Uint8Array(photoBuffer);
        photo = Buffer.from(photoBytes)
    }
    if (image_rights_signature !== null) {
        const image_rights_signatureBuffer = await image_rights_signature.arrayBuffer();
        const image_rights_signatureBytes = new Uint8Array(image_rights_signatureBuffer);
        image_rights_signature = Buffer.from(image_rights_signatureBytes)
    }
    if (certificate !== null) {
        const certificateBuffer = await signature.arrayBuffer();
        const certificateBytes = new Uint8Array(certificateBuffer);
        certificate = Buffer.from(certificateBytes)
    }

    // Créer une nouvelle adresse
    const address = await createAddress(street, postal_code, city);

    // Créer les détails du membre en utilisant l'ID de l'adresse créée
    const memberDetails = await createMemberDetails(address, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature);

    // Extraire les données binaires de l'objet Blob


    // Créer le membre en utilisant les détails du membre créés précédemment
    const [result] = await pool.query(`
    INSERT INTO members (firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`,
        [firstname, lastname, file_status, payment_status, memberDetails, photo, association_id, certificate, subscription, paid]);
    return result;
}

// Modifie les détails d'un membre existant
export async function updateMemberDetails(detailsId, addressId, mail, birthday, contraindication, phoneNumber, emergencyNumber, birthplace, livingWith, image_rights_signature) {
    if (image_rights_signature === null) {
        await pool.query(`
        UPDATE member_details
        SET address_id = ?, mail = ?, birthday = ?, contraindication = ?, phone_number = ?, emergency_number = ?, birthplace = ?, living_with = ?
        WHERE id = ?
    `,
            [addressId, mail, birthday, contraindication, phoneNumber, emergencyNumber, birthplace, livingWith, detailsId]);
    } else {
        await pool.query(`
        UPDATE member_details
        SET address_id = ?, mail = ?, birthday = ?, contraindication = ?, phone_number = ?, emergency_number = ?, birthplace = ?, living_with = ?, image_rights_signature = ?
        WHERE id = ?
    `,
            [addressId, mail, birthday, contraindication, phoneNumber, emergencyNumber, birthplace, livingWith, image_rights_signature, detailsId]);
    }
}

// Modifie un membre existant
export async function updateMember(member_id, address_id, member_details_id, street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, association_id, certificate, subscription, paid) {
    // on traite les blobs s'ils sont pas null
    if (photo !== null) {
        const photoBuffer = await photo.arrayBuffer();
        const photoBytes = new Uint8Array(photoBuffer);
        photo = Buffer.from(photoBytes)
    }
    if (image_rights_signature !== null) {
        // Devien le certificate medicale
        const image_rights_signatureBuffer = await image_rights_signature.arrayBuffer();
        const image_rights_signatureBytes = new Uint8Array(image_rights_signatureBuffer);
        image_rights_signature = Buffer.from(image_rights_signatureBytes)
    }
    if (certificate !== null) {
        const certificateBuffer = await signature.arrayBuffer();
        const certificateBytes = new Uint8Array(certificateBuffer);
        certificate = Buffer.from(certificateBytes)
    }
    // Modifier l'adresse existante
    await updateAddress(address_id, street, postal_code, city);

    // Modifier les détails du membre existant
    await updateMemberDetails(member_details_id, address_id, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature);

    // Modifier le membre
    if (photo === null) {
        await pool.query(`
        UPDATE members
        SET firstname = ?, lastname = ?, file_status = ?, payment_status = ?, member_details_id = ?, association_id = ?, certificate = ?, subscription = ?, paid = paid + ?
        WHERE id = ?
    `,
            [firstname, lastname, file_status, payment_status, member_details_id, association_id, certificate, subscription, paid, member_id]);
    } else {
        await pool.query(`
        UPDATE members
        SET firstname = ?, lastname = ?, file_status = ?, payment_status = ?, member_details_id = ?, photo = ?, association_id = ?, certificate = ?, subscription = ?, paid = paid + ?
        WHERE id = ?
    `,
            [firstname, lastname, file_status, payment_status, member_details_id, photo, association_id, certificate, subscription, paid, member_id]);
    }

}

// retourne tous les membres d'une association en fonction de son id
export async function getMembers(id) {
    const [rows] = await pool.query('SELECT * FROM members WHERE association_id = ?', [id]);

    // Parcourir les lignes et convertir les photos en base64
    const rowsWithBase64Images = rows.map(row => {
        // Si photo existe, la convertir en base64
        if (row.photo) {
            let base64Image = row.photo.toString('base64');

            if (row.certificate) {
                base64ImageCertificate = row.certificate.toString('base64');

                return {
                    ...row,
                    photo: base64Image,
                    certificate: base64ImageCertificate
                }
            }
            else {
                 return {
                ...row,
                photo: base64Image
            };
            }
           
        }
        // Sinon, renvoyer la ligne sans modification
        else {
            return row;
        }
    });

    return rowsWithBase64Images;
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

    // Si aucun membre n'est trouvé, renvoyer null ou undefined
    if (rows.length === 0) {
        return null;
    }

    // Sinon, obtenir le premier membre
    let member = rows[0];

    if (member.photo) {
        let base64Image = member.photo.toString('base64');

        if (member.certificate) {
            base64ImageCertificate = member.certificate.toString('base64');

            return {
                ...member,
                photo: base64Image,
                certificate: base64ImageCertificate
            }
        }
        else {
             return {
            ...member,
            photo: base64Image
        };
        }
       
    }
    // Sinon, renvoyer la ligne sans modification
    else {
        return member;
    }
}


// retourne les détails d'un membre en fonction de son id
export async function getMemberDetailsById(id) {
    const [rows] = await pool.query('SELECT * FROM member_details WHERE id = ?', [id]);
    return rows[0];
}