import express from 'express'

import { 
    getMembersByAssociationId,
    getMemberByIdAndAssociation,
    getMemberDetailsById,
    getAddressById,
} from '../../Querries/associations.js'

const router = express.Router()




router.get("/", async (req, res) => {
    const members = await getMembersByAssociationId(req.associationId);
    res.send(members);
})

router.get("/:member_id", async (req, res) => {
    const member = await getMemberByIdAndAssociation(req.params.member_id, req.associationId);
    res.send(member);
})

router.get("/:member_id/details", async (req, res) => {
    const member = await getMemberByIdAndAssociation(req.params.member_id, req.associationId);
    const member_detail = await getMemberDetailsById(member.member_details_id);
    res.send(member_detail);
})

router.get("/:member_id/address", async (req, res) => {
    const member = await getMemberByIdAndAssociation(req.params.member_id, req.associationId);
    const member_detail = await getMemberDetailsById(member.member_details_id);
    const address = await getAddressById(member_detail.address_id);
    res.send(address);
})




export default router