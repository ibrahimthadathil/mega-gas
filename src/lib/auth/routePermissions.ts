import { navItems } from "@/configuration/navConfig";
import { normalizeRole } from "@/lib/auth/edgeAuth";

type RoutePermissionMap = Map<string, string[]>;
type NavItemType = (typeof navItems)[number];

function sanitizePath(path: string) {
  if (!path.startsWith("/")) return `/${path}`;
  if (path === "/") return path;
  return path.replace(/\/+$/, "") || "/";
}

function buildPermissions(): RoutePermissionMap {
  const permissions: RoutePermissionMap = new Map();

  const addRoute = (url: string, roles: string[]) => {
    const normalizedRoles = roles.map(normalizeRole);
    permissions.set(sanitizePath(url), normalizedRoles);
  };

  const traverse = (items: NavItemType[], parentRoles?: string[]) => {
    items.forEach((item) => {
      const roles = item.roles ?? parentRoles ?? [];
      addRoute(item.url, roles);
      if (item.items?.length) {
        traverse(item.items as NavItemType[], roles);
      }
    });
  };

  traverse(navItems);

  // Special case: accountants cannot access /admin/ums.
  const umsRoles = ["admin", "manager"].map(normalizeRole);
  permissions.set("/admin/ums", umsRoles);

  return permissions;
}

const routePermissions = buildPermissions();

export function getAllowedRolesForRoute(pathname: string): string[] | null {
  const sanitized = sanitizePath(pathname);

  let matchedRoles: string[] | null = null;
  let longestMatchLength = 0;

  for (const [route, roles] of routePermissions.entries()) {
    if (
      sanitized === route ||
      sanitized.startsWith(`${route}/`)
    ) {
      if (route.length > longestMatchLength) {
        matchedRoles = roles;
        longestMatchLength = route.length;
      }
    }
  }

  return matchedRoles;
}

export function isProtectedRoute(pathname: string) {
  return getAllowedRolesForRoute(pathname) !== null;
}

export { routePermissions };

