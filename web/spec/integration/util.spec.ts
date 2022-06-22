import buildRouter from '@app/controllers'
import { buildExpressApp } from '@app/expressApp'
import buildHttpServer from '@app/httpServer'

export const baseRouter = buildRouter()
export const expressApp = buildExpressApp(baseRouter)
export const httpServer = buildHttpServer(expressApp)
