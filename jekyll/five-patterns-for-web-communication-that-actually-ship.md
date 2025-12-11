---
title: "Five Patterns for Web Communication That Actually Ship"
description: "Most teams only need one of these communication patterns. Pick by failure mode and cost, not fashion."
tags: [web-communication, api, websocket, polling]
image: https://storage.googleapis.com/junedang_blog_images/five-patterns-for-web-communication-that-actually-ship/http_rest.webp
date: 2025-09-01
---

Building real-time web applications requires choosing the right communication pattern between client and server. Most teams get overwhelmed by options and pick based on trends rather than technical requirements. This guide covers five battle-tested patterns that actually ship in production, with clear guidance on when to use each one.

> **At a glance**
> - Classic request/response works for most CRUD and API use cases
> - Short polling is the simplest near-real-time solution but scales poorly
> - Long polling provides real-time semantics on vanilla HTTP infrastructure
> - Server-Sent Events excel at one-way server-to-client push notifications
> - WebSocket enables full-duplex, low-latency bidirectional communication
> - Choose based on failure modes, latency requirements, and infrastructure constraints
> - Start with REST, add push patterns only where needed
> - Design for at-least-once delivery and implement proper reconnection logic

## 1. Classic Request/Response (REST over HTTP)

Classic request/response follows a simple model: client asks, server answers, then the connection dies. This stateless approach forms the backbone of most web APIs and remains the most widely adopted pattern for good reason.

![REST HTTP](https://storage.googleapis.com/junedang_blog_images/five-patterns-for-web-communication-that-actually-ship/http_rest.webp)

**Key characteristics:**
- Stateless communication model
- Highly cacheable responses
- Simple to implement and debug
- Works through all proxies and CDNs
- Excellent for CRUD operations

**Strengths and limitations:**
REST excels at cacheable operations and scales cheaply through CDNs. The stateless nature makes it resilient to failures and easy to load balance. However, it lacks push capabilities—clients won't know about server-side changes until they explicitly ask.

**When to use:**
- CRUD operations and traditional APIs
- Applications behind CDNs
- Mobile apps on unreliable networks
- Machine-to-machine communication

**Implementation tactics:**
- Make write operations idempotent using proper HTTP methods
- Cache GET requests aggressively with appropriate headers
- Implement pagination for large datasets
- Use ETags for efficient cache validation

**Example:**
```http
GET /orders/42 HTTP/1.1
Host: api.example.com

HTTP/1.1 200 OK
Content-Type: application/json
ETag: "abc123"

{
  "id": 42,
  "status": "shipped",
  "items": [...]
}
```

## 2. Short Polling

Short polling implements near-real-time updates by having the client repeatedly request data at fixed intervals. While simple to implement, this approach trades efficiency for simplicity.

![Short polling](https://storage.googleapis.com/junedang_blog_images/five-patterns-for-web-communication-that-actually-ship/short_polling.webp)

**Key characteristics:**
- Fixed interval requests from client
- No persistent connections required
- Simple implementation using standard HTTP
- Predictable server load patterns

**Strengths and limitations:**
This pattern requires no special server infrastructure and works with existing HTTP stack. However, it's inherently wasteful—either responses arrive late (if polling interval is too long) or generate excessive traffic (if interval is too short). It scales poorly as the number of users grows.

**When to use:**
- Deadlines are soft (5-15 seconds acceptable)
- Infrastructure is primitive or constrained
- As a temporary stopgap solution
- When real-time requirements are minimal

**Implementation tactics:**
- Use ETag/If-None-Match headers to return 304 when nothing changed
- Implement exponential backoff under high load
- Adjust polling frequency based on user activity
- Consider jittered intervals to avoid thundering herd

**Example:**
```javascript
// Poll every 10 seconds
setInterval(async () => {
  const response = await fetch('/jobs/42/status');
  if (response.status === 200) {
    const data = await response.json();
    updateUI(data);
  }
}, 10000);
```

## 3. Long Polling

Long polling improves upon short polling by having the server hold requests open until new data becomes available or a timeout occurs. This provides real-time semantics using standard HTTP infrastructure.

![Long polling](https://storage.googleapis.com/junedang_blog_images/five-patterns-for-web-communication-that-actually-ship/long_polling.webp)

**Key characteristics:**
- Server holds connections open until data arrives
- Uses standard HTTP without protocol upgrades
- Provides push semantics on vanilla HTTP
- Works through most proxies and firewalls

**Strengths and limitations:**
Long polling delivers true real-time updates without requiring new protocols, making it work through restrictive network infrastructure. The main drawbacks include managing many concurrent open connections and the complexity of timeout tuning, which can be brittle.

**When to use:**
- Events are sporadic but must appear quickly
- Infrastructure forbids WebSocket or SSE
- Need push semantics on standard HTTP
- Working through restrictive proxies

**Implementation tactics:**
- Set timeouts between 25-55 seconds to avoid proxy issues
- Respond immediately when events occur
- Implement exponential backoff on client reconnection
- Include cursor-based pagination for missed events

**Example:**
```javascript
async function longPoll() {
  try {
    const response = await fetch('/events?after=123&timeout=30');
    if (response.status === 200) {
      const events = await response.json();
      processEvents(events);
    }
  } catch (error) {
    console.error('Polling error:', error);
  } finally {
    // Reconnect with backoff
    setTimeout(longPoll, getBackoffDelay());
  }
}
```

## 4. Server-Sent Events (SSE)

Server-Sent Events provide a standardized way to stream data from server to client over a single HTTP connection. This pattern excels at one-way real-time updates with built-in browser support.

![Server-Sent Events](https://storage.googleapis.com/junedang_blog_images/five-patterns-for-web-communication-that-actually-ship/sse.webp)

**Key characteristics:**
- One-way server-to-client streaming
- Uses `text/event-stream` content type
- Built-in browser reconnection support
- Works well with HTTP/2 and standard proxies

**Strengths and limitations:**
SSE offers dead-simple implementation of server push with automatic reconnection handling in browsers. It plays well with existing HTTP infrastructure, authentication cookies, and compression. However, it's limited to downstream-only communication and isn't optimal for binary data or high-fanout scenarios without a message broker.

**When to use:**
- Dashboards and live monitoring
- Real-time notifications
- Live logs and progress updates
- Price feeds and live data
- "Follow the state" user interfaces

**Implementation tactics:**
- Send periodic heartbeats to detect connection issues
- Include unique `id` field for each event
- Support `Last-Event-ID` header for reconnection
- Disable gzip for frequent small events

**Example:**
```javascript
const eventSource = new EventSource('/stream');

eventSource.addEventListener('price', (event) => {
  const data = JSON.parse(event.data);
  updatePrice(data.ticker, data.price);
});

eventSource.addEventListener('error', (event) => {
  console.error('SSE connection error');
});
```

Server response:
```
GET /stream HTTP/1.1

HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache

event: price
id: 124
data: {"ticker":"AAPL","px":232.12}

: heartbeat every 15s
```

## 5. WebSocket

WebSocket provides full-duplex, long-lived communication channels tunneled through HTTP upgrade. This pattern enables the lowest latency bidirectional communication for interactive applications.

![Websocket](https://storage.googleapis.com/junedang_blog_images/five-patterns-for-web-communication-that-actually-ship/websocket.webp)

**Key characteristics:**
- Full-duplex communication over single TCP connection
- Low protocol overhead after initial handshake
- Support for both text and binary messages
- Persistent stateful connections

**Strengths and limitations:**
WebSocket delivers the lowest latency for bidirectional communication, making it ideal for interactive applications like chat, games, and collaborative editing. The persistent nature requires careful handling of connection state, load balancing, autoscaling, and backpressure management.

**When to use:**
- Bidirectional communication with sub-second latency requirements
- Frequent small messages between client and server
- Binary payload transmission
- Real-time collaborative applications
- Gaming and interactive applications

**Implementation tactics:**
- Use sticky sessions or shared message broker for scaling
- Implement backpressure signals to prevent overwhelming clients
- Send ping/pong frames for connection health monitoring
- Use TTL-based presence detection
- Plan graceful connection draining for deployments

**Example:**
```javascript
const ws = new WebSocket('wss://api.example.com/ws');

ws.onopen = () => {
  console.log('WebSocket connected');
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  handleMessage(message);
};

// Send cursor position
ws.send(JSON.stringify({
  type: 'cursor',
  x: 120,
  y: 90
}));
```

## Design and Trade-offs

| Pattern | Latency | Complexity | Scalability | Infrastructure | Use Case |
|---------|---------|------------|-------------|----------------|----------|
| REST | High | Low | Excellent | Simple | CRUD, APIs |
| Short Polling | Medium | Low | Poor | Simple | Soft deadlines |
| Long Polling | Low | Medium | Good | Standard HTTP | Sporadic events |
| SSE | Low | Medium | Good | Standard HTTP | Server push |
| WebSocket | Lowest | High | Complex | Advanced | Bidirectional |

## Decision Guide

Use this framework instead of following trends:

- **"Users can wait seconds and bandwidth costs matter"** → Short polling with cache validators
- **"Events are rare but must appear quickly"** → Long polling  
- **"UI needs live server-to-client push only"** → Server-Sent Events
- **"Both directions with lots of small messages"** → WebSocket
- **"APIs for machines and humans"** → Request/response, add push patterns only where specifically needed

## Summary of Recommendations

Start with REST. Add SSE when you need one-way push. Escalate to WebSocket only for true two-way real-time. Keep long polling as a fallback, short polling as a last resort.