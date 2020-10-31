import { Router } from 'express'
import { JwtPayload, signPayload } from 'src/auth/jwt'
import {
  LoginBodySchema,
  LoginRequestDTO,
  RegisterBodySchema,
  RegisterRequestDTO,
} from 'src/models/dtos/auth'
import { UserODM } from 'src/models/odms/user'
import { ValidatedRequest } from 'express-joi-validation'
import validator from 'src/models/dtos/validator'

export const router = Router()

router.post(
  '/register',
  validator.body(RegisterBodySchema),
  async (req: ValidatedRequest<RegisterRequestDTO>, res) => {
    const user = await UserODM.create({
      ...req.body,
      profile: {
        headline: 'New user',
        description: 'I am new to HelpingAngel!',
      },
    })
    res.json(user)
  }
)

router.post(
  '/login',
  validator.body(LoginBodySchema),
  async (req: ValidatedRequest<LoginRequestDTO>, res) => {
    const user = await UserODM.findByIdentifier(req.body.username)
    if (!user || !(await user.isValidPassword(req.body.password)))
      throw Error('Invalid creds')

    res.json({
      token: signPayload({
        id: user.id,
        username: user.username,
      } as JwtPayload),
    })
  }
)
