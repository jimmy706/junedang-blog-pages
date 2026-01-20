---
title: "Black Friday Architecture and System Design"
description: "How e-commerce platforms handle traffic spikes, protect inventory, and keep payments flowing during mega-sale events."
tags: [architecture, system-design, e-commerce, scalability, reliability]
date: 2026-01-20
---

Black Friday traffic can spike 10–50x normal load within minutes. The architecture challenge isn't just scale—it's keeping the system correct under pressure. Items must not oversell, payments must complete, and the site must stay responsive. This article walks through the key design decisions that make or break a Black Friday launch.

## Request Path and Caching Strategy

The first line of defense is aggressive caching. **CDN (Content Delivery Network)** serves static assets and popular product pages from edge locations without touching origin servers. TTLs (time-to-live) are kept short—seconds, not minutes—to balance freshness with load reduction.

Behind the CDN sits a **rate limiter** that enforces quotas per IP and per user session using token bucket algorithms. Too strict blocks real users; too loose lets bots exhaust backend capacity. Origin servers use **read replicas** and in-memory caches (Redis) for session data and inventory counts. Goal: serve 90%+ of reads from cache.

**Example:** Product page hits CDN (cached). "Add to Cart" goes through rate limiting to API gateway, which checks Redis for stock before updating cart session.

## Inventory and Flash Sale Consistency

The hardest problem is preventing overselling. When 10,000 users try to buy 100 items, the system must enforce a hard cap.

Classic **optimistic locking** with database counters doesn't scale to thousands of concurrent requests. Modern systems use a **reservation pattern**: a distributed counter (Redis with Lua scripts) reserves inventory instantly, then confirms or releases based on payment success.

**Example:** User clicks "Buy Now" → Redis counter decrements atomically → if successful, creates 10-minute reservation → checkout completes payment → reservation converts to order or expires.

For non-critical items, eventual consistency is acceptable: small overselling risk resolved through customer service.

## Checkout and Payment Reliability

Payment failures cost revenue. Two critical patterns: **idempotency** and **asynchronous processing**.

**Idempotency** means the same request (unique idempotency key) can retry safely without double-charging. If a user clicks "Pay" twice, the payment processor sees the same key and returns the original result.

**Asynchronous processing** decouples order creation from slower steps. Checkout writes to an **outbox table** and confirms immediately. Background workers handle emails, analytics, and fulfillment without blocking payment.

**Example:** User pays → backend writes order + outbox event (one transaction) → returns "Order Confirmed" → worker processes outbox asynchronously.

Retries use exponential backoff. Critical paths get separate, higher-capacity queues.

## Operational Controls

Engineers need instant control when failures happen. **Feature flags** disable non-essential features (recommendations, loyalty points) to free capacity. **Kill switches** turn off entire subsystems in seconds.

**Load shedding** prioritizes traffic: authenticated checkout requests go through; anonymous browsing gets throttled. A **waiting room** pattern (Cloudflare, Fastly) holds excess traffic, releasing users gradually as capacity permits.

**Observability** is non-negotiable: dashboards track error rates, latency, payment success rate, and queue depths. Alerts fire on anomalies, but engineers rely on pre-built runbooks—no time to debug during the event.

**Example:** Payment success drops below 95% → alert fires → engineer kills personalization service → CPU drops 20% → payments recover.

## What Success Looks Like

A successful Black Friday looks boring: flat latency graphs, payment success rate above 98%, zero inventory drift, and a working site. Engineers celebrate not heroic firefighting, but systems designed to absorb chaos without human intervention.

---

## Pre-Launch Checklist for Engineers

Before going live with a high-traffic sale event, verify:

- [ ] **Load test at 3x expected peak** with realistic user behavior (browse, cart, checkout)
- [ ] **CDN cache rules validated** for product pages, static assets, and API responses
- [ ] **Rate limiting configured** per IP, per user, per endpoint with safe defaults
- [ ] **Inventory reservation logic tested** under concurrent load to prevent overselling
- [ ] **Payment idempotency keys implemented** and verified with your payment provider
- [ ] **Feature flags operational** and tested for instant disable of non-critical features
- [ ] **Observability dashboards live** with alerts for error rate, latency, payment success
- [ ] **Database read replicas scaled** and tested for failover scenarios
- [ ] **Runbooks updated** with incident response steps and kill switch procedures
- [ ] **Graceful degradation tested** (serve cached/static pages if backend fails)

---

## Request Path Diagram

```
┌─────────┐
│ Browser │
└────┬────┘
     │
     ▼
┌──────────────────┐
│ CDN / Edge Cache │ ◄─── Static assets, product pages (cached)
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│ WAF / Rate Limit │ ◄─── Block malicious traffic, enforce quotas
└────┬─────────────┘
     │
     ▼
┌──────────────────┐
│  API Gateway     │ ◄─── Routing, auth, observability
└────┬─────────────┘
     │
     ├──► Product Service ──► Cache (Redis) ──► Read Replica DB
     │
     ├──► Cart Service ──────► Session Store (Redis/Memcached)
     │
     ├──► Inventory ─────────► Reservation Counter (Redis + Primary DB)
     │                          (Strong consistency required)
     │
     ├──► Checkout/Order ────► Primary DB (Transactional writes)
     │                     └──► Outbox Table (async tasks)
     │
     ├──► Payment Provider ──► External API (with idempotency keys)
     │
     └──► Event Queue ──────► Background Workers
                          ├──► Email Service (async)
                          ├──► Analytics (async)
                          └──► Fulfillment (async)
```

---

## Research Notes and Sources

### Key Architecture Patterns Identified

1. **CDN and Edge Caching**
   - Aggressive caching of static and semi-static content at edge locations
   - Short TTLs (5–30 seconds) for product pages to balance freshness and load
   - Source: AWS CloudFront documentation, Cloudflare architecture guides

2. **Rate Limiting and Load Shedding**
   - Token bucket algorithms for fair request throttling
   - Tiered limits: stricter for anonymous users, relaxed for authenticated checkout
   - Waiting room pattern to control backend load
   - Sources: Cloudflare "Under Attack" mode docs, Google Cloud Armor patterns

3. **Inventory Consistency**
   - Reservation pattern with distributed counters (Redis atomic operations)
   - Lua scripting for atomic decrement-and-check operations
   - Eventual consistency acceptable for non-critical inventory
   - Sources: Redis documentation on atomic operations, Shopify engineering blog on flash sales

4. **Payment Reliability**
   - Idempotency keys required for all payment operations
   - Transactional outbox pattern for decoupling confirmation steps
   - Exponential backoff for retries, separate high-priority queues
   - Sources: Stripe API documentation (idempotency), AWS architecture blog (saga pattern)

5. **Observability and Control**
   - Real-time metrics: error rate, latency percentiles, payment success, queue depth
   - Feature flags for instant disable of non-essential features
   - Kill switches for major subsystems
   - Pre-built runbooks for incident response
   - Sources: Datadog/New Relic best practices, Google SRE book (load shedding)

6. **Database Scaling**
   - Read replicas for product catalog and browse traffic
   - Write to primary only for inventory and orders
   - Caching layer in front of all database reads
   - Sources: AWS RDS best practices, PostgreSQL documentation

7. **Graceful Degradation**
   - Serve static/cached pages when backend is unavailable
   - Disable personalization/recommendations under load
   - Queue non-essential writes for later processing
   - Sources: Netflix engineering blog (chaos engineering), Fastly edge computing patterns

### Credible Sources Referenced

1. **AWS Architecture Blog** - Patterns for high-traffic e-commerce events, database scaling, and caching strategies
2. **Stripe API Documentation** - Idempotency implementation and payment reliability patterns
3. **Cloudflare Documentation** - CDN architecture, rate limiting, and waiting room patterns for traffic control
4. **Redis Documentation** - Atomic operations for distributed counters and inventory management
5. **Google SRE Book** - Load shedding, observability, and incident response practices
6. **Shopify Engineering Blog** - Flash sale architecture and inventory consistency patterns
7. **Fastly Edge Computing Guides** - Edge caching strategies and graceful degradation patterns
8. **AWS CloudFront Documentation** - CDN configuration and cache optimization for dynamic content

### Research Questions Answered

**Q1: What breaks first on Black Friday, and why?**
Database connections exhaust first due to slow queries under concurrent load. Then session stores (if not properly scaled) fail, followed by payment provider API rate limits. Root cause: write contention on hot inventory records and insufficient connection pooling.

**Q2: Which parts should be cached aggressively, and which must stay strongly consistent?**
Cache aggressively: product catalog, images, static pages, user session metadata. Strong consistency required: inventory counts during reservation, order transactions, payment confirmations.

**Q3: How should the system handle spikes: throttling, queueing, load shedding, waiting room?**
Use all four in layers: throttling at edge (rate limits per IP/user), waiting room for overflow traffic, load shedding to prioritize checkout over browsing, queueing for async tasks (email, analytics).

**Q4: How do you prevent overselling during flash sales?**
Reservation pattern with atomic counters in Redis. Decrement stock instantly on "buy" click, hold reservation for 10 minutes during checkout, convert to order on payment success or release on timeout/failure.

**Q5: What checkout/payment patterns reduce failures?**
Idempotency keys prevent duplicate charges on retries. Transactional outbox pattern decouples order confirmation from slower steps (email, analytics). Exponential backoff on payment API calls handles transient failures.

**Q6: What is the minimum observability stack needed during the event?**
Real-time dashboards with: request rate, error rate (per endpoint), latency percentiles (p50, p95, p99), payment success rate, database query times, queue depths. Alerts on thresholds with runbooks linked.

**Q7: How should feature flags/kill switches be designed for fast rollback?**
Flags stored in fast key-value store (Redis) with 100ms read latency. Kill switches disable entire feature categories (recommendations, loyalty points, reviews) in one action. No code deploy required; changes propagate in seconds.

**Q8: What "simplicity moves" matter most?**
Disable personalization, recommendations, and real-time analytics. Serve static product pages from CDN. Defer non-critical writes to queues. Pre-warm caches before launch. Run checkout on isolated, over-provisioned infrastructure.

<!-- 
Subtopic selection rationale:
1. Request path and caching - Critical first layer that determines if traffic reaches backend
2. Inventory consistency - The hardest technical problem (strong consistency under high concurrency)
3. Payment reliability - Revenue impact is direct; must handle retries and failures correctly
4. Operational controls - Engineers need real-time control during incidents

These four partition the problem space completely: traffic control, data correctness, transaction reliability, and incident response.
-->
