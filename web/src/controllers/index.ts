import { Router } from 'express'
import 'express-async-errors'

import { router as authRouter } from './auth'
import { router as usersRouter } from './users'

export default function buildRouter(): Router {
    const router = Router()
    router.use('/auth', authRouter)
    router.use('/users', usersRouter)

    return router
}
