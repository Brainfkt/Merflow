import React, { useMemo, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Node, 
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMerflowStore } from '../../core/store/useMerflowStore';
import dagre from 'dagre';
import { NodeShape } from '../../core/model/types';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 150;
const nodeHeight = 50;

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const isHorizontal = direction === 'LR' || direction === 'RL';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const getShapeStyle = (shape: NodeShape): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    background: '#18181b',
    color: '#e4e4e7',
    border: '1px solid #3f3f46',
    padding: '10px',
    fontSize: '12px',
    width: nodeWidth,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (shape) {
    case 'rounded':
      return { ...baseStyle, borderRadius: '20px' };
    case 'circle':
      return { ...baseStyle, borderRadius: '50%', width: 80, height: 80 };
    case 'rhombus':
      return { 
        ...baseStyle, 
        transform: 'rotate(45deg)', 
        width: 100, 
        height: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };
    case 'stadium':
      return { ...baseStyle, borderRadius: '25px' };
    case 'cylindrical':
      return { 
        ...baseStyle, 
        borderRadius: '4px',
        boxShadow: 'inset -5px 0 5px -2px rgba(255,255,255,0.1)' // Fake cylinder effect
      };
    case 'subroutine':
      return { 
        ...baseStyle, 
        borderLeft: '4px solid #3f3f46', 
        borderRight: '4px solid #3f3f46' 
      };
    default:
      return { ...baseStyle, borderRadius: '4px' };
  }
};

export const MerflowCanvas: React.FC = () => {
  const { document, viewMode, selectElement } = useMerflowStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Map FlowDocument to React Flow nodes/edges
  useEffect(() => {
    if (!document) return;

    const rfNodes: Node[] = document.nodes.map((n) => {
      const shapeStyle = getShapeStyle(n.shape);
      
      return {
        id: n.id,
        data: { 
          label: n.shape === 'rhombus' 
            ? <div style={{ transform: 'rotate(-45deg)' }}>{n.label}</div> 
            : n.label 
        },
        position: { x: 0, y: 0 }, // Initial position
        type: 'default',
        style: shapeStyle
      };
    });

    const rfEdges: Edge[] = document.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: e.type === 'dotted' ? 'step' : 'default',
      style: {
        stroke: '#52525b',
        strokeDasharray: e.type === 'dotted' ? '5,5' : undefined,
        strokeWidth: e.type === 'thick' ? 3 : 1,
      },
      animated: e.type === 'dotted'
    }));

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      rfNodes,
      rfEdges,
      document.direction
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [document, setNodes, setEdges]);

  if (viewMode !== 'canvas') return null;

  return (
    <div className="h-full w-full bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => selectElement(node.id)}
        onEdgeClick={(_, edge) => selectElement(edge.id)}
        onPaneClick={() => selectElement(null)}
        fitView
        colorMode="dark"
      >
        <Background color="#27272a" variant="dots" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
