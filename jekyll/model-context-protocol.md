---
title: "Model Context Protocol (MCP)"
description: "A standardized protocol for connecting AI models to external tools and data sources securely and efficiently."
tags: [mcp, ai, llm, protocol, integration]
date: 2025-12-28
---

Large language models have grown remarkably capable, but they remain isolated—disconnected from the files on your machine, the databases in your organization, or the APIs that power your workflows. The **Model Context Protocol (MCP)** solves this by providing a standard, secure way for AI systems to interact with external resources. Instead of building custom integrations for every use case, MCP offers a unified interface that any AI client can use to access tools, read data, and execute actions in controlled environments.

## What MCP Is

MCP is an open protocol developed by Anthropic that defines how AI models communicate with external systems. Think of it as a common language between AI and the world outside the model. Rather than directly integrating with every possible API, database, or file system, an AI client speaks MCP, and an MCP server translates that into specific actions.

The protocol is built on a client-server architecture:

* **MCP Clients** are applications like Claude, ChatGPT, or custom AI systems that need access to external resources.
* **MCP Servers** expose specific capabilities—reading files, querying databases, calling APIs—through a standardized interface.
* **Resources** are the data sources or tools that the server provides access to, such as file systems, databases, or external services.

By decoupling the AI from the underlying systems, MCP enables composability. One server might expose a local file system, another a GitHub repository, and a third a company's internal [API](/posts/api-gateway-design-and-key-components). The AI client doesn't need to know the details—it just speaks MCP.

**Architecture Overview:**

```
┌─────────────┐
│ AI Client   │ (Claude, ChatGPT, custom agents)
│ (MCP Client)│
└──────┬──────┘
       │ MCP Protocol
       │ (JSON-RPC over stdio/HTTP)
       │
┌──────▼──────────────────────────┐
│ MCP Server(s)                   │
├─────────────────────────────────┤
│ • File System Server            │
│ • Database Server               │
│ • API Integration Server        │
│ • Git Repository Server         │
└──────┬──────────────────────────┘
       │
┌──────▼──────────────────────────┐
│ External Resources              │
│ • Local files                   │
│ • PostgreSQL DB                 │
│ • REST APIs                     │
│ • Git repos                     │
└─────────────────────────────────┘
```

## How MCP Works

MCP operates through a request-response protocol, typically using JSON-RPC 2.0 for message formatting. The client initiates a connection to the server, negotiates capabilities, and then issues commands.

**Core Protocol Flow:**

1. **Initialization**: The client connects to the server (via stdio, HTTP, or WebSocket) and performs a handshake to discover what resources and tools are available.

2. **Capability Discovery**: The server advertises its capabilities—which resources it exposes (e.g., "filesystem," "database"), which tools it provides (e.g., "read_file," "execute_query"), and what permissions are required.

3. **Resource Access**: The client requests access to a resource. For example, to read a file, the client sends a `resources/read` request with the file path. The server validates permissions and returns the content.

4. **Tool Invocation**: For actions beyond reading, the client can invoke tools. A tool might be "run_sql_query" or "create_github_issue." The client sends parameters, and the server executes the action and returns results.

5. **Context Management**: MCP supports stateful sessions, allowing the AI to build context over multiple interactions without re-requesting the same data.

**Example Message Flow:**

```json
// Client requests file listing
{
  "jsonrpc": "2.0",
  "method": "resources/list",
  "params": {
    "uri": "file:///home/user/project"
  },
  "id": 1
}

// Server responds with available files
{
  "jsonrpc": "2.0",
  "result": {
    "resources": [
      {"uri": "file:///home/user/project/main.py", "name": "main.py"},
      {"uri": "file:///home/user/project/config.json", "name": "config.json"}
    ]
  },
  "id": 1
}

// Client reads a file
{
  "jsonrpc": "2.0",
  "method": "resources/read",
  "params": {
    "uri": "file:///home/user/project/main.py"
  },
  "id": 2
}

// Server returns file content
{
  "jsonrpc": "2.0",
  "result": {
    "contents": "import os\n\ndef main():\n    print('Hello')"
  },
  "id": 2
}
```

**Security Model:**

MCP enforces explicit permission boundaries. A server can require authentication tokens, limit which files or APIs are accessible, and audit every request. The client never gets direct access—every action goes through the server's permission layer.

## Key Advantages of MCP

MCP delivers several strategic benefits that traditional integrations struggle to provide:

**Standardization at Scale**

Without MCP, every AI integration is a custom project. Connecting Claude to GitHub requires one codebase. Connecting it to PostgreSQL requires another. With MCP, you write one server per resource type, and any MCP-compliant client can use it. This composability is the core advantage—build once, reuse everywhere.

**Security and Auditability**

Direct API access from an AI model is risky. The model might make unintended calls, leak sensitive data, or execute destructive actions. MCP servers act as a permission gateway, logging every request and enforcing policies. An MCP server can:

* Require explicit user approval for sensitive operations.
* Rate-limit requests to prevent abuse.
* Redact sensitive fields from responses.
* Audit all actions for compliance and debugging.

**Stateful Context Management**

Traditional API calls are stateless—each request is independent. MCP supports sessions, allowing the AI to maintain context across interactions. This is critical for workflows like code refactoring, where the model needs to remember which files it has already read and what changes it has made.

**Interoperability Across Ecosystems**

MCP is not tied to a single AI provider. Anthropic's Claude uses it, but so can OpenAI's GPT models, open-source LLMs, or custom agents. This prevents vendor lock-in and enables a plugin ecosystem—developers can build MCP servers for niche tools, and any AI client can immediately use them.

**Performance Optimization**

MCP servers can implement caching, batching, and query optimization that would be difficult to coordinate in direct AI-to-API calls. For example, an MCP database server can batch multiple queries, cache frequently accessed data, and return only relevant fields, reducing latency and token usage.

## MCP vs Traditional Integration Approaches

How does MCP compare to older methods of connecting AI to external systems?

| Approach | How It Works | Strengths | Weaknesses | Best For |
|----------|--------------|-----------|------------|----------|
| **Direct API Calls** | AI generates API requests directly | Simple for single-use cases | No standardization, security risks, tight coupling | Prototypes, single-provider setups |
| **Function Calling** | AI invokes predefined functions with parameters | Flexible, widely supported | Each AI provider has custom syntax, no reusable infrastructure | Lightweight tasks, provider-specific features |
| **Custom Plugins** | AI uses provider-specific plugin architecture | Ecosystem support (OpenAI plugins, etc.) | Vendor lock-in, limited interoperability | Apps built for one AI platform |
| **MCP** | AI speaks to standardized MCP servers | Interoperable, secure, reusable, auditable | Requires server development, newer ecosystem | Enterprise integrations, multi-tool workflows |

**Why MCP Wins for Production Use:**

* **Direct API calls** give the AI too much power and no audit trail.
* **Function calling** forces you to rebuild integrations for every AI provider.
* **Custom plugins** lock you into one vendor's ecosystem.
* **MCP** provides a universal standard that works across clients, with built-in security and observability.

For one-off experiments, direct API calls are fine. For production systems—where security, maintainability, and scalability matter—MCP is the superior choice.

## Practical Applications of MCP

MCP is not theoretical. It's already enabling real workflows where AI systems interact with production environments.

**1. AI-Powered Code Assistants**

An MCP server exposes a Git repository, allowing the AI to:

* Read source files across the codebase.
* Search for function definitions and references.
* Run tests and view logs.
* Submit pull requests with proposed changes.

Instead of copying code into a chat window, the AI navigates the repository directly. The MCP server ensures the AI can't access sensitive files like `.env` or `secrets.yaml`.

**Example Use Case:** An engineer asks Claude to refactor a function. Claude uses MCP to read the current implementation, check where it's called, run unit tests, and propose a diff—all without manual file copying.

**2. Database Query and Analysis**

An MCP server connects to PostgreSQL, MySQL, or another database. The AI can:

* Query tables to answer business questions.
* Generate reports based on live data.
* Suggest schema optimizations.
* Debug slow queries by reading execution plans.

The MCP server enforces read-only access, redacts sensitive columns (e.g., credit card numbers), and logs every query for compliance.

**Example Use Case:** A product manager asks, "Which features did users engage with most last week?" The AI queries the database through MCP, aggregates results, and returns a summary—no SQL expertise required.

**3. CI/CD and Automation Workflows**

An MCP server integrates with GitHub Actions, Jenkins, or Kubernetes, allowing the AI to:

* Trigger deployments based on conversation context.
* Monitor build logs and diagnose failures.
* Roll back problematic releases.
* Update infrastructure configurations.

The MCP server requires explicit approval for destructive actions and maintains a full audit log.

**Example Use Case:** A DevOps engineer says, "Deploy the staging branch to QA." The AI uses MCP to trigger the deployment, monitors the pipeline, and reports success or failure.

**4. Internal API and Knowledge Base Access**

An MCP server exposes company-internal APIs, wikis, or document stores. The AI can:

* Answer employee questions by querying internal docs.
* Fetch customer data from CRMs like Salesforce.
* Update tickets in Jira or Linear.
* Pull analytics from internal dashboards.

This turns the AI into an intelligent interface layer over fragmented internal systems.

**Example Use Case:** A support engineer asks, "What's the status of ticket #4521?" The AI queries Jira through MCP, retrieves the ticket, checks linked deployments, and summarizes the current state.

**5. Personal Productivity and File Management**

An MCP server exposes the local file system, calendar, or email client. The AI can:

* Summarize meeting notes stored in Markdown files.
* Draft emails based on context from recent messages.
* Search for files by content, not just filename.
* Organize photos or documents based on metadata.

**Example Use Case:** A user says, "Find all meeting notes from last quarter where we discussed pricing." The AI searches the local filesystem through MCP, reads relevant files, and returns a summary.

## Questions

* What is the Model Context Protocol, and how does it enable AI systems to interact with external resources securely?
* How does MCP compare to traditional integration approaches like direct API calls or custom plugins, and when should you choose MCP over these alternatives?

<!-- 
Subtopic selection rationale:
The five subtopics were chosen to provide a comprehensive understanding of MCP from definition to implementation. "What MCP Is" establishes the foundational concept and architecture. "How MCP Works" dives into the technical protocol mechanics. "Key Advantages" articulates the value proposition. "MCP vs Traditional Approaches" positions MCP in the broader integration landscape. "Practical Applications" demonstrates real-world utility across diverse domains. Together, these cover the conceptual, technical, strategic, and practical dimensions of MCP, partitioning the problem space without overlap.
-->
