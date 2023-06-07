import express from 'express'
import { 
    getAssociations, 
    getAssociation, 
    createAssociation, 
    updateAssociation, 
    deleteAssociation, 
    getUsersByAssociationId, 
    getDayGroupsByAssociationId, 
    getMembersByAssociationId, 
    getMemberByIdAndAssociation,
    getMemberDetailsById,
    getAddressById,
    getMembersByLastname
} from '../Querries/associations.js'

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

router.get("/:id/users", async (req, res) => {
    const users = await getUsersByAssociationId(req.params.id);
    res.send(users);
})

router.get("/:id/day_groups", async (req, res) => {
    const dayGroups = await getDayGroupsByAssociationId(req.params.id);
    res.send(dayGroups);
})

router.get("/:id/members", async (req, res) => {
    const members = await getMembersByAssociationId(req.params.id);
    res.send(members);
})

router.get("/:id/members/:member_id", async (req, res) => {
    const member = await getMemberByIdAndAssociation(req.params.member_id, req.params.id);
    res.send(member);
})

router.get("/:id/members/:member_id/details", async (req, res) => {
    const member = await getMemberByIdAndAssociation(req.params.member_id, req.params.id);
    const member_detail = await getMemberDetailsById(member.member_details_id);
    res.send(member_detail);
})

router.get("/:id/members/:member_id/address", async (req, res) => {
    const member = await getMemberByIdAndAssociation(req.params.member_id, req.params.id);
    const member_detail = await getMemberDetailsById(member.member_details_id);
    const address = await getAddressById(member_detail.address_id);
    res.send(address);
})

//endpoint de recherche de membres en fonction d'une partie de leur lastname
router.get("/:id/search/members", async (req, res) => {
    const { lastname } = req.query; 
    const association_id = req.params.id;
    console.log(association_id);
    const filteredMembers = await getMembersByLastname(lastname, association_id);
    res.send(filteredMembers);
})



export default router




// A VOIR SELON ULTILITE

/* router.delete("/:id", async (req, res) => {
    const association = await deleteAssociation(req.params.id);
    res.status(200).send(association);
}) */