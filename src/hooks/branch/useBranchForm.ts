import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Branch } from "@/types/branch";
import { useEffect } from "react";
import { BranchFormData, branchSchema } from "../../components/branch/types";

interface UseBranchFormProps {
  initialData?: Branch;
  open: boolean;
}

export const useBranchForm = ({ initialData, open }: UseBranchFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control
  } = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: "",
      location: "",
      longitude: "",
      latitude: "",
      phone_number: "",
      is_active: true
    }
  });

  useEffect(() => {
    if (open) {
      reset(
        initialData || {
          name: "",
          location: "",
          longitude: "",
          latitude: "",
          phone_number: "",
          is_active: true
        }
      );
    }
  }, [open, initialData, reset]);

  return {
    register,
    handleSubmit,
    errors,
    reset,
    control
  };
};
