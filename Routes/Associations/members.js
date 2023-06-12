import express from 'express'

import {
    getMembers,
    getMemberById,
    getMemberDetailsById,
    getAddressById,
    createAddress,
    createMemberDetails,
    createMember
} from '../../Querries/Associations/associations.js'

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
        res.send(member);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération du membre.");
    }
});

router.get("/:member_id/details", async (req, res) => {
    try {
        const member = await getMemberById(req.params.member_id, req.associationId);
        const member_detail = await getMemberDetailsById(member.member_details_id);
        res.send(member_detail);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des détails du membre.");
    }
});

router.get("/:member_id/address", async (req, res) => {
    try {
        const member = await getMemberById(req.params.member_id, req.associationId);
        const member_detail = await getMemberDetailsById(member.member_details_id);
        const address = await getAddressById(member_detail.address_id);
        res.send(address);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération de l'adresse du membre.");
    }
});


// POST // 

router.post("/", async (req, res) => {
    try {
        const { street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, certificate, subscription, paid } = req.body;

        // Créer une nouvelle adresse
        const address = await createAddress(street, postal_code, city);
        
        // Créer les détails du membre en utilisant l'ID de l'adresse créée
        const memberDetails = await createMemberDetails(address, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature);

        // Créer le membre en utilisant les détails du membre créés précédemment
        const member = await createMember(firstname, lastname, file_status, payment_status, memberDetails, photo, req.associationId, certificate, subscription, paid);

        res.status(201).send(member);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la création du membre.");
    }
});



export default router