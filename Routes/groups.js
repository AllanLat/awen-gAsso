import express from 'express'

import {
    getDayGroups,
    getGroup,
    getGroupMembers,
    updateGroupPresence,
    createGroup,
    updateGroup,
    getGroupUsers,
    addMemberToGroup,
    addUserToGroup,
    deleteMemberFromGroup,
    deleteUserFromGroup,
    deleteGroup,
    getDayGroupsCount
} from '../Querries/associations.js'

const router = express.Router()



// GET //

router.get("/day_groups", async (req, res) => {
    try {
        const association_id = 7
        // on trouve le numéro correspondant à aujourd'hui
        let actualDay = new Date().getDay();
        // si le numéro est 0 (dimanche) alors on le passe à 7 pour coller à notre bdd
        if (actualDay === 0) actualDay = 7;

        const dayGroups = await getDayGroups(association_id, actualDay);
        res.send(dayGroups);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des groupes du jour.");
    }
})

router.get("/day_groups/count", async (req, res) => {
    try {
        const association_id = 7
        // on trouve le numéro correspondant à aujourd'hui
        let actualDay = new Date().getDay();
        // si le numéro est 0 (dimanche) alors on le passe à 7 pour coller à notre bdd
        if (actualDay === 0) actualDay = 7;

        const dayGroups_count = await getDayGroupsCount(association_id, actualDay);
        res.status(200).json({ day_groups_count: dayGroups_count });
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des groupes du jour.");
    }
})

router.get("/day/:day_id", async (req, res) => {
    try {
        const association_id = 7
        const dayGroups = await getDayGroups(association_id, req.params.day_id);
        res.send(dayGroups);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des groupes de ce jour.");
    }
})

router.get("/:group_id", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        if (!group) {
            return res.status(404).send("Le groupe n'existe pas.");
        }
        res.send(group);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération du groupe.");
    }
})

router.get("/:group_id/members", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        if (!group) {
            return res.status(404).send("Le groupe n'existe pas.");
        }
        const members = await getGroupMembers(group.id);
        res.send(members);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des membres du groupe.");
    }
})

router.get("/:group_id/users", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        if (!group) {
            return res.status(404).send("Le groupe n'existe pas.");
        }
        const users = await getGroupUsers(group.id);
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la récupération des membres du groupe.");
    }
})

// POST //

router.post("/", async (req, res) => {
    try {
        const { name, group_day, members_max, start_time, end_time } = req.body;
        const association_id = 7
        const group = await createGroup(name, association_id, group_day, members_max, start_time, end_time);
        res.send(`Le groupe ${name} a été créé.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la création du groupe.");
    }
})

router.post("/:group_id/members", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        const group_name = group.name
        await req.body.members_list.forEach(member => {
            addMemberToGroup(group.id, member);
        });
        res.send(`Les membres ${req.body.members_list.join(", ")} ont été ajouté au groupe ${group_name} avec succès.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de l'ajout des membres au groupe.");
    }
})

router.post("/:group_id/users", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        const group_name = group.name
        await req.body.users_list.forEach(member => {
            addUserToGroup(group.id, member);
        });
        res.send(`Les users ${req.body.users_list.join(", ")} ont été ajouté au groupe ${group_name} avec succès.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de l'ajout des users au groupe.");
    }
})

// PUT //

router.put("/:group_id", async (req, res) => {
    try {
        const { name, group_day, members_max, start_time, end_time } = req.body;
        const id = req.params.group_id
        const group = await getGroup(req.params.group_id, 7);
        if (!group) {
            return res.status(404).send("Le groupe n'existe pas.");
        }
        const update_group = await updateGroup(id, name, group_day, members_max, start_time, end_time);
        res.send(`Le groupe avec l'id ${id} a été modifié avec succès.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la modification du groupe.");
    }
})

router.put("/:group_id/presence", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        if (!group) {
            return res.status(404).send("Le groupe n'existe pas.");
        }
        const group_name = group.name
        await updateGroupPresence(group.id, req.body.members_list);
        res.send(`Les présences du groupe ${group_name} ont été mises à jour.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de l'assignation des présences du groupe");
    }
})

// DELETE //

router.delete("/:group_id", async (req, res) => {
    try {
        const id = req.params.group_id
        const group = await deleteGroup(id);
        res.send(`Le groupe ${group.name} a été supprimé avec succès.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la suppression du groupe.");
    }
})

router.delete("/:group_id/members", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        const group_name = group.name
        await req.body.members_list.forEach(member => {
            deleteMemberFromGroup(group.id, member);
        });
        res.send(`Les membres ${req.body.members_list.join(", ")} du groupe ${group_name} ont été supprimé.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la suppression des membres du groupe.");
    }
})

router.delete("/:group_id/users", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, 7);
        const group_name = group.name
        await req.body.users_list.forEach(member => {
            deleteUserFromGroup(group.id, member);
        });
        res.send(`Les users ${req.body.users_list.join(", ")} du groupe ${group_name} ont été supprimé.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue lors de la suppression des users du groupe.");
    }
})

export default router