import express from 'express'
const router = express.Router()

import { memberPaymentsView } from '../Controllers/UserPayments.js'


router.get("/:member_id", memberPaymentsView)

export default router