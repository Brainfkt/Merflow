import { create } from 'zustand';
import { FlowDocument, FlowNode, FlowEdge } from '../model/types';
import { MermaidParser } from '../parser/mermaidParser';

interface MerflowState {
  // Data
  code: string;
  document: FlowDocument;
  
  // UI State
  viewMode: 'preview' | 'canvas';
  selectedElementId: string | null;
  isSidebarOpen: boolean;

  // Actions
  setRawCode: (code: string) => void;
  updateModel: (document: FlowDocument) => void;
  setViewMode: (mode: 'preview' | 'canvas') => void;
  selectElement: (id: string | null) => void;
  toggleSidebar: () => void;
  
  // Helpers
  getSelectedNode: () => FlowNode | undefined;
  getSelectedEdge: () => FlowEdge | undefined;
}

const INITIAL_CODE = `flowchart TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Keep trying]
    D --> B`;

const INITIAL_DOC = MermaidParser.parse(INITIAL_CODE);

export const useMerflowStore = create<MerflowState>((set, get) => ({
  // Initial State
  code: INITIAL_CODE,
  document: INITIAL_DOC,
  viewMode: 'canvas',
  selectedElementId: null,
  isSidebarOpen: true,

  // Actions
  setRawCode: (code: string) => {
    try {
      // On parse le code pour mettre à jour le modèle en tâche de fond
      const document = MermaidParser.parse(code);
      set({ code, document, selectedElementId: null });
    } catch (error) {
      // En cas d'erreur de parsing, on garde le code mais on ne met pas à jour le modèle
      // (Politique de fallback : le preview Mermaid.js s'en chargera visuellement)
      set({ code });
      console.warn('Mermaid parsing failed, keeping current model.', error);
    }
  },

  updateModel: (document: FlowDocument) => {
    // Cette action sera couplée au Générateur plus tard pour mettre à jour le code
    set({ document, metadata: { ...document.metadata, isDirty: true } } as any);
  },

  setViewMode: (viewMode) => set({ viewMode }),

  selectElement: (selectedElementId) => set({ selectedElementId }),

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // Helpers
  getSelectedNode: () => {
    const { document, selectedElementId } = get();
    return document.nodes.find((n) => n.id === selectedElementId);
  },

  getSelectedEdge: () => {
    const { document, selectedElementId } = get();
    return document.edges.find((e) => e.id === selectedElementId);
  },
}));
