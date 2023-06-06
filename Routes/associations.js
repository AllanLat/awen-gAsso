import express from 'express'
import { getAssociations, getAssociation, createAssociation, updateAssociation, deleteAssociation, getUsersByAssociationId, getDayGroupsByAssociationId } from '../Querries/associations.js'

const router = express.Router()

router.get("/", async (req, res) => {
    const associations = await getAssociations();
    res.send(associations);
})

router.get("/:id", async (req, res) => {
    const association = await getAssociation(req.params.id);
    res.send(association);
})

router.post("/", async (req, res) => {
    const {name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color} = req.body;
    const association = await createAssociation(name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color);
    res.status(201).send(association);
})

router.put("/:id", async (req, res) => {
    const {name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color} = req.body;
    const association = await updateAssociation(req.params.id, name, mail, members_max, members_count, address_id, logo, primary_light_color, secondary_light_color, primary_dark_color, secondary_dark_color);
    res.status(201).send(association);
})

router.delete("/:id", async (req, res) => {
    const association = await deleteAssociation(req.params.id);
    res.status(200).send(association);
})

router.get("/:id/users", async (req, res) => {
    const users = await getUsersByAssociationId(req.params.id);
    res.send(users);
})

router.get("/:id/day_groups", async (req, res) => {
    const dayGroups = await getDayGroupsByAssociationId(req.params.id);
    res.send(dayGroups);
})

export default router