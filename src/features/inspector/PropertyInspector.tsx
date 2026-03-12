import React from 'react';
import { useMerflowStore } from '../../core/store/useMerflowStore';
import { NodeShape } from '../../core/model/types';

export const PropertyInspector: React.FC = () => {
  const { selectedElementId, getSelectedNode, getSelectedEdge, updateNode, updateEdge } = useMerflowStore();
  const node = getSelectedNode();
  const edge = getSelectedEdge();

  return (
    <div className="h-full w-72 border-l border-zinc-800 bg-zinc-900 p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-zinc-400 mb-6 uppercase tracking-wider border-b border-zinc-800 pb-2">Inspector</h2>
      
      {!selectedElementId ? (
        <p className="text-zinc-500 italic text-sm">Select an element to edit properties.</p>
      ) : (
        <div className="space-y-6">
          {/* Common ID Field */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">ID</label>
            <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-sm font-mono text-zinc-400 select-all">
              {selectedElementId}
            </div>
          </div>

          {/* Node Properties */}
          {node && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Label</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-800 p-2 rounded text-sm text-zinc-200 outline-none border border-zinc-700 focus:border-blue-500 transition-colors"
                  value={node.label}
                  onChange={(e) => updateNode(node.id, { label: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Shape</label>
                <select 
                  className="w-full bg-zinc-800 p-2 rounded text-sm text-zinc-200 outline-none border border-zinc-700 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                  value={node.shape}
                  onChange={(e) => updateNode(node.id, { shape: e.target.value as NodeShape })}
                >
                  <option value="rectangle">Rectangle []</option>
                  <option value="rounded">Rounded ()</option>
                  <option value="circle">Circle (())</option>
                  <option value="rhombus">Rhombus {'{}'}</option>
                  <option value="asymmetric">Asymmetric {'>]'}</option>
                  <option value="hexagon">Hexagon {'{{}}'}</option>
                  <option value="subroutine">Subroutine [[ ]]</option>
                  <option value="cylindrical">Cylindrical [()]</option>
                  <option value="stadium">Stadium ([ ])</option>
                </select>
              </div>
            </>
          )}

          {/* Edge Properties */}
          {edge && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Label</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-800 p-2 rounded text-sm text-zinc-200 outline-none border border-zinc-700 focus:border-blue-500 transition-colors"
                  value={edge.label || ''}
                  placeholder="No label"
                  onChange={(e) => updateEdge(edge.id, { label: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase">Style</label>
                <select 
                  className="w-full bg-zinc-800 p-2 rounded text-sm text-zinc-200 outline-none border border-zinc-700 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                  value={edge.type}
                  onChange={(e) => updateEdge(edge.id, { type: e.target.value as any })}
                >
                  <option value="default">Solid (--&gt;)</option>
                  <option value="dotted">Dotted (-.-&gt;)</option>
                  <option value="thick">Thick (==&gt;)</option>
                </select>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
