---
name: mermaid-flowchart
description: |
  Generates flowcharts using Mermaid syntax from user‑provided descriptions. Use when the user
  asks to draw a flowchart, create a flowchart diagram, visualize a process in Mermaid,
  or build a diagram with nodes and arrows.
license: Apache-2.0
metadata:
  author: ChatGPT Agent
  version: "1.0"
---

# Mermaid Flowchart Generator

## Overview

This skill guides the agent to convert a natural language description of a process into a
Mermaid flowchart definition, optionally generating an image file.  It uses the syntax
documented in the official Mermaid documentation.  See the included
[mermaid‑syntax reference](references/mermaid-syntax.md) for details.  Use this skill when
the user requests a flowchart or diagram and provides a description of the logic.

## Steps

1. **Parse the description** – Identify distinct steps, decisions, start and end points from
   the user's description.  Ask for clarification only if absolutely necessary.
2. **Choose orientation** – If the user does not specify, default to left‑to‑right with
   `flowchart LR`.  Use top‑to‑bottom (`TB` or `TD`) if the user mentions a vertical flow.
3. **Map steps to nodes** –
   * Use a circle (`((Start))` or `((End))`) or a stadium (`([Start])`) for starting and ending points.
   * Use a rectangle (`[Step]`) for standard process steps.
   * Use a diamond (`{Decision?}`) for decision points where the process branches.
   * Use other shapes (e.g. hexagon for conditions, cylinder for databases) if the description
     suggests them.
4. **Define edges** – Connect nodes using `-->` for normal flow.  For conditional branches,
   label the arrows with the condition inside `|text|`, e.g. `Yes`/`No`.
5. **Subgraphs (optional)** – Group related nodes using `subgraph` blocks if the description
   mentions modules, phases or repeated sequences.
6. **Styling (optional)** – Create class definitions using `classDef` and assign them to
   nodes with `class` statements if the user requests custom colors or styling.  See
   the reference for syntax.
7. **Assemble the code** – Start with the `flowchart` declaration and direction, then
   list nodes and edges line by line.  Use clear identifiers and descriptive labels.
8. **Deliver the output** –
   * Wrap the diagram definition in triple backticks with the `mermaid` label so that
     Markdown renderers can display it.
   * Optionally save the definition to a `.mmd` file in the working directory if the user
     wants an image file.  Use the provided `render.sh` script (see below) to generate a
     PNG via `mermaid-cli`.
9. **Example** – A simple flowchart illustrating these conventions:

   ```
   mermaid
   flowchart LR
       Start((Start)) --> Init[Initialize variables] --> Check{Is valid?}
       Check -- Yes --> Process[Process data] --> End((End))
       Check -- No --> Error[Show error] --> End
   ```

## Scripts

A helper script is included in `scripts/render.sh` to convert a `.mmd` file into a
PNG using the Mermaid CLI.  It will install the CLI on first run if it is not
available.  Only run this script when explicitly requested by the user and after
writing the `.mmd` file.  Example usage:

```bash
./scripts/render.sh diagram.mmd diagram.png
```

## References

See [mermaid‑syntax.md](references/mermaid-syntax.md) for a concise reference of node
shapes, arrow types and other syntax rules drawn from the official Mermaid documentation.