import express from 'express'

import {
    getDayGroups,
    getGroup,
    getGroups,
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
    getDayGroupsCount,
    addPresenceList
} from '../Querries/groups.mjs'

import { getMemberById } from '../Querries/members.mjs'
import { getUser } from '../Querries/users.mjs'

const router = express.Router()



// GET //

router.get("/day_groups", async (req, res) => {
    try {
        const association_id = req.auth.associationId
        // on trouve le numéro correspondant à aujourd'hui
        let actualDay = new Date().getDay();
        // si le numéro est 0 (dimanche) alors on le passe à 7 pour coller à notre bdd
        if (actualDay === 0) actualDay = 7;

        const dayGroups = await getDayGroups(association_id, actualDay);
        res.json(dayGroups);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des groupes du jour.");
    }
})

router.get("/day_groups/count", async (req, res) => {
    try {
        const association_id = req.auth.associationId
        // on trouve le numéro correspondant à aujourd'hui
        let actualDay = new Date().getDay();
        // si le numéro est 0 (dimanche) alors on le passe à 7 pour coller à notre bdd
        if (actualDay === 0) actualDay = 7;

        const dayGroups_count = await getDayGroupsCount(association_id, actualDay);
        res.status(200).json({ day_groups_count: dayGroups_count });
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des groupes du jour.");
    }
})

router.get("/day/:day_id", async (req, res) => {
    try {
        const association_id = req.auth.associationId
        const dayGroups = await getDayGroups(association_id, req.params.day_id);
        res.json(dayGroups);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des groupes de ce jour.");
    }
})

router.get("/:group_id", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }
        res.json(group);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération du groupe.");
    }
})

router.get("/", async (req, res) => {
    try {
        const group = await getGroups(req.auth.associationId);
        if (!group) {
            return res.status(404).json("Aucun groupes trouver.");
        }
        res.json(group);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des groupes.");
    }
})

router.get("/:group_id/members", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }

        // n'autorise la récupération des membres que si l'utilisateur fait partie du groupe
        if (req.auth.userLvl < 1) {
            const users = await getGroupUsers(group.id);
            const authorisedUser = users.some(user => user.id === req.auth.userId);
            if (!authorisedUser) {
                return res.status(403).json("Vous n'avez pas les droits d'accès.");
            }
        }


        const members = await getGroupMembers(group.id);
        res.json(members);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des membres du groupe.");
    }
})

router.get("/:group_id/users", async (req, res) => {
    try {
        //console.log(req.auth.associationId);
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }

        // n'autorise la récupération des membres que si l'utilisateur fait partie du groupe
        if (req.auth.userLvl < 1) {
            const users = await getGroupUsers(group.id);
            const authorisedUser = users.some(user => user.id === req.auth.userId);
            if (!authorisedUser) {
                return res.status(403).json("Vous n'avez pas les droits d'accès.");
            }
        }

        const users = await getGroupUsers(group.id);
        res.json(users);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la récupération des membres du groupe.");
    }
})

// POST //

router.post("/", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const { name, group_day, members_max, start_time, end_time } = req.body;
        const association_id = req.auth.associationId
        const group = await createGroup(name, association_id, group_day, members_max, start_time, end_time);
        res.status(201).json(group);
        
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la création du groupe.");
    }
})

router.post("/:group_id/members", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }
        const memberToAdd = req.body.members_list;

        // vérifie que les membres existent dans l'association
        for (const m of memberToAdd) {
            const member = await getMemberById(m, req.auth.associationId);
            if (!member) {
                return res.status(404).json("Un des membres n'existe pas.");
            }
        }

        // n'autorise le post des membres que si l'utilisateur fait partie du groupe
        if (req.auth.userLvl < 1) {
            const users = await getGroupUsers(group.id);
            const authorisedUser = users.some(user => user.id === req.auth.userId);
            if (!authorisedUser) {
                return res.status(403).json("Vous n'avez pas les droits d'accès.");
            }
        }


        const actualMembers = await getGroupMembers(group.id);
        const group_name = group.name;
        const existingMembers = await memberToAdd.filter(member => actualMembers.some(m => m.id === member));
        if (existingMembers.length > 0) {
            return res.status(400).json(`Les membres suivants font déjà partie du groupe : ${existingMembers.join(", ")}. Action annulée`);
        }

        for (const member of memberToAdd) {
            await addMemberToGroup(group.id, member);
        }

        res.status(200).json(`Les membres ${req.body.members_list.join(", ")} ont été ajoutés au groupe ${group_name} avec succès.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de l'ajout des membres au groupe.");
    }
});


router.post("/:group_id/users", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }

        const usersToAdd = req.body.users_list;

        // verifie que les users existent dans l'association
        for (const u of usersToAdd) {
            const user = await getUser(u, req.auth.associationId);
            if (!user) {
                return res.status(404).json("Un des users n'existe pas.");
            }
        }

        const actualUsers = await getGroupUsers(group.id);
        const group_name = group.name
        const existingUsers = await usersToAdd.filter(user => actualUsers.some(u => u.id === user));
        if (existingUsers.length > 0) {
            return res.status(400).json(`Les users suivants font déjà partie du groupe : ${existingUsers.join(", ")}. Action annulée`);
        }

        for (const user of usersToAdd) {
            await addUserToGroup(group.id, user);
        }

        res.status(200).json(`Les users ${req.body.users_list.join(", ")} ont été ajouté au groupe ${group_name} avec succès.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de l'ajout des users au groupe.");
    }
})

router.post("/presence", async (req, res) => {
    // if (req.auth.userLvl < 1) {
    //     return res.status(403).json("Vous n'avez pas les droits d'accès.");
    // }
    
    try{
        
        addPresenceList(req.body.associationId, req.body.group_id, req.body.presence, req.body.userId)
        res.status(200).json("La fiche presence a été ajoutée avec succès.");
    }catch(err){
        console.log(err)
        res.status(500).json({error : "Une erreur est survenue lors de l'ajout de la fiche presence."});
    }

})

// PUT //

router.put("/:group_id", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const { name, group_day, members_max, start_time, end_time } = req.body;
        const id = req.params.group_id
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }
        const update_group = await updateGroup(id, name, group_day, members_max, start_time, end_time);
        res.json(`Le groupe avec l'id ${id} a été modifié avec succès.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la modification du groupe.");
    }
})

router.put("/:group_id/presence", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }

        const members_list = req.body;
        const group_members = await getGroupMembers(group.id);

        for (const memberId of members_list) {
            const member = await getMemberById(memberId, req.auth.associationId);

            // si un des membres de members_list ne fait pas partie de l'association on ne peut pas l'assigner
            if (!member) {
                return res.status(404).json("Un des membres n'existe pas. Action annulée");
            }

            // si un des membres n'est pas dans le groupe on ne peut pas l'assigner
            if (!group_members.find(memberInGroup => memberInGroup.id === member.id)) {
                return res.status(404).json("Un des membres n'est pas dans le groupe. Action annulée");
            }

        }

        const group_name = group.name;
        await updateGroupPresence(group.id, members_list);
        res.json(`Les présences du groupe ${group_name} ont été mises à jour.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de l'assignation des présences du groupe");
    }
});

// DELETE //

// A VOIR SI UTILE : 

/* router.delete("/:group_id", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const id = req.params.group_id
        const group = await deleteGroup(id);
        res.json(`Le groupe ${group.name} a été supprimé avec succès.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la suppression du groupe.");
    }
}) */

router.delete("/:group_id/members", async (req, res) => {
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }

        // n'autorise le delete des membres que si l'utilisateur fait partie du groupe
        if (req.auth.userLvl < 1) {
            const users = await getGroupUsers(group.id);
            const authorisedUser = users.some(user => user.id === req.auth.userId);
            if (!authorisedUser) {
                return res.status(403).json("Vous n'avez pas les droits d'accès.");
            }
        }

        const membersToDelete = req.body.members_list;
        const actuelMembers = await getGroupMembers(group.id);
        for (const member of membersToDelete) {
            if (!actuelMembers.some(memberInGroup => memberInGroup.id === member)) {
                return res.status(404).json("Un des membres n'existe pas dans le groupe. Action annulée");
            }
        }

        const group_name = group.name
        await req.body.members_list.forEach(member => {
            deleteMemberFromGroup(group.id, member);
        });
        res.json(`Les membres ${req.body.members_list.join(", ")} du groupe ${group_name} ont été supprimé.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la suppression des membres du groupe.");
    }
})

router.delete("/:group_id/users", async (req, res) => {
    if (req.auth.userLvl < 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const group = await getGroup(req.params.group_id, req.auth.associationId);
        if (!group) {
            return res.status(404).json("Le groupe n'existe pas.");
        }

        const usersToDelete = req.body.users_list;
        const actuelUsers = await getGroupUsers(group.id);
        for (const user of usersToDelete) {
            if (!actuelUsers.some(userInGroup => userInGroup.id === user)) {
                return res.status(404).json("Un des utilisateurs n'existe pas dans le groupe. Action annulée");
            }
        }

        const group_name = group.name
        await req.body.users_list.forEach(member => {
            deleteUserFromGroup(group.id, member);
        });
        res.json(`Les users ${req.body.users_list.join(", ")} du groupe ${group_name} ont été supprimé.`);
    } catch (error) {
        console.log(error)
        res.status(500).json("Une erreur est survenue lors de la suppression des users du groupe.");
    }
})

export default router