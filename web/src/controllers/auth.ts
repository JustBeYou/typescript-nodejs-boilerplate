import { Router } from 'express'
import 'express-async-errors'

import { JwtPayload, signPayload } from 'src/auth/jwt'
import { LoginBodySchema, LoginRequestDTO, RegisterBodySchema, RegisterRequestDTO } from 'src/models/dtos/auth'
import { UserODM } from 'src/models/odms/user'
import { ValidatedRequest } from 'express-joi-validation'
import validator from 'src/models/dtos/validator'
import { ControllerError } from './error'
import { StatusCodes } from 'http-status-codes'

export const router = Router()

router.post('/register', validator.body(RegisterBodySchema), async (req: ValidatedRequest<RegisterRequestDTO>, res) => {
    const user = await UserODM.create({
        ...req.body,
        profile: {
            headline: 'New user',
            description: '...',
        },
    })
    res.json(user)
})

router.post('/login', validator.body(LoginBodySchema), async (req: ValidatedRequest<LoginRequestDTO>, res) => {
    const user = await UserODM.findByIdentifier(req.body.username)
    if (!user || !(await user.isValidPassword(req.body.password)))
        throw new ControllerError('Invalid creds', StatusCodes.BAD_REQUEST)

    res.json({
        token: signPayload({
            id: user.id,
            username: user.username,
        } as JwtPayload),
    })
})
