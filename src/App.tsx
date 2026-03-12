import React from 'react';
import { MermaidEditor } from './features/editor/MermaidEditor';
import { MermaidPreview } from './features/preview/MermaidPreview';
import { MerflowCanvas } from './features/canvas/MerflowCanvas';
import { PropertyInspector } from './features/inspector/PropertyInspector';
import { useMerflowStore } from './core/store/useMerflowStore';
import { FileCode, Play, MousePointer2, Save, Download, Undo2, Redo2, PanelRight } from 'lucide-react';

const App: React.FC = () => {
  const { viewMode, setViewMode, toggleSidebar, isSidebarOpen, reset } = useMerflowStore();

  const handleExportSVG = () => {
    const svgElement = document.querySelector('.mermaid svg');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'diagram.svg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-200 overflow-hidden select-none">
      {/* Topbar */}
      <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-black text-white text-[10px] shadow-lg shadow-blue-500/20">MF</div>
            <h1 className="font-bold text-sm tracking-tight hidden sm:block">MERFLOW</h1>
          </div>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-1">
            <button 
              onClick={reset}
              className="p-1.5 hover:bg-zinc-800 rounded-md transition-all text-zinc-400 hover:text-white" 
              title="New File"
            >
              <FileCode size={18} />
            </button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md transition-all text-zinc-400 hover:text-white" title="Save">
              <Save size={18} />
            </button>
            <button 
              onClick={handleExportSVG}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-700 cursor-not-allowed'}`} 
              title="Export SVG (Preview mode only)"
              disabled={viewMode !== 'preview'}
            >
              <Download size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 shadow-inner">
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-md border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Play size={13} /> PREVIEW
          </button>
          <button 
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${viewMode === 'canvas' ? 'bg-zinc-800 text-white shadow-md border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <MousePointer2 size={13} /> CANVAS
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 mr-2">
            <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-700 cursor-not-allowed"><Undo2 size={16} /></button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md text-zinc-700 cursor-not-allowed"><Redo2 size={16} /></button>
          </div>
          <div className="h-4 w-px bg-zinc-800 mx-1" />
          <button 
            onClick={toggleSidebar}
            className={`p-1.5 rounded-md transition-all ${isSidebarOpen ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white border border-transparent'}`}
            title="Toggle Inspector"
          >
            <PanelRight size={18} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden w-full h-full relative">
        {/* Left Panel: Editor */}
        <div className="w-[450px] min-w-[300px] h-full flex flex-col border-r border-zinc-800 shrink-0">
          <MermaidEditor />
        </div>

        {/* Center Zone: Preview or Canvas */}
        <div className="flex-1 h-full relative bg-zinc-950 overflow-hidden">
          {viewMode === 'preview' ? (
            <div className="absolute inset-0 w-full h-full">
              <MermaidPreview />
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <MerflowCanvas />
            </div>
          )}
        </div>

        {/* Right Panel: Inspector */}
        {isSidebarOpen && (
          <aside className="w-80 h-full border-l border-zinc-800 bg-zinc-900/50 backdrop-blur-sm shrink-0">
            <PropertyInspector />
          </aside>
        )}
      </main>
    </div>
  );
};

export default App;

