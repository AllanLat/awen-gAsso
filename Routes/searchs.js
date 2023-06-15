import express from 'express'
import { 
    getMembersByLastname
} from '../Querries/associations.js'

const router = express.Router()



//endpoint de recherche de membres en fonction d'une partie de leur lastname
router.get("/members", async (req, res) => {
    const { lastname } = req.query; 
    const association_id = 7; // on récupère ici l'id de l'association
    const filteredMembers = await getMembersByLastname(lastname, association_id);
    res.send(filteredMembers);
})



export default router