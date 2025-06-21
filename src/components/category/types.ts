import { z } from "zod";
import { Category } from "@/types/category";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required")
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export type FormMode = "create" | "edit" | null;

export interface FormState {
  mode: FormMode;
  category?: Category;
  isLoading: boolean;
}

export interface DeleteState {
  isOpen: boolean;
  category?: Category;
  isLoading: boolean;
}
