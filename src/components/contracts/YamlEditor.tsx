"use client";

import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { configureMonacoYaml } from 'monaco-yaml';
import { contractJsonSchema } from '@/schemas/monacoYamlSchema';

interface YamlEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  readOnly?: boolean;
}

export function YamlEditor({ value, onChange, readOnly = false }: YamlEditorProps) {
  const isConfigured = useRef(false);

  const handleBeforeMount = (monacoInstance: Monaco) => {
    if (!isConfigured.current) {
      configureMonacoYaml(monacoInstance, {
        enableSchemaRequest: true,
        schemas: [
          {
            uri: contractJsonSchema.uri,
            fileMatch: ['*'],
            schema: contractJsonSchema.schema,
          },
        ],
      });
      isConfigured.current = true;
    }
  };

  return (
    <div className="w-full h-full border-l border-border bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="yaml"
        theme="vs-dark"
        value={value}
        onChange={onChange}
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: true },
          readOnly: readOnly,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          padding: { top: 16 },
          fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
          fontSize: 14,
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
}
