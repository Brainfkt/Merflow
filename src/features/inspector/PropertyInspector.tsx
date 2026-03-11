import React from 'react';
import { useMerflowStore } from '../../core/store/useMerflowStore';

export const PropertyInspector: React.FC = () => {
  const { selectedElementId, getSelectedNode } = useMerflowStore();
  const node = getSelectedNode();

  return (
    <div className="h-full w-64 border-l border-zinc-800 bg-zinc-900 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider">Inspector</h2>
      {!selectedElementId ? (
        <p className="text-zinc-500 italic text-sm">Select an element to edit properties.</p>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">ID</label>
            <div className="bg-zinc-800 p-2 rounded text-sm font-mono text-zinc-300">{selectedElementId}</div>
          </div>
          {node && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Label</label>
              <input 
                type="text" 
                className="w-full bg-zinc-800 p-2 rounded text-sm text-zinc-200 outline-none border border-transparent focus:border-blue-500"
                value={node.label}
                readOnly
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
