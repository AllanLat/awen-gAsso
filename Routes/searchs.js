import express from 'express'
import { 
    getMembersByLastname
} from '../Querries/searchs.js'

const router = express.Router()

//endpoint de recherche de membres en fonction d'une partie de leur lastname
router.get("/members", async (req, res) => {
    console.log(req.auth.associationId)
    const { lastname } = req.query; 
    const association_id = req.auth.associationId; // on récupère ici l'id de l'association
    const filteredMembers = await getMembersByLastname(lastname, association_id);
    res.send(filteredMembers);
})



export default router