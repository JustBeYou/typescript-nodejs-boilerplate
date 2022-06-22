import { UserDocument, UserODM } from 'src/models/odms/user'
import { ExtractJwt, Strategy as JwtStrategy, VerifiedCallback } from 'passport-jwt'
import { sign } from 'jsonwebtoken'
import { authenticate } from 'passport'
import { ParamsDictionary, RequestHandler } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

export interface JwtPayload {
    id: string
    username: string
}

export const jwtHttpOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'default',
}

export function verifyJwt(payload: JwtPayload, done: VerifiedCallback): void {
    UserODM.findOne({ username: payload.username }, (err: any, user: UserDocument | null) => {
        if (err) return done(err)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        done(null, user!)
    })
}

export const getHttpJwtStrategy = (): JwtStrategy => new JwtStrategy(jwtHttpOptions, verifyJwt)

export function signPayload(payload: JwtPayload): string {
    return sign(payload, process.env.JWT_SECRET || 'default')
}

export function jwtHttpMiddleware(): any {
    return authenticate('jwt', { session: false }) as RequestHandler<ParamsDictionary, any, any, ParsedQs>
}
