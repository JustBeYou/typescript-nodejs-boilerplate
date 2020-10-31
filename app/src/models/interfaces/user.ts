import { ProfileInterface } from './profile'

export interface UserInterface {
  username: string
  password: string
  email?: string
  role: UserRole
  profile: ProfileInterface
}

export enum UserRole {
  DEFAULT,
}
export const UserRoles = [UserRole.DEFAULT]
