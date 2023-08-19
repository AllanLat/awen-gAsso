import express from 'express'
const router = express.Router()

import { memberPaymentsView } from '../Controllers/UserPayments.mjs'


router.get("/:member_id", memberPaymentsView)

export default router