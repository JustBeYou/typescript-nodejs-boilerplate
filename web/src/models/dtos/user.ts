import * as Joi from 'joi'
import { ValidatedRequestSchema, ContainerTypes } from 'express-joi-validation'
import { UserInterface, UserRoles } from '../interfaces/user'

export const ProfileUpdateSchema = Joi.object({
    headline: Joi.string().optional(),
    description: Joi.string().optional(),
})

export const ProfileResponseSchema = Joi.object({
    _id: Joi.any().required(),
    headline: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().allow('').optional(),
})

export const UserUpdateSchema = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    role: Joi.string()
        .valid(...UserRoles)
        .optional(),
    profile: ProfileUpdateSchema.optional(),
})

export const UserParamsSchema = Joi.object({
    id: Joi.string().required(),
})

export const UserResponseSchema = Joi.object({
    _id: Joi.any().required(),
    username: Joi.string().required(),
    profile: ProfileResponseSchema.required(),
})

export const UserMeResponseSchema = Joi.object({
    _id: Joi.any().required(),
    username: Joi.string().required(),
    profile: ProfileResponseSchema.required(),
    email: Joi.string().email().required(),
})

export const UserImageUploadSchema = Joi.object().required().messages({
    'any.required': 'File is required',
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
