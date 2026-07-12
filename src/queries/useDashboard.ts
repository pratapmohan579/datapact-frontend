import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { queryKeys } from './keys';

export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: async () => {
      // Once the dashboard_service is created by the subagent, this endpoint will exist.
      // We will fallback to a default structure if it fails during the transition.
      try {
        const { data } = await apiClient.get('/dashboard/metrics');
        return data;
      } catch (error) {
        return {
          total_contracts: 0,
          active_incidents: 0,
          failed_validations_24h: 0,
          healthy_assets: 0
        };
      }
    },
    refetchInterval: 30000, // Poll every 30s as a fallback to websockets
  });
};
