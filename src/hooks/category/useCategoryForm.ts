import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/category";
import { useEffect } from "react";
import {
  CategoryFormData,
  categorySchema
} from "../../components/category/types";

interface UseCategoryFormProps {
  initialData?: Category;
  open: boolean;
}

export const useCategoryForm = ({
  initialData,
  open
}: UseCategoryFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: ""
    }
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          name: ""
        }
      );
    }
  }, [open, initialData, reset]);

  return {
    register,
    handleSubmit,
    errors,
    reset
  };
};
