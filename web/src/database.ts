import { connect, connection } from 'mongoose'
import { UserRole } from './models/interfaces/user'
import { UserODM } from './models/odms/user'

const dbConfig = {
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}
const dbUri = `mongodb://${dbConfig.user}:${dbConfig.pass}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}?authSource=admin`

export function setupDatabase(): void {
    connect(dbUri, { autoIndex: true, autoCreate: true })
    connection.on('error', console.error.bind(console, 'MongoDB connection error:'))
    connection.on('open', async () => {
        if (process.env.NODE_ENV == 'development') {
            await UserODM.create({
                username: 'admin',
                email: 'admin@admin.com',
                password: 'admin',
                role: UserRole.ADMIN,
            })
        }

        console.log('Database setup done.')
    })
}
