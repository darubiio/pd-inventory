const PUBLIC_ROUTES = ["/"];
const AUTH_ROUTE = "/auth";

export const isPublic = (path: string, publicRoutes = PUBLIC_ROUTES) => {
  // Rutas exactas que son públicas
  if (publicRoutes.includes(path)) return true;

  // Rutas que empiezan con /.well-known (DevTools, etc.)
  if (path.startsWith("/.well-known")) return true;

  return false;
};

export const isAuth = (path: string, authRoute = AUTH_ROUTE) => {
  return path.startsWith(authRoute);
};
