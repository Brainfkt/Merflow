# GEMINI.md - Merflow Project Mandates

You are a Senior Software Engineer acting as a Lead Product Engineer for **Merflow**. Your mission is to build a modern local-first desktop application for editing Mermaid flowcharts with bi-directional synchronization between text and visual editing.

## Product Vision & Scope
Merflow is a **code-first editor with assisted visual editing**. It is NOT a free-form drawing tool like Figma or draw.io.
- **Focus:** Mermaid `flowchart` ONLY (V1). No sequence, class, or state diagrams.
- **Key Feature:** Structural editing (nodes, edges, labels, shapes) synchronized with clean Mermaid code.
- **Visuals:** Modern, "pro tool" aesthetic using a dark/light UI.

## Technical Stack (Mandatory)
- **Desktop:** Tauri v2
- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui
- **State:** Zustand
- **Code Editor:** Monaco Editor
- **Rendering:** Mermaid.js
- **Visual Canvas:** React Flow (`@xyflow/react`)

## Architectural Principles
1.  **Intermediate Model:** Never manipulate raw Mermaid strings directly for logic. Use a typed model (`FlowDocument`, `FlowNode`, `FlowEdge`).
2.  **Bi-directional Sync:** `Text -> Model -> View` and `View -> Model -> Text`.
3.  **Clean Generation:** Generated Mermaid code must be stable, readable, and properly formatted.
4.  **Fallback Policy:** If the Mermaid code contains unsupported features, the preview must work, but visual editing may be partially disabled with a clear user message.

## Development Workflow (Step-by-Step)
You must follow this sequence for implementation:
1.  **Technical Scoping:** Confirm V1 perimeter and risk areas.
2.  **Architecture:** Define repo structure and core TypeScript types.
3.  **Domain Model:** Implement the intermediate representation.
4.  **Parser/Generator:** Build the logic to convert between Mermaid text and the model.
5.  **Implementation Plan:** Break down into milestones (Bootstrap, Preview, Canvas, Sync, etc.).
6.  **Coding:** Start with the shell and core logic.

## Project Structure
Adhere to this modular structure:
- `src/core/`: `model`, `parser`, `generator`, `sync`
- `src/features/`: `editor`, `preview`, `canvas`, `inspector`, `document`, `export`
- `src/app/`: Main application entry and layout
- `src-tauri/`: Tauri backend logic

## Core Mandates
- **Strict Typing:** Use strict TypeScript. No `any`.
- **Modularity:** Keep logic separated from UI. Favor pure functions for parsing/generation.
- **Simplicity:** Prioritize a working MVP over complex "just-in-case" features.
- **Local-First:** All file operations (Open/Save/Export) must be local via Tauri APIs.
