import { create } from 'zustand';
import YAML from 'yaml';

export type ContractStatus = 'draft' | 'review' | 'approved' | 'published' | 'paused' | 'deprecated' | 'archived';

export interface Dataset {
  source: string;
  database: string;
  schema: string;
  table: string;
}

export interface Rule {
  type: string;
  category?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  description?: string;
  [key: string]: unknown;
}

export interface ContractVersion {
  version: number;
  yaml: string;
  created_at: string;
  created_by: string;
  change_summary: string;
}

export interface ContractState {
  id?: number;
  contract_name: string;
  owner: string;
  status: ContractStatus;
  dataset: Dataset;
  rules: Rule[];
}

interface ContractStore {
  contract: ContractState;
  yaml: string;
  isDirty: boolean;
  isYamlValid: boolean;
  yamlError: string | null;
  lastSavedAt: Date | null;
  versions: ContractVersion[];
  selectedVersion: number | null;
  
  // Actions
  setContract: (updater: (prev: ContractState) => ContractState) => void;
  setYaml: (yamlString: string) => void;
  loadContract: (contract: ContractState, yamlString?: string, versions?: ContractVersion[]) => void;
  markSaved: () => void;
  setSelectedVersion: (version: number | null) => void;
}

const defaultContract: ContractState = {
  contract_name: '',
  owner: '',
  status: 'draft',
  dataset: {
    source: 'snowflake',
    database: '',
    schema: '',
    table: ''
  },
  rules: []
};

const contractToYaml = (contract: ContractState): string => {
  return YAML.stringify(contract, { sortMapEntries: false, lineWidth: 120 });
};

export const useContractStore = create<ContractStore>((set) => ({
  contract: defaultContract,
  yaml: contractToYaml(defaultContract),
  isDirty: false,
  isYamlValid: true,
  yamlError: null,
  lastSavedAt: null,
  versions: [],
  selectedVersion: null,

  setContract: (updater: (prev: ContractState) => ContractState) => {
    set((state) => {
      const newContract = updater(state.contract);
      return {
        contract: newContract,
        yaml: contractToYaml(newContract),
        isDirty: true,
        isYamlValid: true,
        yamlError: null
      };
    });
  },

  setYaml: (yamlString) => {
    set((state) => {
      try {
        const parsed = YAML.parse(yamlString);
        if (parsed && typeof parsed === 'object') {
          // Sync parsed YAML to visual builder state
          return {
            yaml: yamlString,
            contract: { ...state.contract, ...parsed },
            isDirty: true,
            isYamlValid: true,
            yamlError: null
          };
        }
        throw new Error("Invalid structure");
      } catch (err: unknown) {
        const error = err as Error;
        // If invalid, we still keep the YAML string for the editor, but don't update the contract visual state
        return {
          yaml: yamlString,
          isDirty: true,
          isYamlValid: false,
          yamlError: error.message || "Invalid YAML"
        };
      }
    });
  },

  loadContract: (contract, yamlString, versions = []) => {
    set({
      contract,
      yaml: yamlString || contractToYaml(contract),
      isDirty: false,
      isYamlValid: true,
      yamlError: null,
      versions,
      selectedVersion: null
    });
  },

  markSaved: () => {
    set((state) => {
      // Mock version creation on save
      const newVersionNum = state.versions.length > 0 ? state.versions[0].version + 1 : 1;
      const newVersion: ContractVersion = {
        version: newVersionNum,
        yaml: state.yaml,
        created_at: new Date().toISOString(),
        created_by: "current_user@company.com",
        change_summary: "Manual save"
      };
      
      return {
        isDirty: false,
        lastSavedAt: new Date(),
        versions: [newVersion, ...state.versions]
      };
    });
  },

  setSelectedVersion: (version) => {
    set({ selectedVersion: version });
  }
}));
