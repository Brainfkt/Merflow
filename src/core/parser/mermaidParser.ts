import { FlowDocument, FlowDirection, FlowNode, FlowEdge, NodeShape, FlowSubgraph } from '../model/types';

/**
 * Parser Mermaid ciblé V1 pour flowchart.
 * Utilise des Regex pour extraire la topologie de manière robuste.
 */
export class MermaidParser {
  private static DIRECTION_REGEX = /flowchart\s+(TB|TD|BT|RL|LR)/i;
  
  // Regex pour les nœuds: id[label] ou id(label) ou id((label)) etc.
  // Supporte les formes courantes: [], (), (()), ([ ]), [[ ]], [( )], {}, {{ }}, [/ /], [\ \], etc.
  private static NODE_REGEX = /^([a-zA-Z0-9_-]+)(?:([\[\(\{\>])(?:[\(\[\|])?([^\]\)\}\|]+)(?:[\)\]\|])?([\]\)\}\>]))?$/;

  // Regex pour les arêtes: source -- label --> target ou source --> target
  // Supporte -->, ---, -.-, ==> etc.
  private static EDGE_REGEX = /^([a-zA-Z0-9_-]+)\s*(?:-+|={2,}|\.-+)\s*(?:([^-\.>\[\s][^-\.>\[]*))?\s*(?:-+|={2,}|\.-+)>\s*([a-zA-Z0-9_-]+)$/;

  /**
   * Parse une chaîne Mermaid flowchart en FlowDocument.
   */
  public static parse(code: string): FlowDocument {
    const lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const doc: FlowDocument = {
      version: '1.0.0',
      direction: 'TB',
      nodes: [],
      edges: [],
      subgraphs: [],
      metadata: {
        isDirty: false
      }
    };

    // 1. Détecter la direction
    const firstLine = lines.find(l => this.DIRECTION_REGEX.test(l));
    if (firstLine) {
      const match = firstLine.match(this.DIRECTION_REGEX);
      if (match) {
        let dir = match[1].toUpperCase() as FlowDirection;
        if (dir === ('TD' as any)) dir = 'TB'; // TD est un alias de TB
        doc.direction = dir;
      }
    }

    // Map pour éviter les doublons de nœuds et stocker les infos de base
    const nodeMap = new Map<string, FlowNode>();
    let currentSubgraph: FlowSubgraph | null = null;

    // 2. Parcourir les lignes pour extraire nœuds et arêtes
    for (const line of lines) {
      if (this.DIRECTION_REGEX.test(line)) continue;

      // Gestion des subgraphs
      if (line.startsWith('subgraph')) {
        const match = line.match(/subgraph\s+([a-zA-Z0-9_-]+)(?:\s*\[(.*?)\])?/);
        if (match) {
          const id = match[1];
          const label = match[2] || id;
          currentSubgraph = { id, label, nodes: [] };
          doc.subgraphs.push(currentSubgraph);
        }
        continue;
      }

      if (line.startsWith('end')) {
        currentSubgraph = null;
        continue;
      }

      // Tenter de parser une arête
      const edgeMatch = line.match(/([a-zA-Z0-9_-]+)\s*(-+>|--\s*.*?\s*-->|-.*?->|==>|==\s*.*?\s*==>)\s*([a-zA-Z0-9_-]+)/);
      if (edgeMatch) {
        const sourceId = edgeMatch[1];
        const targetId = edgeMatch[3];
        const transition = edgeMatch[2];
        
        let label = '';
        if (transition.includes('--')) {
           const labelMatch = transition.match(/--\s*(.*?)\s*--/);
           if (labelMatch) label = labelMatch[1].trim();
        }

        doc.edges.push({
          id: `e${doc.edges.length + 1}`,
          source: sourceId,
          target: targetId,
          label: label || undefined,
          type: transition.includes('.') ? 'dotted' : transition.includes('=') ? 'thick' : 'default',
          arrowType: 'arrow'
        });

        // S'assurer que les nœuds existent
        this.ensureNode(sourceId, nodeMap, currentSubgraph);
        this.ensureNode(targetId, nodeMap, currentSubgraph);
        continue;
      }

      // Tenter de parser un nœud seul (ex: A[Label])
      const nodeMatch = line.match(/^([a-zA-Z0-9_-]+)(?:([\[\(\{\>])([^\]\)\}\>]+)([\]\)\}\>]))?$/);
      if (nodeMatch) {
        const id = nodeMatch[1];
        const openChar = nodeMatch[2];
        const label = nodeMatch[3];
        const closeChar = nodeMatch[4];

        const node: FlowNode = {
          id,
          label: label || id,
          shape: this.mapShape(openChar, closeChar),
          subgraphId: currentSubgraph?.id
        };
        
        // Si le nœud existe déjà (par ex. via une arête précédente), on met à jour ses infos
        if (nodeMap.has(id)) {
          const existing = nodeMap.get(id)!;
          existing.label = node.label;
          existing.shape = node.shape;
          if (currentSubgraph) {
             existing.subgraphId = currentSubgraph.id;
             if (!currentSubgraph.nodes.includes(id)) {
               currentSubgraph.nodes.push(id);
             }
          }
        } else {
          nodeMap.set(id, node);
          if (currentSubgraph) {
            currentSubgraph.nodes.push(id);
          }
        }
      }
    }

    doc.nodes = Array.from(nodeMap.values());
    return doc;
  }

  private static ensureNode(id: string, map: Map<string, FlowNode>, currentSubgraph: FlowSubgraph | null) {
    if (!map.has(id)) {
      map.set(id, {
        id,
        label: id,
        shape: 'rectangle',
        subgraphId: currentSubgraph?.id
      });
      if (currentSubgraph) {
        currentSubgraph.nodes.push(id);
      }
    } else if (currentSubgraph) {
      // Si le nœud existe mais qu'on le rencontre dans un subgraph, on l'associe
      const node = map.get(id)!;
      if (!node.subgraphId) {
        node.subgraphId = currentSubgraph.id;
        if (!currentSubgraph.nodes.includes(id)) {
          currentSubgraph.nodes.push(id);
        }
      }
    }
  }

  private static mapShape(open?: string, close?: string): NodeShape {
    if (!open || !close) return 'rectangle';
    
    const combined = open + close;
    switch (combined) {
      case '[]': return 'rectangle';
      case '()': return 'rounded';
      case '((': return 'circle';
      case '{}': return 'rhombus';
      case '> ]': return 'asymmetric';
      case '{{}}': return 'hexagon';
      case '[[ ]]': return 'subroutine';
      case '[()]': return 'cylindrical';
      default: return 'rectangle';
    }
  }
}
