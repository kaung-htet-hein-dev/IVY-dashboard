import { endpoints } from "@/apiClient/endpoints";
import useAxios from "@/hooks/useAxios";
import { Service, ServiceFormData, ServicesResponse } from "@/types/service";

export const useServiceService = () => {
  const { axiosInstance } = useAxios();

  return {
    getServices: async (): Promise<Service[]> => {
      const response = await axiosInstance.get<ServicesResponse>(
        endpoints.services
      );
      return response.data.data;
    },

    getService: async (id: string): Promise<Service> => {
      const response = await axiosInstance.get<{
        code: number;
        data: Service;
        message: string;
      }>(endpoints.service(id));
      return response.data.data;
    },

    createService: async (service: ServiceFormData): Promise<Service> => {
      const response = await axiosInstance.post<{
        code: number;
        data: Service;
        message: string;
      }>(endpoints.services, service);
      return response.data.data;
    },

    updateService: async (
      id: string,
      service: ServiceFormData
    ): Promise<Service> => {
      const response = await axiosInstance.put<{
        code: number;
        data: Service;
        message: string;
      }>(endpoints.service(id), service);
      return response.data.data;
    },

    deleteService: async (id: string): Promise<void> => {
      await axiosInstance.delete(endpoints.service(id));
    }
  };
};

export default useServiceService;
