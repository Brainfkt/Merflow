Tu es un ingénieur logiciel senior, orienté product engineering, spécialisé en applications desktop local-first, TypeScript, React, architecture front moderne, UX d’outils techniques, parsing de DSL, synchronisation bidirectionnelle entre représentation textuelle et visuelle.

Ta mission est de concevoir puis implémenter un projet logiciel appelé **Merflow**.

# Contexte produit

Je veux créer une application desktop **locale** permettant d’éditer du **Mermaid** de manière moderne, avec deux approches synchronisées :

1. **édition textuelle** du code Mermaid,
2. **édition visuelle structurée** du diagramme.

L’application ne doit pas chercher à couvrir tout Mermaid dès le départ. Elle doit se concentrer sur une **V1 réaliste, propre et démontrable**, limitée à un seul type de diagramme :

- **flowchart Mermaid uniquement**

Le produit ne doit pas être pensé comme un clone complet de draw.io ou Figma.
Je ne veux pas promettre un positionnement libre pixel-perfect de tous les éléments.
Je veux un outil **code-first avec édition visuelle assistée**, où l’utilisateur peut modifier la structure du diagramme, ses nœuds, ses relations, ses labels et certains styles, tout en gardant un code Mermaid propre en sortie.

# Objectif global

Construire une application desktop locale moderne qui permet de :

- écrire du code Mermaid flowchart,
- prévisualiser le diagramme en temps réel,
- sélectionner des nœuds et des arêtes visuellement,
- modifier leurs propriétés via une interface moderne,
- ajouter / supprimer des nœuds,
- créer / supprimer des liens,
- synchroniser les modifications visuelles avec le code Mermaid,
- ouvrir / sauvegarder des fichiers `.mmd`,
- exporter en SVG et PNG,
- garder une architecture propre, extensible et sérieuse.

# Nom du projet

Nom de travail : **Merflow**

# Contraintes majeures

Tu dois respecter ces contraintes strictement :

1. **Périmètre V1 limité à Mermaid flowchart**
   - pas de sequence diagram
   - pas de class diagram
   - pas de state diagram
   - pas de gantt
   - pas d’ER diagram
   - pas de support multi-syntaxes pour la V1

2. **Desktop local-first**
   - l’application doit fonctionner en local
   - les fichiers doivent pouvoir être ouverts/sauvegardés localement
   - pas de dépendance à un backend obligatoire pour le MVP

3. **Architecture robuste**
   - ne pas manipuler uniquement une string Mermaid partout
   - introduire un **modèle intermédiaire** clair entre le texte et la vue

4. **Synchronisation bidirectionnelle**
   - code Mermaid -> modèle -> vue
   - vue -> modèle -> code Mermaid

5. **Code Mermaid généré lisible**
   - ordre stable
   - formatage propre
   - structure claire
   - éviter une sortie illisible ou chaotique

6. **Positionnement visuel libre non garanti**
   - on peut utiliser un canvas interactif pour l’édition
   - mais on ne doit pas faire croire que chaque déplacement arbitraire se traduit en coordonnées Mermaid exactes
   - l’édition visuelle doit surtout porter sur la **structure**, pas sur un layout absolu

# Stack technique imposée

Utilise cette stack, sauf impossibilité majeure dûment justifiée :

## Desktop
- **Tauri v2**

## Frontend
- **React**
- **TypeScript**
- **Vite**

## UI
- **Tailwind CSS**
- composants UI modernes et sobres
- si pertinent : **shadcn/ui**

## Gestion d’état
- **Zustand**

## Éditeur de code
- **Monaco Editor**

## Rendu Mermaid
- **Mermaid.js**

## Édition visuelle node-based
- **React Flow** (`@xyflow/react`)

# Vision UX

Je veux une interface moderne, propre, crédible, presque “outil pro”.
Pas un prototype moche.
L’expérience doit être claire et agréable.

## Layout principal souhaité

Une interface en 4 zones :

1. **Topbar**
2. **Panneau gauche** : éditeur de code Mermaid
3. **Zone centrale** : preview ou canvas interactif
4. **Panneau droit** : inspecteur de propriétés

## Fonctionnement attendu

### Topbar
Doit inclure au minimum :
- Nouveau fichier
- Ouvrir
- Sauvegarder
- Export SVG
- Export PNG
- Undo
- Redo
- Toggle Preview / Canvas
- Switch thème clair/sombre

### Panneau code
- Monaco Editor
- syntax highlighting Mermaid
- numéros de ligne
- erreurs basiques si possible
- expérience fluide

### Zone centrale
Deux modes :
- **Preview Mermaid**
- **Canvas interactif**

### Inspecteur
Quand rien n’est sélectionné :
- propriétés globales du graphe
- direction du flowchart
- titre/document metadata si utile

Quand un nœud est sélectionné :
- id
- label
- forme
- classe éventuelle
- sous-graphe éventuel

Quand une arête est sélectionnée :
- source
- target
- label
- style/type de lien
- type de flèche

# Fonctionnalités V1 obligatoires

## 1. Édition textuelle
L’utilisateur doit pouvoir :
- écrire du Mermaid flowchart à la main
- voir le résultat en live

## 2. Preview live
- rendu Mermaid temps réel
- zoom
- pan
- fit to screen
- mode clair / sombre cohérent

## 3. Édition visuelle structurée
L’utilisateur doit pouvoir :
- sélectionner un nœud
- modifier son label
- modifier sa forme
- ajouter un nœud
- supprimer un nœud
- créer une liaison entre deux nœuds
- supprimer une liaison
- modifier le label d’une liaison
- modifier le type de flèche
- changer la direction globale du graphe

## 4. Synchronisation
- modification dans le code => update du modèle => update de la vue
- modification dans la vue => update du modèle => régénération du code

## 5. Fichiers
- ouvrir un `.mmd`
- sauvegarder un `.mmd`
- autosave local si simple à mettre en place
- gérer un document courant

## 6. Export
- export `.svg`
- export `.png`
- export `.mmd`

# Architecture attendue

Je veux une architecture explicite en trois couches :

## Couche 1 : source textuelle
Le code Mermaid brut.

## Couche 2 : modèle intermédiaire
Un modèle typé représentant le flowchart.

## Couche 3 : représentation visuelle
Le graphe interactif.

Tu dois définir un modèle interne clair, par exemple de ce style :

- direction globale
- liste de nodes
- liste de edges
- liste de subgraphs
- classes/styles si pertinent

Exemple conceptuel attendu :

- `FlowDocument`
- `FlowNode`
- `FlowEdge`
- `FlowSubgraph`

Tu peux ajuster les types mais l’idée doit rester la même.

# Parser et générateur

Je veux que tu conçoives :

## Un parser Mermaid ciblé V1
Il ne doit pas viser 100% de Mermaid.
Il doit au minimum supporter :

- `flowchart LR`, `TB`, `TD`, `BT`, `RL`
- nœuds simples
- liens simples
- labels simples
- formes simples
- sous-graphes basiques si faisable sans exploser la complexité

## Un générateur Mermaid
Il doit produire un code :
- stable
- lisible
- propre
- cohérent
- compatible avec le sous-ensemble supporté

## Politique de fallback
Si le code Mermaid entré contient des constructions non supportées visuellement :
- l’application ne doit pas casser
- le preview doit rester fonctionnel
- le mode visuel peut devenir partiellement désactivé
- un message clair doit expliquer que le diagramme sort du périmètre de l'éditeur visuel V1

# Qualité de code attendue

Je veux :
- code modulaire
- composants bien séparés
- fonctions pures dès que possible
- typage TypeScript strict
- peu de dette technique inutile
- fichiers bien nommés
- architecture lisible par un recruteur / contributeur

Évite :
- les gros fichiers monolithiques
- la logique dispersée sans structure
- les hacks opaques
- les noms flous

# Arborescence attendue

Je veux que tu proposes une arborescence sérieuse et cohérente, proche d’une structure comme :

- `src/app`
- `src/features/editor`
- `src/features/preview`
- `src/features/canvas`
- `src/features/inspector`
- `src/features/document`
- `src/features/export`
- `src/core/model`
- `src/core/parser`
- `src/core/generator`
- `src/core/mapping`
- `src/core/sync`
- `src/lib`
- `src-tauri`

Tu peux l’ajuster si nécessaire, mais je veux quelque chose de très propre.

# Ce que tu dois produire

Je veux que tu travailles dans cet ordre et que tu **fournisses quelque chose de concret à chaque étape**.

## Étape 1 — Cadrage technique
Donne-moi :
1. une reformulation claire du produit
2. le périmètre exact V1
3. les choix techniques
4. les zones de risque
5. les compromis assumés

## Étape 2 — Architecture
Donne-moi :
1. l’arborescence complète du repo
2. les responsabilités de chaque dossier
3. les principaux types TypeScript
4. le flux de données global

## Étape 3 — Modèle de domaine
Définis précisément :
- `FlowDocument`
- `FlowNode`
- `FlowEdge`
- `FlowSubgraph`
- types de direction
- types de formes
- types de liens
- éventuelles métadonnées

## Étape 4 — Parser / générateur
Conçois :
1. une stratégie de parsing V1
2. une stratégie de génération Mermaid
3. les limites du parser
4. la politique de fallback

## Étape 5 — Plan d’implémentation
Découpe le projet en sprints / milestones très concrets :
- bootstrap
- preview
- parser
- canvas
- inspecteur
- sync
- export
- packaging

Chaque milestone doit avoir :
- objectif
- tâches
- livrables
- dépendances

## Étape 6 — Démarrage réel du code
Commence ensuite à implémenter.
Tu peux générer :
- les fichiers initiaux
- la structure du projet
- le code de base
- les types
- le store Zustand
- les composants shell
- les stubs de parser/générateur
- les commandes Tauri utiles

# Manière de travailler

Je veux que tu te comportes comme un vrai lead engineer.

Donc :
- ne pars pas dans tous les sens
- cadre avant de coder
- évite les features gadgets
- challenge les mauvaises idées si nécessaire
- fais des choix nets
- favorise un MVP démontrable plutôt qu’une ambition floue

# Règles importantes

1. Si une idée semble séduisante mais hors périmètre V1, dis-le clairement et mets-la en backlog plutôt que de l’intégrer.
2. Si une partie est incertaine, explicite l’incertitude.
3. Si un choix d’implémentation est risqué, propose une alternative plus sûre.
4. N’invente pas de magie impossible autour de Mermaid.
5. Sois concret, structuré, orienté exécution.
6. Quand tu proposes du code, il doit être cohérent avec le reste de l’architecture.
7. Tout ce que tu proposes doit servir le repo réel, pas juste “faire joli dans une réponse”.

# Résultat final attendu

Je veux que tu m’aides à produire un vrai repo GitHub sérieux pour **Merflow**, un éditeur desktop local-first de **flowcharts Mermaid**, moderne, propre, crédible, avec synchronisation entre code et édition visuelle structurée.