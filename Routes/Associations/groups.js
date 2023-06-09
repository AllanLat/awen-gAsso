import express from 'express'

import {
    getDayGroupsByAssociationId
} from '../../Querries/Associations/associations.js'

const router = express.Router()

router.get("/day_groups", async (req, res) => {
    const association_id = req.associationId
    const dayGroups = await getDayGroupsByAssociationId(association_id);
    res.send(dayGroups);
})

export default router