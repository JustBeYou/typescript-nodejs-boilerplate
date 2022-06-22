import { UserDocument } from 'src/models/odms/user'

declare global {
    namespace Express {
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        interface User extends UserDocument {}
    }
}

export {}
