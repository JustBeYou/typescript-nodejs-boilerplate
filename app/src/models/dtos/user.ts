import * as Joi from '@hapi/joi'
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation'
import { UserInterface, UserRoles } from '../interfaces/user'

export const ProfileUpdateSchema = Joi.object({
  headline: Joi.string().optional(),
  description: Joi.string().optional(),
})

export const UserUpdateSchema = Joi.object({
  username: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  role: Joi.number()
    .integer()
    .valid(...UserRoles)
    .optional(),
  profile: ProfileUpdateSchema.optional(),
})

export const UserParamsSchema = Joi.object({
  id: Joi.string().required(),
})

export interface UserParamsDTO extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string
  }
}

export interface UserUpdateMeDTO extends ValidatedRequestSchema {
  [ContainerTypes.Body]: Partial<UserInterface>
}

export interface UserUpdateDTO extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string
  }
  [ContainerTypes.Body]: Partial<UserInterface>
}
