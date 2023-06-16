import express from 'express'

import {
    getMembers,
    getMemberById,
    getMemberDetailsById,
    createMember,
    updateMember,
    getMembersCount
} from '../Querries/members.js'

import { getAddressById } from '../Querries/addresses.js'

const router = express.Router()


// GET //
router.get("/", async (req, res) => {
    try {
        const members = await getMembers(7);
        res.send(members);
    } catch (error) {
        
        res.status(500).send("Une erreur est survenue lors de la récupération des membres.");
    }
});

router.get("/count", async (req, res) => {
    try {
        const members = await getMembersCount(7);
        res.status(200).json({ members_count: members });
    } catch (error) {
        
        res.status(500).send("Une erreur est survenue lors de la récupération des membres.");
    }
})

router.get("/:member_id", async (req, res) => {
    try {
        const member = await getMemberById(req.params.member_id, 7);
        const member_detail = await getMemberDetailsById(member.member_details_id);
        const address = await getAddressById(member_detail.address_id);

        member.member_detail = member_detail;
        member.address = address;

        res.send(member);
    } catch (error) {
        
        res.status(500).send("Une erreur est survenue lors de la récupération des informations du membre.");
    }
});






// POST // 

router.post("/", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).send("Vous n'avez pas les droits d'accès.");
    }
    try {
        const { street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, certificate, subscription, paid } = req.body;

        // Créer le membre avec toutes les informations
        const member = await createMember(street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, 7, certificate, subscription, paid);





        res.status(201).send(`Le membre ${firstname} ${lastname} a bien été ajouté à l'association.`);
    } catch (error) {
        
        res.status(500).send("Une erreur est survenue lors de la création du membre.");
    }
});

// PUT //

router.put("/:member_id", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).send("Vous n'avez pas les droits d'accès.");
    }
    const member = await getMemberById(req.params.member_id, 7);
    console.log(member)
    if (!member) {
        res.status(404).send("Le membre n'existe pas.");
        return;
    } else {
        try {
            const { street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, certificate, subscription, paid } = req.body;
            const { member_id } = req.params;

            const address = await getAddressById(7);
            const address_id = address.id;
            const member_details = await getMemberDetailsById(member_id, 7);
            const member_details_id = member_details.id;



            // Mettre à jour les informations du membre
            await updateMember(member_id, address_id, member_details_id, street, postal_code, city, mail, birthday, contraindication, phone_number, emergency_number, birthplace, living_with, image_rights_signature, firstname, lastname, file_status, payment_status, photo, 7, certificate, subscription, paid);

            res.status(200).send(`Les informations du membre avec l'ID ${member_id} ont été mises à jour.`);
        } catch (error) {
            
            res.status(500).send("Une erreur est survenue lors de la mise à jour des informations du membre.");
        }
    }
});




export default router