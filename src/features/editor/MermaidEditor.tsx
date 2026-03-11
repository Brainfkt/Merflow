import React from 'react';
import Editor from '@monaco-editor/react';
import { useMerflowStore } from '../../core/store/useMerflowStore';

export const MermaidEditor: React.FC = () => {
  const { code, setRawCode } = useMerflowStore();

  return (
    <div className="h-full w-full border-r border-zinc-800">
      <Editor
        height="100%"
        defaultLanguage="mermaid"
        theme="vs-dark"
        value={code}
        onChange={(value) => setRawCode(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 16 }
        }}
      />
    </div>
  );
};
