import { UserODM } from 'src/models/odms/user'
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt'
import { sign } from 'jsonwebtoken'
import { authenticate } from 'passport'
import { ParamsDictionary, RequestHandler } from 'express-serve-static-core'
import { ParsedQs } from 'qs'

export interface JwtPayload {
  id: string
  username: string
}

export const getJwtStrategy = () =>
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    (payload: JwtPayload, done) => {
      UserODM.findOne({ username: payload.username }, (err, user) => {
        if (err) return done(err)
        done(null, user)
      })
    }
  )

export function signPayload(payload: JwtPayload) {
  return sign(payload, process.env.JWT_SECRET || 'default')
}

export function jwtMiddleware() {
  return authenticate('jwt', { session: false }) as RequestHandler<
    ParamsDictionary,
    any,
    any,
    ParsedQs
  >
}
