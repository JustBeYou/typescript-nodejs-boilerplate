import { UserDocument } from 'src/models/odms/user'

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}

export {}
