export const REQUIRED_PERMISSION = "invoices:read";

type AuthdogUserClaims = {
  permissions?: string[];
  roles?: string[];
};

/** Fail-closed: a missing claim is a deny. */
export function hasPermission(
  user: AuthdogUserClaims | null | undefined,
  permission: string,
): boolean {
  const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
  return permissions.includes(permission);
}
