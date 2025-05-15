const PUBLIC_ROUTES = ["/"];
const AUTH_ROUTE = "/auth";

export const isPublic = (path: string, publicRoutes = PUBLIC_ROUTES) => {
  return publicRoutes.includes(path)
};

export const isAuth = (path: string, authRoute = AUTH_ROUTE) => {
  return path.startsWith(authRoute);
};
