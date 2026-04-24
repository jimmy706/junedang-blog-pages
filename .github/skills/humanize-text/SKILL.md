---
name: humanize-text
description: 'Remove AI-sounding language from technical writing. Use when polishing blog drafts, removing AI clichés (delve, leverage, tapestry), simplifying formal language, eliminating hedging words, and adding natural conversational tone while keeping technical accuracy.'
argument-hint: 'text to humanize (can be a file path or pasted content)'
---

# Humanize Text

Polish technical writing to sound natural and human. This skill removes AI tells, simplifies overly formal language, and restores conversational flow while maintaining technical precision.

## When to Use

- Polishing AI-generated or AI-assisted blog drafts
- Reviewing articles before publication for AI language patterns
- Simplifying overly formal technical documentation
- Removing hedging words that weaken clear statements
- Adding personality to flat technical prose

## What This Skill Fixes

This skill targets five specific humanization goals:

1. **AI Clichés**: Remove overused AI vocabulary
2. **Conversational Tone**: Replace stiff language with natural flow
3. **Simplicity**: Use plain words over formal alternatives
4. **Confidence**: Remove unnecessary hedging
5. **Voice**: Add subtle personality markers

## Procedure

### Step 1: Identify Content

Determine what needs humanization:
- File path to a draft article
- Pasted text from any source
- Section of an existing post

### Step 2: Scan for AI Tells

Run through these detection passes:

**Pass 1: Banned AI Words** (delete or rewrite)
- delve / delving
- leverage (as verb)
- tapestry
- paradigm shift
- game-changer / game changer
- cutting-edge
- revolutionary (unless historically accurate)
- unlock (metaphorical use)
- harness
- empower
- seamlessly
- robust (overused)
- plethora
- myriad (as adjective)
- embark on
- navigate (metaphorical overuse)
- landscape (business/tech context)
- ecosystem (overused metaphor)
- deep dive (noun)
- unpack (metaphorical)
- at the end of the day
- it's worth noting that
- in today's rapidly evolving
- in an ever-changing world

**Pass 2: Hedging Words** (remove or justify)
- arguably
- essentially
- basically
- practically
- virtually
- generally speaking
- for the most part
- somewhat
- fairly
- relatively
- kind of / sort of
- in a sense
- it could be argued that
- one might say
- to some extent

**Pass 3: Stiff Transitions** (replace with natural flow)
- Moreover → Also, Plus, And
- Furthermore → Also, Beyond that
- Therefore → So, That means
- Consequently → As a result, So
- Nevertheless → But, Still, Even so
- Notwithstanding → Despite
- In addition to → Plus, Along with
- With regard to → About, For
- In terms of → For, In
- For the purpose of → To

**Pass 4: Corporate Speak** (simplify)
- utilize → use
- facilitate → help, enable
- implement → build, add
- prioritize → focus on
- optimize → improve
- synergy → collaboration (or just describe what happens)
- stakeholder → person, team, user
- bandwidth (metaphorical) → time, capacity
- touch base → talk, check in
- circle back → return to, follow up
- actionable → useful, clear
- learnings → lessons
- ask (noun) → request, question

### Step 3: Apply Humanization Patterns

**Pattern A: Lead with the Concrete**

❌ Before: "In order to understand how authentication works, it's important to first delve into the fundamental concepts."

✅ After: "Authentication has three parts: who you are, what you know, and what you have."

**Pattern B: Cut the Preamble**

❌ Before: "It's worth noting that there are several different approaches one might take when implementing this feature."

✅ After: "Three ways to implement this:"

**Pattern C: Active Voice**

❌ Before: "The data is processed by the server and a response is generated."

✅ After: "The server processes the data and generates a response."

**Pattern D: Confidence Over Hedging**

❌ Before: "This approach arguably provides fairly robust performance in most scenarios."

✅ After: "This approach handles 10,000 requests per second on a 4-core server."

**Pattern E: Natural Transitions**

❌ Before: "Moreover, it should be noted that the system furthermore provides additional capabilities."

✅ After: "The system also handles retries and circuit breaking."

**Pattern F: One Idea, Short Sentence**

❌ Before: "The authentication process, which involves multiple steps including token generation and validation, essentially serves to verify user identity while also enabling secure access to protected resources."

✅ After: "Authentication verifies who you are. It generates a token, validates it, then grants access to protected resources."

### Step 4: Verify Technical Accuracy

After humanizing, ensure:
- Technical claims remain accurate
- Numbers and metrics unchanged
- Code examples still correct
- API names and commands exact
- Links and references valid

### Step 5: Preserve Intentional Formality

Keep formal language when:
- Defining technical terms precisely
- Citing academic or official sources
- Writing security warnings or legal notices
- Explaining complex algorithms where precision matters

## Quick Reference: AI → Human Swaps

| AI Version | Human Alternative |
|------------|-------------------|
| leverage the power of | use |
| delve into | explore, look at, examine |
| it's worth noting that | (just state it) |
| in order to | to |
| for the purpose of | to, for |
| a plethora of | many, lots of |
| utilize | use |
| facilitate | help, enable |
| implement a solution | build, add, create |
| robust system | reliable system, handles X load |
| seamlessly integrate | integrate, connect |
| game-changing approach | (describe what actually changes) |
| cutting-edge technology | (name the technology) |
| at the end of the day | ultimately, finally |
| deep dive into | detailed look at, examine |
| unpack this concept | explain, break down |
| navigate the landscape | work with, use |
| ecosystem of tools | tools, set of tools |
| unlock potential | enable, allow |
| empower users to | let users, allow users to |
| Moreover, | Also, Plus, And |
| Therefore, | So, That means |
| essentially | (remove or replace with specific detail) |
| arguably | (remove or support with evidence) |
| kind of / sort of | (remove or be specific) |

## Output Format

Return the humanized text with:
1. Removed AI clichés highlighted in comments if in a file
2. Brief summary of changes made
3. Preserved technical accuracy verified
4. Natural conversational flow restored

## Completion Checklist

Before finalizing:
- [ ] All banned AI words removed or justified
- [ ] Hedging words eliminated unless necessary for accuracy
- [ ] Stiff transitions replaced with natural flow
- [ ] Corporate speak simplified to plain language
- [ ] Concrete examples lead each section
- [ ] Technical terms remain precise
- [ ] Tone is conversational but not casual
- [ ] Voice has subtle personality without being unprofessional

## Examples

### Example 1: Blog Intro

❌ Before:
"In today's rapidly evolving digital landscape, it's worth noting that authentication has become increasingly important. Organizations leverage various paradigms to implement robust security measures. This article will delve into the fundamental concepts that empower developers to build secure systems."

✅ After:
"Authentication matters. When your app handles user data, you need to verify who's making requests. This guide covers three authentication patterns and when to use each one."

### Example 2: Technical Explanation

❌ Before:
"The system essentially utilizes a message queue to facilitate asynchronous processing, thereby enabling it to seamlessly handle a plethora of concurrent requests without compromising performance."

✅ After:
"The system uses a message queue for async processing. This handles 10,000 concurrent requests without blocking."

### Example 3: Comparison Section

❌ Before:
"Moreover, it's arguably important to note that there are several approaches one might leverage when implementing this functionality. Furthermore, each paradigm has its own unique set of tradeoffs."

✅ After:
"Three ways to implement this, each with different tradeoffs:"

## Integration with Article-Writing Skill

This skill works best as a **polish pass** after using the article-writing skill:

1. Use `/article-writing` to draft the blog post structure and content
2. Use `/humanize-text` to remove AI language patterns
3. Final review for technical accuracy and link validity

Alternatively, mention both skills together: "Write an article about X using article-writing, then humanize it."
