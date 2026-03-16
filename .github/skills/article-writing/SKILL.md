---
name: article-writing
description: Write long-form technical content in Junedang blog voice. Use for Jekyll posts, system design explainers, and practical engineering deep dives where tone consistency, evidence quality, and skimmable structure are required.
argument-hint: topic, audience level, depth, and whether to mirror recent tone or foundational tone
origin: ECC
---

# Article Writing

Write long-form content that sounds like this repo's strongest posts: concrete, technical, practical, and low on hype.

## When to Activate

- drafting blog posts, essays, launch posts, guides, tutorials, or newsletter issues
- turning notes, transcripts, or research into polished articles
- matching tone from existing Junedang articles in `jekyll/`
- tightening structure, pacing, and evidence in already-written long-form copy

## House Tone Profile (Junedang)

Use this as the default voice unless the user asks for something different.

- Lead with a concrete situation, not abstract framing
- Explain systems through constraints, trade-offs, and failure modes
- Prefer direct statements over soft qualifiers
- Use practical examples, message flows, or code snippets when useful
- Keep language natural and conversational, but not casual fluff
- End sections with clear implications: when to use, when not to use, what breaks

### Rhythm and Style Markers

- Short-to-medium sentences with occasional longer explanatory lines
- Frequent signposting with bold labels such as `Strengths`, `Limitations`, `When to use`
- Comparisons in tables when evaluating options
- Technical terms are defined once, then used precisely
- Avoid buzzword stacking

## Core Rules

1. Lead with the concrete thing: example, output, anecdote, number, screenshot description, or code block.
2. Explain after the example, not before.
3. Prefer short, direct sentences over padded ones.
4. Use specific numbers when available and sourced.
5. Never invent biographical facts, company metrics, or customer evidence.
6. For architecture topics, always include at least one explicit trade-off.
7. For implementation topics, include at least one runnable snippet or command.

## Voice Capture Workflow

If the user wants a specific voice, collect one or more of:
- published articles
- newsletters
- X / LinkedIn posts
- docs or memos
- a short style guide

Then extract:
- sentence length and rhythm
- whether the voice is formal, conversational, or sharp
- favored rhetorical devices such as parentheses, lists, fragments, or questions
- tolerance for humor, opinion, and contrarian framing
- formatting habits such as headers, bullets, code blocks, and pull quotes

If no voice references are given, default to this repo's recent technical style: concrete, systems-oriented, clear trade-offs, and practical examples.

## Workflow With Decision Points

1. Clarify objective and reader level.
2. Pick article mode.
3. Build outline with non-overlapping sections.
4. Draft section openings with concrete examples.
5. Add evidence, references, and implementation details.
6. Run tone and quality gate before finalizing.

### Step 1: Clarify Objective and Reader Level

Capture:
- goal: explain, compare, teach, or provide operational guidance
- reader level: beginner, intermediate, advanced
- expected outcome: understanding, decision, or implementation

### Step 2: Pick Article Mode

- **System design deep dive**: focus on constraints, bottlenecks, failure handling, and trade-offs.
- **Concept explainer**: focus on mental models, plain-language definitions, and examples.
- **Implementation guide**: focus on setup, runnable snippets, and verification steps.

### Step 3: Build Non-overlapping Outline

Rules:
- 3-5 H2 sections
- each H2 answers a different question
- avoid repeating the same concept in multiple sections

### Step 4: Draft Section Openings

Start each section with one of:
- a realistic production scenario
- a concrete number or operational constraint
- a short request/response or event-flow example

### Step 5: Add Evidence and Practicality

- cite non-trivial claims from official docs, standards, or trusted technical sources
- include code/config snippets when they improve understanding
- for comparisons, prefer tables with `Option | Pros | Cons | Use when`

### Step 6: Tone and Quality Gate

Pass all checks before delivery:
- does the intro explain scope and why it matters in 3-5 sentences?
- does each H2 add new information?
- are strong assertions supported with references?
- is there at least one explicit trade-off discussion?
- does the ending provide concrete takeaways?

## Banned Patterns

Delete and rewrite any of these:
- generic openings like "In today's rapidly evolving landscape"
- filler transitions such as "Moreover" and "Furthermore"
- hype phrases like "game-changer", "cutting-edge", or "revolutionary"
- vague claims without evidence
- biography or credibility claims not backed by provided context

## Repo-specific Article Shape (Jekyll)

When writing for this repo, follow this default shape:

1. YAML front matter with `title`, `description`, `tags`, `date`, and `image`.
2. Intro that states scope, stakes, and what the reader gets.
3. 3-5 H2 sections with H3 details where needed.
4. `Closing Thoughts` section with practical wrap-up.
5. `Questions` section with 1-2 knowledge checks.

Internal linking:
- add contextual links to related posts using `/posts/<slug>` when concepts overlap.

## Structure Guidance

### Technical Guides
- open with what the reader gets
- use code or terminal examples in every major section
- end with concrete takeaways, not a soft summary

### Essays / Opinion Pieces
- start with tension, contradiction, or a sharp observation
- keep one argument thread per section
- use examples that earn the opinion

### Newsletters
- keep the first screen strong
- mix insight with updates, not diary filler
- use clear section labels and easy skim structure

## Quick Rewrite Heuristics

Use these if a draft feels generic:

- replace abstract nouns with observable behavior
- convert claims into "because" statements with mechanism
- swap long preambles for one concrete example
- remove one sentence out of every three and re-check clarity

## Completion Checklist

Before delivering:
- verify factual claims against provided sources
- remove filler and corporate language
- confirm tone matches selected reference articles
- ensure every section adds new information
- check formatting for the intended platform
- ensure links and code snippets are valid