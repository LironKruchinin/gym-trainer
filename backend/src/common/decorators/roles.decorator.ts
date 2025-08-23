import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/**
 * Apply this decorator to a handler or controller class
 * to require that the authenticated user have at least one
 * of the named roles.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
