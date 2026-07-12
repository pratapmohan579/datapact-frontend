'use client';

import React, { useState } from 'react';
import { Cpu, Save, CheckCircle } from 'lucide-react';

const MODELS = [
  { id: 'gpt-4o', name: 'OpenAI GPT-4o', provider: 'OpenAI' },
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'Anthropic' },
  { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'gemini-1.5-pro', name: 'Google Gemini 1.5 Pro', provider: 'Google' },
  { id: 'ollama/llama3', name: 'Llama 3 (Local)', provider: 'Ollama' },
];

export default function AIModelsSettingsPage() {
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    // In a real app, send to backend to update user/workspace settings
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">AI Models</h3>
        <p className="text-sm text-muted-foreground">
          Configure which Large Language Model powers DataPact Copilot and Rule Generation.
        </p>
      </div>
      <hr className="border-border" />

      <div className="space-y-4">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Default Model Provider
        </label>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODELS.map((model) => (
            <div 
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedModel === model.id 
                  ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500' 
                  : 'border-border hover:border-gray-400 bg-card'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Cpu className={`w-5 h-5 ${selectedModel === model.id ? 'text-blue-500' : 'text-muted-foreground'}`} />
                {selectedModel === model.id && <CheckCircle className="w-4 h-4 text-blue-500" />}
              </div>
              <h4 className="font-semibold text-sm">{model.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{model.provider}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium transition-colors"
        >
          {isSaved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? 'Saved' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
