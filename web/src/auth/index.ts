import { UserRole, UserRoles } from 'src/models/interfaces/user'
import { jwtHttpMiddleware } from './jwt'
import { createRolesMiddleware } from './roles'
import { ParamsDictionary, RequestHandler } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

// Pass roles as parameters
export const authenticatedWithRole =
    (roles?: UserRole[]): RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> =>
    (req, res, next) => {
        jwtHttpMiddleware()(req, res, () => {
            createRolesMiddleware(roles || UserRoles)(req, res, next)
        })
    }

// Allowed for any role
export const authenticated = (): RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>> =>
    authenticatedWithRole()
