import { Express } from 'express'
import 'express-async-errors'

import { createServer, Server } from 'http'

export default function buildHttpServer(app: Express): Server {
    return createServer(app)
}
