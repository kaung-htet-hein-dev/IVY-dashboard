export const endpoints = {
  // Auth

  // Branches
  branches: "/api/v1/branch",
  branch: (id: string) => `/api/v1/branch/${id}`,

  // Categories
  categories: "/api/v1/category",
  category: (id: string) => `/api/v1/category/${id}`,

  // Users
  users: "/api/v1/user",
  user: (id: string) => `/api/v1/user/${id}`,

  // Services
  services: "/api/v1/service",
  service: (id: string) => `/api/v1/service/${id}`,

  // Bookings
  bookings: "/api/v1/booking",
  booking: (id: string) => `/api/v1/booking/${id}`
};
