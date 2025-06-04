import { z } from "zod";
import { Service } from "@/types/service";

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  duration_minute: z.number().min(1, "Duration must be at least 1 minute"),
  price: z.number().min(0, "Price must be a positive number"),
  category_id: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image URL is required"),
  is_active: z.boolean(),
  branch_ids: z.array(z.string()).min(1, "At least one branch must be selected")
});

export type ServiceFormData = z.infer<typeof serviceSchema>;

export type FormMode = "create" | "edit" | null;

export interface FormState {
  mode: FormMode;
  service?: Service;
  isLoading: boolean;
}

export interface DeleteState {
  isOpen: boolean;
  service?: Service;
  isLoading: boolean;
}

export interface ServiceActionsProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}
