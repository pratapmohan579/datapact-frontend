import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { queryKeys } from './keys';

export const useIncidents = () => {
  return useQuery({
    queryKey: queryKeys.incidents.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get('/incidents/');
      return data;
    },
  });
};
