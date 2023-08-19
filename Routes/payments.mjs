import express from 'express'
const router = express.Router()

import {viewAllPayments, addNewPayment, viewAssociationBalance} from '../Controllers/Payments.mjs'


router.get('/views', viewAllPayments)
router.get('/view/balance', viewAssociationBalance)
router.post('/', addNewPayment)
 

export default router 