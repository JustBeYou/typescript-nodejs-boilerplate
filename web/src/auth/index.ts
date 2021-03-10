import { UserRole } from 'src/models/interfaces/user'
import { jwtMiddleware } from './jwt'
import { createRolesMiddleware } from './roles'
import { ParamsDictionary, RequestHandler } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

export const rolesGuards = (
    roles?: UserRole[]
): RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>[] => [
    jwtMiddleware(),
    createRolesMiddleware(roles || []),
]
