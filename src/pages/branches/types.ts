import { z } from "zod";
import { Branch } from "@/types/branch";

export const branchSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  longitude: z.string().min(1, "Longitude is required"),
  latitude: z.string().min(1, "Latitude is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  is_active: z.boolean().optional()
});

export type BranchFormData = z.infer<typeof branchSchema>;

export type FormMode = "create" | "edit" | null;

export interface FormState {
  mode: FormMode;
  branch?: Branch;
  isLoading: boolean;
}

export interface DeleteState {
  isOpen: boolean;
  branch?: Branch;
  isLoading: boolean;
}
