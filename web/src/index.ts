import 'express'
import 'express-async-errors'

import { setupDatabase } from './database'
import buildHttpServer from './httpServer'
import { loadConfig } from './LoadEnv'
import buildRouter from './controllers'
import { buildExpressApp } from './expressApp'

loadConfig()

setupDatabase()

const baseRouter = buildRouter()
const expressApp = buildExpressApp(baseRouter)
const httpServer = buildHttpServer(expressApp)

const port = Number(process.env.PORT || 3000)
httpServer.listen(port, () => {
    console.log('Express server started on port: ' + port)
})
