import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'

import express, { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import 'express-async-errors'

import BaseRouter from './controllers'
import passport from 'passport'
import { getJwtStrategy } from './auth/jwt'

// Init express
const app = express()

/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

passport.use(getJwtStrategy())

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Security
if (process.env.NODE_ENV === 'production') {
  app.use(helmet())
}

// Add APIs
app.use(BaseRouter)

// Print API errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // tslint:disable-next-line: no-console
  console.error(err.message, err)
  return res.status(StatusCodes.BAD_REQUEST).json({
    error: err.message,
  })
})

// Export express instance
export default app
