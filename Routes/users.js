import express from 'express'
import { getUsers, getUser, createUser, updateUser, getGroups } from '../Querries/users.js'

const router = express.Router()

// GET //

router.get("/", async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des membres.");
    }
})

router.get("/:user_id", async (req, res) => {
    const user_id = req.params.user_id
    try {
        const user = await getUser(user_id);
        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des informations du membre.");
    }
})

router.get("/:user_id/groups", async (req, res) => {
    const user_id = req.params.user_id
    const user = await getUser(user_id)
    if (!user) {
        res.status(404).send("Le membre n'existe pas.")
    } else {
        try {
            const groups = await getGroups(user_id);
            res.status(200).send(groups);
        } catch (error) {
            console.error(error);
            res.status(500).send("Une erreur est survenue lors de la récupération des informations du membre.");
        }
    }
})

// POST //
router.post("/", async (req, res) => {
    const { firstname, lastname, mail, login, password, phone_number } = req.body
    try {
        const user = await createUser(firstname, lastname, mail, login, password, phone_number);
        res.status(201).send(`Le user ${firstname} ${lastname} a bien été créé.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la création du membre.");
    }
})

// PUT //
router.put("/:user_id", async (req, res) => {
    const user_id = req.params.user_id
    const user = await getUser(user_id)
    if (!user) {
        res.status(404).send("Le membre n'existe pas.")
    } else {
        try {
            const { firstname, lastname, mail, login, password, phone_number } = req.body
            const updated_user = await updateUser(user_id, firstname, lastname, mail, login, password, phone_number);
            res.status(200).send(`Le user ${firstname} ${lastname} a bien été modifié.`);
        } catch (error) {
            console.error(error);
            res.status(500).send("Une erreur est survenue lors de la modification du membre.");
        }
    }
})

export default router