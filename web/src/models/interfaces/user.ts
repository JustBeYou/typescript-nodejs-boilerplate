import { ProfileInterface } from './profile'

export interface UserInterface {
    username: string
    password: string
    email: string
    role: UserRole
    profile: ProfileInterface
}

export enum UserRole {
    DEFAULT = 'DEFAULT',
    ADMIN = 'ADMIN',
}
export const UserRoles = Object.values(UserRole)
