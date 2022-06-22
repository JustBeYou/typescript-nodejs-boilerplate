import { RequestHandler, ParamsDictionary } from 'express-serve-static-core'
import { StatusCodes } from 'http-status-codes'
import { ParsedQs } from 'qs'
import { UserRole } from 'src/models/interfaces/user'
import { UserDocument } from 'src/models/odms/user'

export const createRolesMiddleware =
    (roles: UserRole[]): RequestHandler<ParamsDictionary, any, any, ParsedQs> =>
    (req, res, next) => {
        const user = req.user as UserDocument
        if (roles.length === 0 || roles.includes(user.role)) next()
        else {
            res.status(StatusCodes.FORBIDDEN)
            res.json({ message: 'Unauthorized' })
        }
    }
