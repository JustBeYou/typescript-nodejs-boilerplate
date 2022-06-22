import express, { NextFunction, Request, Response, Router, Express } from 'express'
import 'express-async-errors'

import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import { StatusCodes } from 'http-status-codes'
import passport from 'passport'
import { getHttpJwtStrategy } from './auth/jwt'
import { isControllerError } from './controllers/error'

export function buildExpressApp(baseRouter: Router): Express {
    const app = express()

    app.use(cors())
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cookieParser())
    app.use(passport.initialize())

    passport.use(getHttpJwtStrategy())

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    }

    if (process.env.NODE_ENV === 'production') {
        app.use(helmet())
    }

    app.use(baseRouter)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (isControllerError(err)) res.status(err.errorCode).json({ message: err.message })
        else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    })

    return app
}
