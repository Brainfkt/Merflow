export type FlowDirection = 'TB' | 'BT' | 'LR' | 'RL';

export type NodeShape = 
  | 'rectangle' 
  | 'rounded' 
  | 'stadium' 
  | 'subroutine' 
  | 'cylindrical' 
  | 'circle' 
  | 'asymmetric' 
  | 'rhombus' 
  | 'hexagon' 
  | 'parallelogram' 
  | 'parallelogram_alt' 
  | 'trapezoid' 
  | 'trapezoid_alt';

export interface FlowNode {
  id: string;
  label: string;
  shape: NodeShape;
  subgraphId?: string;
  styles?: Record<string, string>;
  classes?: string[];
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'default' | 'dotted' | 'thick';
  arrowType: 'none' | 'arrow' | 'cross' | 'circle';
}

export interface FlowSubgraph {
  id: string;
  label: string;
  nodes: string[]; // IDs des nœuds enfants
}

export interface FlowDocument {
  version: string;
  direction: FlowDirection;
  nodes: FlowNode[];
  edges: FlowEdge[];
  subgraphs: FlowSubgraph[];
  metadata: {
    title?: string;
    filePath?: string;
    isDirty: boolean;
  };
}
