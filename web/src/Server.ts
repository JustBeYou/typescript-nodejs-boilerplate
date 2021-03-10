import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import express, { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import 'express-async-errors'

import BaseRouter from './controllers'
import passport from 'passport'
import { getJwtStrategy } from './auth/jwt'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

passport.use(getJwtStrategy())

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

if (process.env.NODE_ENV === 'production') {
    app.use(helmet())
}

app.use(BaseRouter)

app.use((err: Error, req: Request, res: Response) => {
    console.error(err.message, err)
    return res.status(StatusCodes.BAD_REQUEST).json({
        error: err.message,
    })
})

export default app
