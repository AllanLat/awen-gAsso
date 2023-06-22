import express from 'express'
import { getUsers, getUser, createUser, getUserByLogin, updateUser, getGroups } from '../Querries/users.js'
import bcrypt from 'bcrypt'

const router = express.Router()

// GET //

router.get("/", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const users = await getUsers(req.auth.associationId);
        res.status(200).json(users);
    } catch (error) {

        res.status(500).json("Une erreur est survenue.");
    }
})

router.get("/:user_id", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    const user_id = req.params.user_id
    try {
        const user = await getUser(user_id, req.auth.associationId);
        if (!user) {
            res.status(404).json("Le user n'existe pas.")
        }
        res.status(200).json(user);
    } catch (error) {

        res.status(500).json("Une erreur est survenue.");
    }
})

router.get("/:user_id/groups", async (req, res) => {

    if (req.auth.userLvl < 1 && parseInt(req.params.user_id) !== req.auth.userId) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }

    const user_id = req.params.user_id
    const user = await getUser(user_id, req.auth.associationId)

    if (!user) {
        res.status(404).json("Le user n'existe pas.")
    } else {
        try {
            const groups = await getGroups(user_id);
            res.status(200).json(groups);
        } catch (error) {

            res.status(500).json("Une erreur est survenue.");
        }
    }
})

// POST //
router.post("/", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    const { firstname, lastname, mail, login, password, phone_number } = req.body
    try {
        const existingUser = await getUserByLogin(login);
        if (existingUser) {
            return res.status(409).json("Un utilisateur existe déjà avec ce login.");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(req.auth.associationId, firstname, lastname, mail, login, hashedPassword, phone_number);
        res.status(201).json(`Le user ${firstname} ${lastname} a bien été créé.`);
    } catch (error) {
        res.status(500).json("Une erreur est survenue.");
    }
})


// PUT //
router.put("/:user_id", async (req, res) => {
    // Autorise l'admin et le user concerné à changer ses infos
    if (req.auth.userLvl < 1) {
        if (parseInt(req.params.user_id) !== req.auth.userId) {
            return res.status(403).json("Vous n'avez pas les droits d'accès.");
        }
    }

    const user_id = req.params.user_id
    const existingUser = await getUser(user_id, req.auth.associationId)
    if (!existingUser) {
        return res.status(404).json("Le membre n'existe pas.")
    }

    try {

        const { firstname, lastname, mail, password, phone_number } = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated_user = await updateUser(user_id, firstname, lastname, mail, hashedPassword, phone_number);
        res.status(200).json(`Le user ${firstname} ${lastname} a bien été modifié.`);
    } catch (error) {

        res.status(500).json("Une erreur est survenue lors de la modification du membre.");
    }

})

export default router