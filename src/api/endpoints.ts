export const endpoints = {
  login: "/api/v1/user/login",
  logout: "/api/v1/user/logout",

  branches: "/api/v1/branch",
  branch: (id: string) => `/api/v1/branch/${id}`
};
