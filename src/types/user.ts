export interface User {
  id: string;
  name: string;
  create_at: string;
  update_at: string;
  email: string;
  phone_number: string;
  role: "ADMIN" | "USER";
}

export interface UsersResponse {
  code: number;
  data: User[];
  message: string;
}
