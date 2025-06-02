export interface Branch {
  id: string;
  name: string;
  location: string;
  longitude: string;
  latitude: string;
  phone_number: string;
}

export interface BranchResponse {
  code: number;
  data: Branch[];
  message: string;
}
