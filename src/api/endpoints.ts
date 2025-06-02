export const endpoints = {
  // Auth
  login: "/api/v1/user/login",
  logout: "/api/v1/user/logout",

  // Branches
  branches: "/api/v1/branch",
  branch: (id: string) => `/api/v1/branch/${id}`,

  // Categories
  categories: "/api/v1/category",
  category: (id: string) => `/api/v1/category/${id}`
};
