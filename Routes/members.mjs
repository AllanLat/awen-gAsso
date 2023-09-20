import express from 'express'
import {
    getMembers,
    getMemberById,
    getMemberDetailsById,
    createMember,
    updateMember,
    getMembersCount
} from '../Querries/members.mjs'

import { transformFilesToBlobs } from '../Utils/functions.mjs'

import { getAddressById } from '../Querries/addresses.mjs'

const router = express.Router()

// GET //
router.get("/", async (req, res) => {
    try {
        const members = await getMembers(req.auth.associationId);
        res.json(members);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des membres.");
    }
});

router.get("/count", async (req, res) => {
    try {
        const members = await getMembersCount(req.auth.associationId);
        res.status(200).json({ members_count: members });
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des membres.");
    }
})

router.get("/:member_id", async (req, res) => {
    try {
        const member = await getMemberById(req.params.member_id, req.auth.associationId);
        if (!member) {
            return res.status(404).json("Le membre n'existe pas.");
        }
        const member_detail = await getMemberDetailsById(member.member_details_id);
        const address = await getAddressById(member_detail.address_id);

        member.member_detail = member_detail;
        member.address = address;

        res.json(member);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des informations du membre.");
    }
});


// POST // 

router.post("/", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }

    try {

        // on choppe les données simples

        const dataString = req.body.data
        const data = JSON.parse(dataString)

        // on choppe les fichiers

        const files = req.files;
        //console.log(files);

        // on les transforme en objet avec 1 blob par fichier ou vide si pas de fichier

        const blobFiles = transformFilesToBlobs(files);

        // on attribue le blob ou null aux variables photo et image_rights signature

        const photo = blobFiles.photo ? blobFiles.photo[0] : null;
        const image_rights_signature = blobFiles.image_rights_signature ? blobFiles.image_rights_signature[0] : null;
        const certificate = blobFiles.certificate ? blobFiles.certificate[0] : null;
        const rib = blobFiles.rib ? blobFiles.rib[0] : null;

        // Créer le membre avec toutes les informations
        const member = await createMember(data.street, data.postal_code, data.city, data.mail, data.birthday, data.contraindication, data.phone_number, data.emergency_number, data.birthplace, data.living_with, image_rights_signature, data.firstname, data.lastname, data.file_status, data.payment_status, photo, req.auth.associationId, certificate, data.subscription, data.paid, rib);

        res.status(201).json(member);

    } catch (error) {

        console.log(error)
    }
});

// PUT //

router.put("/:member_id", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }

    // on choppe les données simples

    const dataString = req.body.data
    const data = JSON.parse(dataString)

    // on choppe les fichiers

    const files = req.files;


    // on les transforme en objet avec 1 blob par fichier ou vide si pas de fichier

    const blobFiles = transformFilesToBlobs(files);

    // on attribue le blob ou null aux variables photo et image_rights signature

    const photo = blobFiles.photo ? blobFiles.photo[0] : null;
    const image_rights_signature = blobFiles.image_rights_signature ? blobFiles.image_rights_signature[0] : null;
    const certificate = blobFiles.certificate_medical ? blobFiles.certificate_medical[0] : null;

    const member = await getMemberById(req.params.member_id, req.auth.associationId);


    if (!member) {
        res.status(404).json("Le membre n'existe pas.");
        return;
    } else {
        const member_details_id = member.member_details_id;
        const member_details = await getMemberDetailsById(member_details_id);
        const address_id = member_details.address_id;
        try {
            const updatedMember = updateMember(member.id, address_id, member_details_id, data.street, data.postal_code, data.city, data.mail, data.birthday, data.contraindication, data.phone_number, data.emergency_number, data.birthplace, data.living_with, image_rights_signature, data.firstname, data.lastname, data.file_status, data.payment_status, photo, req.auth.associationId, data.certificate, data.subscription, data.paid, data.certificate_medical)

            res.status(200).json(updatedMember);

        } catch (error) {
            console.log(error);
            res.status(500).json("Une erreur est survenue lors de la mise à jour des informations du membre.");
        }
    }
});




export default router