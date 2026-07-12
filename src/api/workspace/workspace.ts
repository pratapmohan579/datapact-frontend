import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/apiClient';

export interface WorkspacePreference {
  theme: string;
  density: string;
  language: string;
  timezone: string;
  default_home: string;
  sidebar_collapsed: boolean;
  right_sidebar_open: boolean;
  copilot_enabled: boolean;
  notifications_enabled: boolean;
}

export interface Favorite {
  id: number;
  item_id: string;
  item_type: string;
}

export interface RecentActivity {
  id: number;
  visited_page: string;
  duration: number;
  last_opened: string;
}

export interface WidgetPreference {
  id: number;
  widget_id: string;
  position: number;
  size: string | null;
  visibility: boolean;
}

export const workspaceKeys = {
  all: ['workspace'] as const,
  preferences: () => [...workspaceKeys.all, 'preferences'] as const,
  layout: (dashboardName: string) => [...workspaceKeys.all, 'layout', dashboardName] as const,
  widgets: (dashboardName: string) => [...workspaceKeys.all, 'widgets', dashboardName] as const,
  favorites: () => [...workspaceKeys.all, 'favorites'] as const,
  recent: () => [...workspaceKeys.all, 'recent'] as const,
};

// --- PREFERENCES ---

export function useWorkspacePreferences() {
  return useQuery({
    queryKey: workspaceKeys.preferences(),
    queryFn: () => api.get<WorkspacePreference>('/workspace/preferences'),
    staleTime: Infinity,
  });
}

export function useUpdateWorkspacePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<WorkspacePreference>) => api.patch<WorkspacePreference>('/workspace/preferences', data),
    onMutate: async (newPref) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.preferences() });
      const previousPref = queryClient.getQueryData<WorkspacePreference>(workspaceKeys.preferences());
      if (previousPref) {
        queryClient.setQueryData<WorkspacePreference>(workspaceKeys.preferences(), {
          ...previousPref,
          ...newPref,
        });
      }
      return { previousPref };
    },
    onError: (err, newPref, context) => {
      if (context?.previousPref) {
        queryClient.setQueryData(workspaceKeys.preferences(), context.previousPref);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.preferences() });
    },
  });
}

// --- WIDGETS ---

export function useWidgets(dashboardName: string) {
  return useQuery({
    queryKey: workspaceKeys.widgets(dashboardName),
    queryFn: () => api.get<WidgetPreference[]>(`/workspace/widgets/${dashboardName}`),
  });
}

export function useUpdateWidget() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ dashboardName, widgetId, data }: { dashboardName: string, widgetId: string, data: Partial<WidgetPreference> }) => 
      api.patch<WidgetPreference>(`/workspace/widgets/${dashboardName}/${widgetId}`, data),
    onMutate: async ({ dashboardName, widgetId, data }) => {
      await queryClient.cancelQueries({ queryKey: workspaceKeys.widgets(dashboardName) });
      const previousWidgets = queryClient.getQueryData<WidgetPreference[]>(workspaceKeys.widgets(dashboardName)) || [];
      
      const newWidgets = [...previousWidgets];
      const existingIdx = newWidgets.findIndex(w => w.widget_id === widgetId);
      if (existingIdx >= 0) {
        newWidgets[existingIdx] = { ...newWidgets[existingIdx], ...data };
      } else {
        newWidgets.push({ widget_id: widgetId, ...data } as WidgetPreference);
      }
      
      queryClient.setQueryData<WidgetPreference[]>(workspaceKeys.widgets(dashboardName), newWidgets);
      return { previousWidgets, dashboardName };
    },
    onError: (err, variables, context) => {
      if (context?.previousWidgets) {
        queryClient.setQueryData(workspaceKeys.widgets(context.dashboardName), context.previousWidgets);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.widgets(variables.dashboardName) });
    },
  });
}

// --- FAVORITES ---

export function useFavorites() {
  return useQuery({
    queryKey: workspaceKeys.favorites(),
    queryFn: () => api.get<Favorite[]>('/workspace/favorites'),
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { item_id: string, item_type: string }) => api.post<Favorite>('/workspace/favorites', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.favorites() });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (favId: number) => api.delete(`/workspace/favorites/${favId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workspaceKeys.favorites() });
    },
  });
}

// --- RECENT ---

export function useRecentActivity() {
  return useQuery({
    queryKey: workspaceKeys.recent(),
    queryFn: () => api.get<RecentActivity[]>('/workspace/recent'),
  });
}
