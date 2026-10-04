import { create } from 'zustand';
import { apiClient } from '@/lib/axios';

export interface User {
  id: number;
  email: string;
  full_name?: string;
  is_active: boolean;
  mfa_enabled?: boolean;
  roles?: string[];
}

export interface Workspace {
  id: number;
  name: string;
  organization_id: number;
}

interface AppState {
  isRightSidebarOpen: boolean;
  rightSidebarTab: 'copilot' | 'notifications' | 'tasks' | 'history' | 'assets';
  isCommandCenterOpen: boolean;
  workspaceHealth: number;
  activeJobs: number;
  currentUser: User | null;
  workspaces: Workspace[];
  activeWorkspaceId: number | null;
  
  // Actions
  toggleRightSidebar: () => void;
  setRightSidebarTab: (tab: AppState['rightSidebarTab']) => void;
  toggleCommandCenter: () => void;
  setCommandCenterOpen: (open: boolean) => void;
  fetchCurrentUser: () => Promise<void>;
  fetchWorkspaces: () => Promise<void>;
  setActiveWorkspace: (id: number) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  isRightSidebarOpen: false,
  rightSidebarTab: 'copilot',
  isCommandCenterOpen: false,
  workspaceHealth: 97, // Mock starting health
  activeJobs: 3,
  currentUser: {
    id: 1,
    email: "mohan.pratap@datapact.ai",
    full_name: "Mohan Pratap",
    is_active: true,
    mfa_enabled: false,
    roles: ["admin"]
  },
  workspaces: [
    { id: 1, name: "Mohan's Workspace", organization_id: 1 }
  ],
  activeWorkspaceId: 1,

  toggleRightSidebar: () => set((state) => ({ isRightSidebarOpen: !state.isRightSidebarOpen })),
  setRightSidebarTab: (tab) => set({ rightSidebarTab: tab, isRightSidebarOpen: true }),
  toggleCommandCenter: () => set((state) => ({ isCommandCenterOpen: !state.isCommandCenterOpen })),
  setCommandCenterOpen: (open) => set({ isCommandCenterOpen: open }),
  
  fetchCurrentUser: async () => {
    try {
      const res = await apiClient.get('/auth/me');
      set({ currentUser: res.data });
      // After fetching user, fetch their workspaces
      await get().fetchWorkspaces();
    } catch (error) {
      console.error("Failed to fetch user", error);
      // Fallback mock user: Mohan Pratap
      set({ 
        currentUser: {
          id: 1,
          email: "mohan.pratap@datapact.ai",
          full_name: "Mohan Pratap",
          is_active: true,
          mfa_enabled: false,
          roles: ["admin"]
        },
        workspaces: [
          { id: 1, name: "Mohan's Workspace", organization_id: 1 }
        ],
        activeWorkspaceId: 1
      });
    }
  },
  
  fetchWorkspaces: async () => {
    try {
      const res = await apiClient.get('/workspace');
      set({ workspaces: res.data });
      // Default to first workspace if none active
      if (res.data.length > 0 && !get().activeWorkspaceId) {
        set({ activeWorkspaceId: res.data[0].id });
        localStorage.setItem('DATAPACT_WORKSPACE_ID', String(res.data[0].id));
      }
    } catch (error) {
      console.error("Failed to fetch workspaces", error);
    }
  },
  
  setActiveWorkspace: async (id: number) => {
    try {
      await apiClient.post(`/workspace/${id}/switch`);
      set({ activeWorkspaceId: id });
      localStorage.setItem('DATAPACT_WORKSPACE_ID', String(id));
      // Re-fetch data relevant to the new workspace (e.g., health, jobs) if needed
    } catch (error) {
      console.error("Failed to switch workspace", error);
    }
  },
  
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.error("Logout request failed", e);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('DATAPACT_WORKSPACE_ID');
      set({ currentUser: null, workspaces: [], activeWorkspaceId: null });
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }
}));
