---
name: mermaid-diagram-generater
description: >
  Generates Mermaid diagrams for Jekyll blog articles (GitHub Pages).
  Use this skill when a user asks to: add a diagram, visualize a concept, illustrate a flow or architecture,
  compare structures, or explain a data structure or system with a visual.
  The skill ensures diagrams render correctly on the web using <pre class="mermaid"> HTML tags
  instead of fenced code blocks.
applyTo: "jekyll/**/*.md"
---

# Mermaid Diagram Generator Skill

## Purpose

Generate Mermaid diagrams that render correctly on the **junedang GitHub Pages blog**. The site uses a custom Mermaid integration that requires diagrams to be wrapped in raw HTML `<pre class="mermaid">` tags — NOT standard Markdown fenced code blocks (` ```mermaid `).

---

## Output Format (REQUIRED)

All diagrams MUST use this exact HTML wrapper:

```
<pre class="mermaid">
<diagram content here>
</pre>
```

**Never use fenced code blocks for diagrams in this project:**
```
❌ Wrong:
```mermaid
graph TD
  A --> B
```

✅ Correct:
<pre class="mermaid">
graph TD
  A --> B
</pre>
```

---

## Diagram Types

Choose the diagram type based on what the article needs to illustrate:

| Content Type | Diagram Type | Example Use Case |
|---|---|---|
| Tree / hierarchy | `flowchart TD` | Data structures (heap, BST, trie) |
| Sequence / flow of events | `sequenceDiagram` | Auth flows, HTTP lifecycle, function call stack |
| State transitions | `stateDiagram-v2` | Connection states, deployment pipelines |
| Left-to-right flow | `flowchart LR` | Data pipelines, system layers |
| Relationship / comparison | `graph TD` with subgraphs | Memory segments, architecture layers |
| Timeline / order | `flowchart TD` with steps | Algorithm steps, deployment stages |

---

## Optional Config Block

For visual polish, add an optional YAML config header inside the diagram. Always place it **before** the diagram definition:

```
<pre class="mermaid">
---
config:
  layout: elk
  look: handDrawn
---
flowchart TD
  ...
</pre>
```

**Config options:**
- `layout: elk` — better automatic node placement for complex graphs (recommended for trees)
- `look: handDrawn` — adds a hand-drawn aesthetic (good for conceptual diagrams)
- Omit config entirely for sequence diagrams or simple linear flows

---

## Node Styling

### Shape shorthand (Mermaid v10+)
Use `@{shape: ..., label: "..."}` for explicit node shapes:

```
<pre class="mermaid">
flowchart TD
    A@{shape: circle, label: "Root: 10"}
    B@{shape: circle, label: "Left: 7"}
    A --> B
</pre>
```

Common shapes: `circle`, `rect`, `diamond`, `stadium`, `cylinder`

### CSS class styling
Append `:::className` to a node to apply inline style:

```
<pre class="mermaid">
graph TD
    A["Stack"]:::stack
    B["Heap"]:::heap
</pre>
```

---

## Placement Rules

- Place a diagram **immediately after** the paragraph it illustrates — not at the start of a section unless the diagram IS the explanation.
- One diagram per concept. Do not stack multiple diagrams without explanatory text between them.
- For multi-step processes (e.g., algorithm walkthroughs), split into separate diagrams per phase with a brief label sentence in between.
- Diagrams do not need captions — the surrounding prose provides context.

---

## Step-by-Step: How to Add a Diagram to an Article

1. **Identify the right moment** — diagram after the concept is introduced, not before.
2. **Choose diagram type** from the table above.
3. **Draft the diagram** in the `<pre class="mermaid">` wrapper.
4. **Add optional config** (`layout: elk`, `look: handDrawn`) if the graph is complex or conceptual.
5. **Label nodes clearly** — use descriptive text like `"Index 0: 3 (root)"`, not just `A`, `B`, `C`.
6. **Validate syntax** — node IDs must be unique; arrow syntax: `-->` (solid), `-.->` (dashed), `-->>` (in sequenceDiagram).
7. **Check placement** — confirm prose before and after the diagram provides context.

---

## Real Examples from This Blog

### Tree diagram (Min-Heap)

```
<pre class="mermaid">
---
config:
  layout: elk
  look: handDrawn
---
flowchart TD
    A@{shape: circle, label: "Index 0: 3 (root)"}
    B@{shape: circle, label: "Index 1: 5 (left child)"}
    C@{shape: circle, label: "Index 2: 7 (right child)"}
    A --> B
    A --> C
</pre>
```

### Sequence diagram (Function call stack)

```
<pre class="mermaid">
sequenceDiagram
    participant Main as main()
    participant Stack as Call Stack
    participant Calc as calculateSum()

    Main->>Stack: Push stack frame for main()
    Main->>Calc: Call calculateSum()
    Calc->>Stack: Push stack frame
    Calc-->>Stack: Pop stack frame
    Calc-->>Main: Return
</pre>
```

### Memory layout / layered architecture

```
<pre class="mermaid">
graph TD
    A["Stack Segment<br>Call frames"]:::stack
    B["Heap Segment<br>Dynamic allocation"]:::heap
    C["Data Segment<br>Initialized globals"]:::data
    A --> B --> C
</pre>
```

---

## Quality Checklist

Before inserting a diagram:

- [ ] Uses `<pre class="mermaid">` wrapper (not fenced code blocks)
- [ ] Diagram type matches the content being shown
- [ ] All node IDs are unique within the diagram
- [ ] Node labels are human-readable (not just `A`, `B`, `C`)
- [ ] Placed after the paragraph it illustrates
- [ ] Config block added if layout is complex
- [ ] No TODOs or placeholder nodes like `"..."` or `"TBD"`