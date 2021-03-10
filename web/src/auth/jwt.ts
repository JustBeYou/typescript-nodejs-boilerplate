import { UserDocument, UserODM } from 'src/models/odms/user'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { sign } from 'jsonwebtoken'
import { authenticate } from 'passport'
import { ParamsDictionary, RequestHandler } from 'express-serve-static-core'
import { ParsedQs } from 'qs'
import { CallbackError } from 'mongoose'

export interface JwtPayload {
    id: string
    username: string
}

export const getJwtStrategy = (): JwtStrategy =>
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
        },
        (payload: JwtPayload, done) => {
            UserODM.findOne({ username: payload.username }, (err: CallbackError, user: UserDocument | null) => {
                if (err) return done(err)
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                done(null, user!)
            })
        }
    )

export function signPayload(payload: JwtPayload): string {
    return sign(payload, process.env.JWT_SECRET || 'default')
}

export function jwtMiddleware(): any {
    return authenticate('jwt', { session: false }) as RequestHandler<ParamsDictionary, any, any, ParsedQs>
}
