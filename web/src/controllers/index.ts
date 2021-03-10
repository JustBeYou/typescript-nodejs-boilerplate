import { Router } from 'express'
import { router as authRouter } from './auth'
import { router as usersRouter } from './users'

const router = Router()
router.use('/', authRouter)
router.use('/users', usersRouter)

export default router
