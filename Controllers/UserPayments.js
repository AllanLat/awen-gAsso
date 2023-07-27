import { viewAllMemberPayments } from "../Querries/userPayments.js";


const memberPaymentsView = async (req, res) => {

    try{
        const pay = await viewAllMemberPayments(req.body.memberId)
        res.status(200).json(pay)
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}

export { 
    memberPaymentsView
}