import express from 'express'

import {
    getMembers,
    getMemberById,
    getMemberDetailsById,
    createMember,
    updateMember,
    getAssociation,
} from '../Querries/associations.js'

import {
    getAddressById,
} from '../Querries/addresses.js'

const router = express.Router()


// GET //
router.get("/", async (req, res) => {
    try {
        const members = await getMembers(req.associationId);
        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des membres.");
    }
});

router.get("/:member_id", async (req, res) => {
    try {
        const member = await getMemberById(req.params.member_id, req.associationId);
        const member_detail = await getMemberDetailsById(member.member_details_id);
        const address = await getAddressById(member_detail.address_id);

        member.member_detail = member_detail;
        member.address = address;

        res.send(member);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des informations du membre.");
    }
});






// POST // 

router.post("/", async (req, res) => {
    try {
        const { street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, certificate, subscription, paid } = req.body;

        // Créer le membre avec toutes les informations
        const member = await createMember(street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, req.associationId, certificate, subscription, paid);


        const new_member = firstname + " " + lastname;
        const association = await getAssociation(req.associationId);
        const association_name = association.name;


        res.status(201).send(`Le membre ${new_member} a bien été ajouté à l'association ${association_name}.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la création du membre.");
    }
});

// PUT //

router.put("/:member_id", async (req, res) => {
    try {
        const { street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, certificate, subscription, paid } = req.body;
        const { member_id } = req.params;

        const address = await getAddressById(req.associationId);
        const address_id = address.id;
        const member_details =  await getMemberDetailsById(member_id, req.associationId); 
        const member_details_id = member_details.id;



        // Mettre à jour les informations du membre
        await updateMember(member_id, address_id, member_details_id, street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, req.associationId, certificate, subscription, paid);

        res.status(200).send(`Les informations du membre avec l'ID ${member_id} ont été mises à jour.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la mise à jour des informations du membre.");
    }
});




export default router