import express from 'express'
import {
    getAssociations,
    getAssociation,
    createAssociation,
    updateAssociation,
    deleteAssociation,
} from '../Querries/associations.js'

const router = express.Router()

// Endpoints pour le super admin //
router.get("/", async (req, res) => {
    try {
        const associations = await getAssociations();
        res.send(associations);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des associations.");
    }
})

router.get("/:id", async (req, res) => {
    try {
        const association = await getAssociation(req.params.id);
        res.send(association);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération de l'association.");
    }
})

router.post("/", async (req, res) => {
    try {
        const { name, mail, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color } = req.body;
        const association = await createAssociation(name, mail, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color);
        res.status(201).send(association);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la création de l'association.");
    }
})

router.put("/:id", async (req, res) => {
    try {
        const { name, mail, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color } = req.body;
        const association = await updateAssociation(req.params.id, name, mail, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color);
        res.status(201).send(association);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la modification de l'association.");
    }
})







export default router

// A VOIR SELON ULTILITE

/* router.delete("/:id", async (req, res) => {
    const association = await deleteAssociation(req.params.id);
    res.status(200).send(association);
}) */