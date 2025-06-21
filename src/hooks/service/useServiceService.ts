import { endpoints } from "@/apiClient/endpoints";
import { Service, ServiceFormData, ServicesResponse } from "@/types/service";
import useAxios from "../utility/useAxios";

export const useServiceService = () => {
  const { axiosInstance } = useAxios();

  return {
    getServices: async (
      options: {
        pageIndex: number;
        pageSize: number;
      } = { pageIndex: 0, pageSize: 10 }
    ): Promise<ServicesResponse> => {
      const response = await axiosInstance.get<ServicesResponse>(
        endpoints.services,
        {
          params: {
            offset: options.pageIndex * options.pageSize,
            limit: options.pageSize
          }
        }
      );
      return response.data;
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
