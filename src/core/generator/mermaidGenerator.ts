import { FlowDocument, FlowNode, FlowEdge, NodeShape } from '../model/types';

/**
 * Générateur Mermaid pour flowchart.
 * Transforme le modèle structuré FlowDocument en code Mermaid textuel.
 */
export class MermaidGenerator {
  /**
   * Génère le code Mermaid à partir d'un FlowDocument.
   */
  public static generate(doc: FlowDocument): string {
    const lines: string[] = [];

    // 1. En-tête avec direction
    lines.push(`flowchart ${doc.direction}`);

    // 2. Gestion des subgraphs (V1 basique)
    if (doc.subgraphs && doc.subgraphs.length > 0) {
      doc.subgraphs.forEach(sub => {
        lines.push(`    subgraph ${sub.id} [${sub.label}]`);
        // On génère les nœuds appartenant au subgraph ici
        const subgraphNodes = doc.nodes.filter(n => sub.nodes.includes(n.id));
        subgraphNodes.forEach(node => {
          lines.push(`        ${this.generateNode(node)}`);
        });
        lines.push('    end');
      });
    }

    // 3. Nœuds racine (ceux qui ne sont pas dans un subgraph)
    const rootNodes = doc.nodes.filter(n => !n.subgraphId);
    rootNodes.forEach(node => {
      lines.push(`    ${this.generateNode(node)}`);
    });

    // 4. Arêtes
    doc.edges.forEach(edge => {
      lines.push(`    ${this.generateEdge(edge)}`);
    });

    return lines.join('\n');
  }

  /**
   * Génère la syntaxe d'un nœud : id[label], id(label), etc.
   */
  private static generateNode(node: FlowNode): string {
    const [open, close] = this.getShapeCharacters(node.shape);
    // Si le label est identique à l'ID, on peut simplifier la sortie Mermaid
    if (node.id === node.label && node.shape === 'rectangle') {
      return node.id;
    }
    return `${node.id}${open}${node.label}${close}`;
  }

  /**
   * Génère la syntaxe d'une arête : A --> B, A -- label --> B, etc.
   */
  private static generateEdge(edge: FlowEdge): string {
    let arrow = '-->';
    
    if (edge.type === 'dotted') {
      arrow = '-.->';
    } else if (edge.type === 'thick') {
      arrow = '==>';
    }

    if (edge.label) {
      // Format: A -- label --> B ou A -. label .-> B
      if (edge.type === 'dotted') {
        return `${edge.source} -. ${edge.label} .-> ${edge.target}`;
      } else if (edge.type === 'thick') {
        return `${edge.source} == ${edge.label} ==> ${edge.target}`;
      } else {
        return `${edge.source} -- ${edge.label} --> ${edge.target}`;
      }
    }

    return `${edge.source} ${arrow} ${edge.target}`;
  }

  /**
   * Mappe le type de forme vers les caractères Mermaid correspondants.
   */
  private static getShapeCharacters(shape: NodeShape): [string, string] {
    switch (shape) {
      case 'rectangle': return ['[', ']'];
      case 'rounded': return ['(', ')'];
      case 'circle': return ['((', '))'];
      case 'rhombus': return ['{', '}'];
      case 'asymmetric': return ['>', ']'];
      case 'hexagon': return ['{{', '}}'];
      case 'subroutine': return ['[[', ']]'];
      case 'cylindrical': return ['[(', ')]'];
      case 'stadium': return ['([', '])'];
      default: return ['[', ']'];
    }
  }
}
