import express from 'express'

import {
    getDayGroups
} from '../../Querries/Associations/associations.js'

const router = express.Router()

router.get("/day_groups", async (req, res) => {
    const association_id = req.associationId
    const dayGroups = await getDayGroups(association_id);
    res.send(dayGroups);
})

export default router