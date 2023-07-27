import { viewAll, addPayment, getBalance } from "../Querries/payments.js"


const viewAllPayments = async (req, res) => {
    if (req.auth.userLvl !== 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const pay = await viewAll(req.auth.associationId)
        res.json(pay)
    } catch (error) {
        res.status(500).json("Une erreur est survenue lors de la récupération des transactions.");
    }
}

const addNewPayment = async (req, res) => {


    if (req.auth.userLvl !== 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }
    try {
        const newPayment = await addPayment(req.auth.associationId,
            req.body.credit,
            req.body.debit,
            req.body.payment_method,
            req.body.payment_date,
            req.body.description,
            req.body.balance)

        
        res.status(201).json(newPayment)



    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err });
    }
}

const viewAssociationBalance = async (req, res) => {

    if (req.auth.userLvl !== 1) {
        return res.status(403).json("Vous n'avez pas les droits d'accès.");
    }

    try {
        const appel = await getBalance(req.auth.associationId)
        res.json(appel)
    } catch (err) {
        console.log(err)
    }
}



export {
    viewAllPayments,
    addNewPayment,
    viewAssociationBalance
}