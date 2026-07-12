"use client";

import React, { useRef } from 'react';
import { DiffEditor, useMonaco, Monaco } from '@monaco-editor/react';
import { configureMonacoYaml } from 'monaco-yaml';
import { contractJsonSchema } from '@/schemas/monacoYamlSchema';

interface DiffViewerProps {
  original: string;
  modified: string;
  readOnly?: boolean;
}

export function DiffViewer({ original, modified, readOnly = true }: DiffViewerProps) {
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
    <div className="w-full h-full border border-border bg-[#1e1e1e] rounded-lg overflow-hidden">
      <DiffEditor
        height="100%"
        language="yaml"
        theme="vs-dark"
        original={original}
        modified={modified}
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
          renderSideBySide: true,
        }}
      />
    </div>
  );
}
