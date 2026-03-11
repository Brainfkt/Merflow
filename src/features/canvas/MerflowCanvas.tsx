import React from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMerflowStore } from '../../core/store/useMerflowStore';

export const MerflowCanvas: React.FC = () => {
  const { viewMode } = useMerflowStore();

  if (viewMode !== 'canvas') return null;

  return (
    <div className="h-full w-full bg-zinc-900">
      <ReactFlow
        nodes={[]}
        edges={[]}
        fitView
      >
        <Background color="#333" />
        <Controls />
      </ReactFlow>
    </div>
  );
};
