import { create } from 'zustand';

export interface Asset {
  id: string;
  name: string;
  type: string;
  children?: Asset[];
}

interface ValidationIssue {
  line: number;
  message: string;
  type: 'error' | 'warning' | 'suggestion';
}

interface AIStudioState {
  // Navigation & Layout
  selectedAssetId: string | null;
  activeDrawer: 'none' | 'explainability' | 'copilot';
  isAssetBrowserOpen: boolean;
  
  // Contract State
  currentYaml: string;
  isDirty: boolean;
  validationIssues: ValidationIssue[];
  
  // AI State
  isGenerating: boolean;
  selectedRecommendationId: string | null;
  
  // Actions
  setSelectedAssetId: (id: string | null) => void;
  setActiveDrawer: (drawer: 'none' | 'explainability' | 'copilot') => void;
  toggleAssetBrowser: () => void;
  setCurrentYaml: (yaml: string) => void;
  setValidationIssues: (issues: ValidationIssue[]) => void;
  setIsGenerating: (generating: boolean) => void;
  setSelectedRecommendationId: (id: string | null) => void;
  resetState: () => void;
}

export const useAIStudioStore = create<AIStudioState>((set) => ({
  selectedAssetId: null,
  activeDrawer: 'none',
  isAssetBrowserOpen: true,
  
  currentYaml: '',
  isDirty: false,
  validationIssues: [],
  
  isGenerating: false,
  selectedRecommendationId: null,
  
  setSelectedAssetId: (id) => set({ selectedAssetId: id, currentYaml: '', isDirty: false, validationIssues: [] }),
  setActiveDrawer: (drawer) => set({ activeDrawer: drawer }),
  toggleAssetBrowser: () => set((state) => ({ isAssetBrowserOpen: !state.isAssetBrowserOpen })),
  
  setCurrentYaml: (yaml) => set({ currentYaml: yaml, isDirty: true }),
  setValidationIssues: (issues) => set({ validationIssues: issues }),
  
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  setSelectedRecommendationId: (id) => set({ selectedRecommendationId: id }),
  
  resetState: () => set({
    selectedAssetId: null,
    activeDrawer: 'none',
    currentYaml: '',
    isDirty: false,
    validationIssues: [],
    isGenerating: false,
    selectedRecommendationId: null
  }),
}));
