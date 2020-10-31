import { Router } from 'express'
import { rolesGuards } from 'src/auth'
import {
  UserParamsDTO,
  UserParamsSchema,
  UserUpdateDTO,
  UserUpdateMeDTO,
  UserUpdateSchema,
} from 'src/models/dtos/user'
import validator from 'src/models/dtos/validator'
import { UserODM } from 'src/models/odms/user'
import { checkContract } from 'src/utils/contracts'
import { ValidatedRequest } from 'express-joi-validation'

export const router = Router()

router.get('/me', ...rolesGuards(), async (req, res) => {
  res.json(req.user)
})

router.put(
  '/me',
  ...rolesGuards(),
  validator.body(UserUpdateSchema),
  async (req: ValidatedRequest<UserUpdateMeDTO>, res) => {
    const updated = await req.user?.update(req.body).exec()
    res.json(updated)
  }
)

router.get(
  '/:id',
  validator.params(UserParamsSchema),
  async (req: ValidatedRequest<UserParamsDTO>, res) => {
    const user = await UserODM.findById(req.params.id).exec()

    checkContract(user !== null, 'User not found')

    res.json(user)
  }
)

router.put(
  '/:id',
  ...rolesGuards(),
  validator.params(UserParamsSchema),
  validator.body(UserUpdateSchema),
  async (req: ValidatedRequest<UserUpdateDTO>, res) => {
    const currentUser = req.user
    const user = await UserODM.findById(req.params.id).exec()

    checkContract([
      [user !== null, 'User not found'],
      [user!.id === currentUser?.id, 'Forbidden'],
    ])

    const updated = await user?.update(req.body).exec()
    res.json(updated)
  }
)
