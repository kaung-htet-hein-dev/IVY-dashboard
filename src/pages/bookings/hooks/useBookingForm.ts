import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookingFormData, TimeSlot, bookingFormSchema } from "../types";
import { serviceService } from "@/services/serviceService";
import { Service } from "@/types/service";
import { bookingService } from "@/services/bookingService";
import { format, addDays } from "date-fns";

interface UseBookingFormProps {
  open: boolean;
}

export const useBookingForm = ({ open }: UseBookingFormProps) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      service_id: "",
      branch_id: "",
      booked_date: null as unknown as Date,
      booked_time: ""
    }
  });

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: serviceService.getServices
  });

  const selectedDate = watch("booked_date");
  const selectedBranchId = watch("branch_id");

  const { data: availableSlots = [] } = useQuery<TimeSlot[]>({
    queryKey: ["availableSlots", selectedDate, selectedBranchId],
    queryFn: () =>
      bookingService.getAvailableSlots(
        format(selectedDate, "dd/MM/yyyy"),
        selectedBranchId
      ),
    enabled: Boolean(selectedDate && selectedBranchId)
  });

  const handleServiceChange = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
    setValue("service_id", serviceId);
    setValue("branch_id", ""); // Reset branch when service changes
    setValue("booked_time", ""); // Reset time when service changes
  };

  useEffect(() => {
    if (open) {
      reset();
      setSelectedService(null);
    }
  }, [open, reset]);

  const minDate = addDays(new Date(), 1); // Tomorrow
  const maxDate = addDays(new Date(), 30); // One month from tomorrow

  return {
    register,
    handleSubmit,
    errors,
    services,
    selectedService,
    handleServiceChange,
    availableSlots,
    minDate,
    maxDate,
    setValue,
    watch
  };
};
