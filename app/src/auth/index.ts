import { UserRole } from 'src/models/interfaces/user'
import { jwtMiddleware } from './jwt'
import { createRolesMiddleware } from './roles'

export const rolesGuards = (roles?: UserRole[]) => [
  jwtMiddleware(),
  createRolesMiddleware(roles || []),
]
