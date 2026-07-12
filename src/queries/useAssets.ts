import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { queryKeys } from './keys';

export const useAssets = () => {
  return useQuery({
    queryKey: queryKeys.assets.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get('/assets/');
      return data;
    },
  });
};

export const useAssetProfile = (assetId: string) => {
  return useQuery({
    queryKey: [...queryKeys.assets.detail(assetId), 'profile'],
    queryFn: async () => {
      const { data } = await apiClient.get(`/assets/${assetId}/profile`);
      return data;
    },
    enabled: !!assetId,
  });
};
