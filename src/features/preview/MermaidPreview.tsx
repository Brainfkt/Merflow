import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useMerflowStore } from '../../core/store/useMerflowStore';
import { AlertCircle } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter, sans-serif',
});

export const MermaidPreview: React.FC = () => {
  const { code } = useMerflowStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current) return;
      
      try {
        setError(null);
        containerRef.current.innerHTML = ''; // Clear previous content
        
        // Generate a unique ID for each render to avoid conflicts
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        
        containerRef.current.innerHTML = svg;
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(err instanceof Error ? err.message : 'Invalid Mermaid syntax');
      }
    };

    renderMermaid();
  }, [code]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-950 overflow-auto p-8 relative">
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-900/20 border border-red-500/50 p-3 rounded-lg flex items-start gap-3 text-red-400 text-sm z-20 animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Rendering Error</p>
            <p className="opacity-80 line-clamp-2">{error}</p>
          </div>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={`mermaid max-w-full transition-opacity duration-300 ${error ? 'opacity-30 grayscale' : 'opacity-100'}`} 
      />
      
      {!code.trim() && (
        <div className="text-zinc-500 flex flex-col items-center gap-2">
          <p>No content to display.</p>
        </div>
      )}
    </div>
  );
};
