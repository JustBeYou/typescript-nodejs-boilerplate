import { Router } from 'express'
import { router as authRouter } from './auth'
import { router as usersRouter } from './users'

// Init router and path
const router = Router()
router.use('/', authRouter)
router.use('/users', usersRouter)

// Export the base-router
export default router
