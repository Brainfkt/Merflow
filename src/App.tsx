import React from 'react';
import { MermaidEditor } from './features/editor/MermaidEditor';
import { MermaidPreview } from './features/preview/MermaidPreview';
import { MerflowCanvas } from './features/canvas/MerflowCanvas';
import { PropertyInspector } from './features/inspector/PropertyInspector';
import { useMerflowStore } from './core/store/useMerflowStore';
import { FileCode, Play, MousePointer2, Save, Download, Undo2, Redo2, Moon, Sun } from 'lucide-react';

const App: React.FC = () => {
  const { viewMode, setViewMode, toggleSidebar, isSidebarOpen } = useMerflowStore();

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-zinc-200 overflow-hidden">
      {/* Topbar */}
      <header className="h-12 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <h1 className="font-bold text-lg tracking-tighter text-blue-500">MERFLOW</h1>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors" title="New File"><FileCode size={18} /></button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors" title="Save"><Save size={18} /></button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors" title="Export"><Download size={18} /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-zinc-800/50 p-1 rounded-lg border border-zinc-700">
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'preview' ? 'bg-zinc-700 text-white shadow-sm' : 'hover:text-white'}`}
          >
            <Play size={14} /> Preview
          </button>
          <button 
            onClick={() => setViewMode('canvas')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-all ${viewMode === 'canvas' ? 'bg-zinc-700 text-white shadow-sm' : 'hover:text-white'}`}
          >
            <MousePointer2 size={14} /> Canvas
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 mr-4">
            <button className="p-1.5 hover:bg-zinc-800 rounded-md opacity-50"><Undo2 size={18} /></button>
            <button className="p-1.5 hover:bg-zinc-800 rounded-md opacity-50"><Redo2 size={18} /></button>
          </div>
          <button className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors"><Sun size={18} /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Editor */}
        <div className="w-1/3 min-w-[300px] h-full">
          <MermaidEditor />
        </div>

        {/* Center Zone: Preview or Canvas */}
        <div className="flex-1 h-full relative">
          {viewMode === 'preview' ? <MermaidPreview /> : <MerflowCanvas />}
        </div>

        {/* Right Panel: Inspector */}
        {isSidebarOpen && <PropertyInspector />}
      </main>
    </div>
  );
};

export default App;
