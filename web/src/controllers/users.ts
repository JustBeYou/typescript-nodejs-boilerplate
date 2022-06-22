import { Router, Request } from 'express'
import 'express-async-errors'

import { authenticated } from 'src/auth'
import {
    UserParamsDTO,
    UserParamsSchema,
    UserResponseSchema,
    UserMeResponseSchema,
    UserUpdateDTO,
    UserUpdateMeDTO,
    UserUpdateSchema,
} from 'src/models/dtos/user'
import validator from 'src/models/dtos/validator'
import { UserODM } from 'src/models/odms/user'
import { checkContract, notNullContract } from 'src/utils/contracts'
import { ValidatedRequest } from 'express-joi-validation'
import { StatusCodes } from 'http-status-codes'
import { ControllerError } from './error'

export const router = Router()

router.get('/me', authenticated(), validator.response(UserMeResponseSchema), async (req, res) => {
    const user = notNullContract(
        await UserODM.findOne({ _id: req.user?._id }).lean().select('username profile email'),
        new ControllerError('User not found', StatusCodes.NOT_FOUND)
    )
    res.json(user)
})

router.put(
    '/me',
    authenticated(),
    validator.body(UserUpdateSchema),
    async (req: ValidatedRequest<UserUpdateMeDTO>, res) => {
        const currentUser = notNullContract(req.user, 'Null user')
        const updated = await currentUser.updateOne(req.body).exec()
        res.json(updated)
    }
)

router.get(
    '/:id',
    validator.params(UserParamsSchema),
    validator.response(UserResponseSchema),
    async (req: ValidatedRequest<UserParamsDTO>, res) => {
        const user = notNullContract(
            await UserODM.findById(req.params.id).lean().select('username profile'),
            new ControllerError('User not found', StatusCodes.NOT_FOUND)
        )

        res.json(user)
    }
)

router.put(
    '/:id',
    authenticated(),
    validator.params(UserParamsSchema),
    validator.body(UserUpdateSchema),
    async (req: ValidatedRequest<UserUpdateDTO>, res) => {
        const currentUser = notNullContract(req.user, 'Null user')
        const user = notNullContract(
            await UserODM.findById(req.params.id).exec(),
            new ControllerError('User not found', StatusCodes.NOT_FOUND)
        )

        checkContract(
            user.id === currentUser.id,
            new ControllerError('You can modify only your own account', StatusCodes.FORBIDDEN)
        )

        const updated = await user.updateOne(req.body).exec()
        res.json(updated)
    }
)
