import { loadConfig } from './LoadEnv'
import app from '@server'
import { connect, connection } from 'mongoose'

loadConfig()

// Connect to the DB
const dbConfig = {
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}?authSource=admin`
connect(dbUri, { useNewUrlParser: true })
// tslint:disable-next-line: no-console
connection.on('error', console.error.bind(console, 'MongoDB connection error:'))

// Start the server
const port = Number(process.env.PORT || 3000)
app.listen(port, () => {
  // tslint:disable-next-line: no-console
  console.log('Express server started on port: ' + port)
})
