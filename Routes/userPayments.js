import express from 'express'
const router = express.Router()

import { memberPaymentsView } from '../Controllers/UserPayments.js'


router.get("/view", memberPaymentsView)

export default router