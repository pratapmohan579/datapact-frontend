import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { queryKeys } from './keys';

export const useContracts = () => {
  return useQuery({
    queryKey: queryKeys.contracts.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get('/contracts/');
      return data;
    },
  });
};

export const useContract = (id: string) => {
  return useQuery({
    queryKey: queryKeys.contracts.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/contracts/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateContract = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payload: { raw_yaml: string, contract_name?: string }) => {
      const { data } = await apiClient.post('/contracts/', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts.lists() });
    },
  });
};
