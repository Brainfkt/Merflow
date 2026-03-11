import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useMerflowStore } from '../../core/store/useMerflowStore';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
});

export const MermaidPreview: React.FC = () => {
  const { code } = useMerflowStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = `<div class="mermaid">${code}</div>`;
      mermaid.contentLoaded();
    }
  }, [code]);

  return (
    <div className="h-full w-full flex items-center justify-center bg-zinc-950 overflow-auto p-4">
      <div ref={containerRef} className="max-w-full" />
    </div>
  );
};
