---
title: "Black Friday Architecture and System Design for Large-Scale E-commerce"
description: "How modern e-commerce platforms survive extreme traffic through correctness-first design, not just scaling."
tags: [system-design, architecture, distributed-systems, e-commerce, scalability]
date: 2026-01-21
---

Black Friday is not a scaling problem. It is a correctness-under-stress and system-constraint problem. This distinction matters because the solutions look fundamentally different. Scaling is about adding capacity—more servers, bigger databases, faster networks. Correctness under stress is about reducing complexity, constraining behavior, and accepting deliberate trade-offs that would be unacceptable on any other day.

This article explains how modern e-commerce platforms design systems to survive Black Friday–level traffic. It goes beyond listing components to explain *why* specific architectural decisions are made, *what trade-offs* each introduces, *how systems behave under failure*, and *how architecture changes before, during, and after the event*.

Assume you understand basic web concepts. This article covers advanced distributed-systems patterns with real explanations, not buzzwords.

## Why Black Friday Breaks Systems

On a normal Tuesday, an e-commerce site might handle 10,000 requests per second. On Black Friday, that number becomes 200,000. This isn't a 20x traffic increase—it's a phase transition. Systems that worked perfectly fine at 10k RPS collapse at 200k, not because they lack capacity, but because behavior changes.

**Traffic patterns shift violently.** Reads explode first—everyone refreshes product pages. Then writes spike—everyone tries to checkout simultaneously. The ratio of reads to writes changes from 100:1 to 10:1. Suddenly, your write infrastructure, carefully tuned for steady-state, becomes the bottleneck.

**User behavior becomes adversarial.** People refresh obsessively. They add items to cart, abandon them, then try again. They open 12 browser tabs to increase their odds. They hammer the "complete order" button when it doesn't respond instantly. Under normal conditions, users behave reasonably. Under stress, they become a distributed denial-of-service attack.

**Correctness matters more than throughput.** Oversell inventory by 10%, and you face angry customers, refunds, and brand damage. Process the same payment twice, and you face chargebacks and regulatory issues. Drop an order during checkout, and you lose revenue. At 10k RPS, you can fix these problems manually. At 200k RPS, manual intervention is impossible.

**Systems must operate in "Black Friday mode"**—a temporary architectural state where feature richness is sacrificed for reliability. Personalization gets disabled. Product recommendations disappear. Loyalty program calculations are deferred. The site becomes functionally simpler, because complexity kills reliability under load.

This article explains how systems are designed to survive this phase transition, not through heroics, but through boring, correct engineering.

## Architectural Philosophy: Designing for Stress, Not Growth

The core mistake teams make is designing for steady-state growth and hoping it scales to peak events. It doesn't. Growth is gradual—you add 20% more capacity each quarter. Peak events are spiky—you need 30x capacity for 48 hours.

**Feature richness kills reliability under load.** Consider personalization. On Tuesday, showing personalized product recommendations adds value. On Black Friday, it adds 50ms of latency and 3 additional database queries per request. Multiply that by 200k RPS, and you've added massive load for minimal value. The correct answer is to turn it off.

**Systems must be intentionally constrained.** This means pre-deciding what gets disabled under pressure. Not deciding in real-time during an incident, but months in advance, with tested runbooks. Examples:

* Disable A/B tests—they add queries and complicate caching
* Turn off real-time analytics—batch it instead
* Simplify checkout flows—remove optional fields
* Disable related products and upsells
* Freeze catalog updates—no new products during peak

This isn't about lacking capacity. It's about reducing the surface area of things that can break. Every feature is a liability during Black Friday.

**The concept of "Black Friday mode" is explicit.** Engineers flip a switch, and the system enters a known, tested state. This state has been load-tested. Failure modes have been explored. Runbooks exist. Rollback is possible (usually). This mode is not "the site but faster"—it's a different architecture where simplicity trumps features.

**What gets frozen, simplified, or disabled:**

* **Catalog updates** – The product database becomes effectively read-only
* **Pricing changes** – Prices are locked hours before the event
* **User-generated content** – Reviews, ratings, and comments are hidden or heavily cached
* **Third-party integrations** – Analytics, chat widgets, recommendation engines get disabled
* **Admin tools** – Back-office operations are paused to protect write capacity

**Examples of systems that failed due to over-complexity:**

* Target's 2011 Black Friday crash was caused by their promotional pricing engine. Complex discount rules created database hot-spots. Simplifying to flat discounts would have prevented it.
* A major retailer in 2015 kept their recommendation engine running during peak. It caused database connection pool exhaustion. Disabling it restored service.

**Clear distinction between normal-day vs event-day architecture:**

Normal-day architecture optimizes for feature velocity and user experience. Event-day architecture optimizes for predictability and fault isolation. These are mutually exclusive goals. You cannot have both simultaneously at extreme scale.

## End-to-End Request Path Under Peak Load

Understanding the request lifecycle is essential to understanding where failures happen and how to prevent them. Every request follows this path:

```
[Browser] → [DNS] → [CDN/Edge] → [Load Balancer] → [API Gateway] → [Application] → [Cache] → [Database] → [External APIs]
```

Let's walk through this path under peak load, explaining what happens at each layer and why.

**Browser → Edge (CDN)**

The first line of defense is the CDN. On Black Friday, 80-90% of requests should be served from the CDN without touching origin servers. This includes:

* Static assets (JS, CSS, images)
* Product pages (with aggressive caching)
* Category pages
* Search results (cached for 10-60 seconds)

**Cache TTL trade-offs.** Longer TTLs reduce origin load but increase staleness. On Black Friday, stale product pages are acceptable—showing a product as "in stock" when it sold out 30 seconds ago is fine if it prevents origin overload. The checkout path will reveal the truth. Shorter TTLs (5-10 seconds) maintain freshness but leak traffic to origin.

**Edge compute vs origin compute.** Modern CDNs (Cloudflare Workers, Lambda@Edge, Fastly Compute@Edge) can run code at the edge. Use cases:

* A/B test routing without touching origin
* Bot detection and rate limiting
* Serving cached content with personalized headers
* Geographic routing for inventory availability

Edge compute costs more but protects origin capacity. During Black Friday, protecting the origin is paramount.

**Rate limiting as a business rule, not just security.** Rate limiting isn't about preventing attacks—it's about ensuring fairness. A user refreshing 100 times per minute consumes resources that could serve 10 legitimate customers. Rate limiting should be applied at multiple layers:

* CDN: Block obviously abusive patterns (1000+ requests/minute)
* API Gateway: Enforce per-user limits (10 requests/second)
* Application: Protect write operations (1 checkout attempt per 5 seconds)

**Protecting write capacity above all else.** Read traffic can spike 50x. Write traffic might spike 10x. But writes cannot be delayed or dropped—they represent revenue. Therefore:

* Reads can be served stale data
* Reads can be rate-limited aggressively
* Reads can fail gracefully (show cached version)
* Writes must succeed or return clear errors

**ASCII diagram of request path:**

```
┌─────────┐      ┌─────────┐      ┌──────────┐      ┌────────────┐
│ Browser │─────▶│   CDN   │─────▶│ API GW   │─────▶│   App      │
└─────────┘      │ (Edge)  │      │(Rate Lim)│      │ Servers    │
                 └─────────┘      └──────────┘      └────────────┘
                      │                                     │
                      │ 80-90%                             │
                      │ served                             ▼
                      │ here                         ┌───────────┐
                      │                              │Redis Cache│
                      │                              └───────────┘
                      │                                     │
                      │                                     ▼
                      │                              ┌───────────┐
                      └─────────────────────────────▶│ Database  │
                                                     │ (Minimal) │
                                                     └───────────┘
```

**Why origin protection is the top priority:** The origin (application servers + databases) has finite capacity that cannot scale infinitely. If the origin falls over, the entire system fails—CDN cannot help if it has no healthy origin to route to. Therefore, every architectural decision prioritizes keeping origin load minimal and predictable.

## Read Scaling and Cache Hierarchies

Black Friday is primarily a read problem. For every checkout, there are 100 product page views. Solving the read problem means building a multi-layer cache hierarchy where each layer serves as much as possible before falling back to the next.

**Multi-layer caching strategy:**

1. **Browser cache** – Serves repeat requests without network calls (assets, product images)
2. **CDN cache** – Serves cached responses at edge locations (product pages, search results)
3. **API Gateway cache** – Caches API responses per user/session
4. **Application cache (Redis)** – Caches database query results, session data
5. **Database read replicas** – Distributes read load across multiple database instances

**Cache invalidation strategies during sales:**

Cache invalidation is notoriously hard. On Black Friday, it becomes impossible. The solution is to stop trying. Instead:

* **Accept stale data for reads.** Product descriptions don't change during the event. Prices are frozen. Showing 30-second-old inventory status is acceptable.
* **Use time-based invalidation (TTL) instead of event-based.** Don't try to invalidate caches when inventory changes—just set a 10-second TTL.
* **Layer invalidation by criticality.** Product pages can be stale for 60 seconds. Cart contents must be fresh. Inventory at checkout must be real-time.

**When stale data is acceptable:**

* Product images and descriptions
* Category pages and search results
* User profile information (name, address)
* Product reviews and ratings
* Recommendation lists

**When stale data is dangerous:**

* Inventory during checkout (must be real-time)
* Payment status (must be authoritative)
* Order confirmation details
* Pricing during cart and checkout (though prices are frozen)

**Trade-offs explained:**

* **Freshness vs survivability** – Real-time data requires constant database queries. Cached data might be stale but keeps the system alive. Under extreme load, survivability wins.
* **Complexity vs predictability** – Smart cache invalidation is complex and can fail in unexpected ways. Dumb TTL-based caching is predictable and fails gracefully.

**Practical caching rules for Black Friday:**

* Product pages: 60-second CDN cache, 5-minute browser cache
* Search results: 10-second CDN cache (users expect fresh results)
* Category pages: 30-second CDN cache
* Cart contents: No CDN cache, 5-second application cache
* Checkout pages: No cache at any layer
* Order confirmation: No cache, but serve from queue immediately

**Cache warming strategies:**

Before the event, pre-populate caches with expected hot paths:

* Top 100 products
* Main category pages
* Homepage and landing pages
* Common search queries

This ensures the first wave of traffic hits warm caches, not cold databases.

## Inventory Management Under Extreme Concurrency

Inventory is the hardest distributed systems problem in e-commerce. The requirements are contradictory:

* Must prevent overselling (correctness)
* Must handle 10k+ concurrent checkout attempts per SKU (performance)
* Must release inventory from abandoned carts (liveness)
* Must work across multiple data centers (availability)

**Why naive database locking fails:**

A naive implementation uses a database row to track inventory:

```sql
BEGIN TRANSACTION;
SELECT quantity FROM inventory WHERE sku = 'ABC' FOR UPDATE;
-- Check quantity >= requested
UPDATE inventory SET quantity = quantity - 1 WHERE sku = 'ABC';
COMMIT;
```

Under load, this approach creates hot row contention. Every checkout for the same SKU waits for the previous transaction to complete. At 1000 concurrent checkouts, lock wait times become seconds. Transactions timeout. Deadlocks appear. The database falls over.

**Hot row contention explained:**

When thousands of transactions try to update the same database row, they form a queue. Only one can proceed at a time. This serializes all checkouts for popular items, creating a massive bottleneck. Database locks don't scale.

**Inventory as a distributed consistency problem:**

The real question is: *How do we coordinate access to a shared resource (inventory) across many concurrent actors without a bottleneck?*

Several patterns solve this, each with trade-offs.

**Pattern 1: Reservation system with timeout**

Instead of decrementing inventory immediately, reserve it:

```
1. User adds to cart
2. System reserves inventory with 10-minute timeout
3. If checkout completes: confirm reservation, decrement inventory
4. If timeout expires: release reservation back to pool
```

**Implementation with Redis:**

```lua
-- Lua script for atomic reservation (runs on Redis)
local key = KEYS[1]
local amount = tonumber(ARGV[1])
local timeout = tonumber(ARGV[2])

local available = redis.call('GET', key)
if tonumber(available) >= amount then
  redis.call('DECRBY', key, amount)
  redis.call('ZADD', key .. ':reserved', timeout, uuid)
  return 1
else
  return 0
end
```

This approach moves hot spot contention from database to Redis, which handles concurrent operations far better. Redis can process 100k+ operations per second on a single instance.

**Pattern 2: Distributed counters**

Split inventory across multiple counters:

```
SKU 'ABC' has 10,000 units
Split across 100 counters: each counter holds 100 units
Checkout randomly selects a counter and decrements it
```

This distributes contention across multiple keys. Works well for high-volume SKUs but adds complexity for inventory tracking.

**Pattern 3: Atomic operations with Lua scripts**

Redis Lua scripts execute atomically without locks. This allows complex inventory operations to run as single atomic units:

```lua
-- Reserve inventory with concurrent limit
local current = redis.call('GET', inventory_key)
local reserved = redis.call('GET', reserved_key)
if (current - reserved) >= requested then
  redis.call('INCRBY', reserved_key, requested)
  return 1
else
  return 0
end
```

**Pattern 4: Intentional overselling and reconciliation**

Some businesses accept slight overselling (1-2%) and reconcile later:

1. Allow checkout with optimistic inventory (don't lock)
2. After payment succeeds, check real inventory
3. If oversold, cancel order and refund

This maximizes throughput at the cost of occasional customer disappointment. It's a business decision, not a technical one.

**Timeout-based release:**

Reserved inventory must be released if checkout doesn't complete. Options:

* **TTL-based (Redis)** – Key expires after 10 minutes
* **Background job** – Sweeper process releases expired reservations
* **Event-based** – Checkout completion/abandonment triggers release

TTL-based is simplest and most reliable. Background jobs can miss items under load. Event-based is complex but most accurate.

**Failure scenarios:**

* **Crash during payment:** Reservation exists, payment status unknown. Solution: idempotency keys ensure payment isn't charged twice, inventory is released after timeout.
* **Network loss after payment:** Payment succeeded, inventory reserved, but user never sees confirmation. Solution: Asynchronous order processing reconciles payment with inventory.
* **Retry storms:** User clicks "checkout" 10 times because page is slow. Solution: Idempotency keys prevent duplicate orders, rate limiting prevents retry storms.

**Business trade-offs:**

* **Strict inventory:** Never oversell. Leads to lower conversion (false negatives).
* **Optimistic inventory:** Allow slight overselling. Higher conversion, occasional refunds.
* **Reservation timeout:** Short timeout (5 min) = more available inventory. Long timeout (15 min) = better user experience.

Each business chooses based on customer expectations and inventory characteristics.

## Checkout and Payment System Design

Payment processing is the highest-risk dependency in the system. Payment providers have rate limits. They go down. They have variable latency. And they're on the critical path to revenue.

**Why payment is the highest-risk dependency:**

* **External API limits** – Payment providers limit requests per second. Exceed the limit, get throttled.
* **Unpredictable latency** – Payment authorization can take 200ms or 5 seconds.
* **Partial failures** – Payment authorizes but notification fails.
* **Regulatory requirements** – PCI compliance, refund handling, dispute resolution.

**External API limits and failures:**

Payment providers like Stripe, Braintree, or Adyen have documented rate limits (typically 100-500 requests per second per merchant). During Black Friday, you'll hit these limits. The system must handle this gracefully:

* Queue checkout requests
* Retry with exponential backoff
* Show users accurate wait times
* Provide circuit breakers to prevent cascading failures

**User retry behavior:**

When payment is slow, users retry. A 5-second delay causes 50% of users to click again. This creates retry storms that amplify load. Solutions:

* Disable buttons after first click
* Show loading indicators
* Implement idempotency to make retries safe
* Rate limit per user

**Idempotency keys: what they solve, what they don't**

An idempotency key is a unique identifier for each payment attempt:

```
POST /payments
Idempotency-Key: cart-123-attempt-5
{
  "amount": 99.99,
  "cart_id": 123
}
```

If the same key appears twice, the payment provider returns the original result instead of charging again. This solves:

* Duplicate charges from retry storms
* Network failures where the request succeeded but response was lost

Idempotency keys do NOT solve:

* Payment succeeds but order creation fails
* User has multiple browser tabs open
* Distributed transaction coordination

**Transaction boundaries:**

The checkout flow spans multiple systems:

1. Reserve inventory
2. Authorize payment
3. Create order record
4. Send confirmation email
5. Release inventory reservation
6. Trigger fulfillment

These cannot be in a single ACID transaction. Payment authorization calls external APIs. Email sending is asynchronous. Fulfillment is a separate system. The question is: where do we draw transaction boundaries?

**Saga pattern vs transactional outbox:**

* **Saga pattern** – Coordinate multi-step transactions with compensating actions. If payment succeeds but order creation fails, issue a refund.
* **Transactional outbox** – Write events to database in same transaction as state changes, then asynchronously publish them.

Most systems use a hybrid:

```
BEGIN TRANSACTION
  1. Reserve inventory (Redis)
  2. Create order record (database, status = "pending_payment")
  3. Write payment_requested event to outbox table
COMMIT TRANSACTION

Async worker:
  - Read events from outbox
  - Call payment API with idempotency key
  - Update order status based on result
  - Publish order_confirmed event
```

This ensures payment requests aren't lost even if the application crashes.

**Retry strategies and backoff:**

Payment APIs fail. Networks partition. Retries are inevitable. But naive retries amplify load:

```python
# Bad: Fixed retry interval
for i in range(5):
    try:
        return call_payment_api()
    except:
        time.sleep(1)  # Thundering herd
```

```python
# Good: Exponential backoff with jitter
for i in range(5):
    try:
        return call_payment_api()
    except:
        delay = (2 ** i) + random.uniform(0, 1)
        time.sleep(delay)
```

Exponential backoff spreads retries over time, preventing thundering herds.

**Payment confirmation vs settlement:**

Payment authorization happens in seconds. Settlement happens in days. The system must handle this gap:

* **Authorization** – "Can this card be charged $99.99?" → Yes/No in 2 seconds
* **Capture** – "Actually charge the card" → Happens later, can still fail
* **Settlement** – "Transfer money from card network to merchant" → Happens 2-3 days later

Most systems authorize during checkout, capture after order is prepared for shipping, and reconcile settlement daily. This means:

* An order can be "confirmed" but payment later fails
* Reconciliation jobs must handle edge cases
* Financial reporting must account for pending captures

**Real-world failure modes:**

* **Payment authorizes, but order creation fails:** Use transactional outbox to ensure order is eventually created or payment is refunded.
* **User closes browser after payment:** Asynchronous order processing completes checkout, sends email with order details.
* **Payment provider is down:** Queue checkout requests, process them when provider recovers, communicate wait times to users.
* **Partial authorization:** Some payment methods authorize partially (e.g., gift card covers $50 of $100 order). Handle split payments explicitly.

## Asynchronous Architecture and Queue Design

Synchronous systems collapse first under load. If every user request waits for a database query, and database slows down, every request slows down. This creates a cascading failure. Asynchronous architecture breaks this chain.

**Why synchronous systems collapse first:**

Synchronous means "wait for the result." If a system has 1000 concurrent requests and each waits 2 seconds for database, you need 2000 request handler threads. At 10,000 concurrent requests, you need 20,000 threads. This doesn't scale.

Asynchronous means "submit work and move on." The user gets a response immediately ("Your order is being processed"), and the system completes work in the background.

**What belongs on the critical path vs off it:**

**Critical path** (synchronous, must complete before response):

* Payment authorization
* Inventory reservation
* Order record creation
* Fraud detection (basic)

**Off critical path** (asynchronous, can happen after response):

* Email confirmation
* Inventory replenishment notifications
* Analytics and reporting
* Third-party integrations (CRM, data warehouse)
* Advanced fraud analysis
* Loyalty points calculation

The rule: If the user doesn't need the result immediately, make it asynchronous.

**Priority queues and consumer isolation:**

Not all background jobs are equal. Order confirmations matter more than analytics updates. Use priority queues:

* **High priority** – Order confirmations, payment captures, refunds
* **Medium priority** – Inventory updates, customer notifications
* **Low priority** – Analytics, data exports, cleanup jobs

Each priority level has dedicated consumers. This prevents low-priority jobs from starving high-priority ones.

**Backpressure handling:**

Queues don't have infinite capacity. When publishers add work faster than consumers can process, queues fill up. Options:

* **Drop low-priority work** – Analytics can be delayed
* **Increase TTL** – Let messages live longer in queue
* **Scale consumers** – Add more workers (if bottleneck isn't downstream)
* **Shed load** – Reject new work at the source

**Queue saturation strategies:**

When queue depth exceeds threshold:

1. Alert engineers (queue depth > 10k messages)
2. Pause non-critical publishers (stop analytics jobs)
3. Scale consumers (auto-scaling)
4. If queue continues to grow, start dropping low-priority messages

**Pausing consumers intentionally:**

Sometimes downstream systems can't handle the load. Example: Third-party email service is rate-limited. Instead of retrying and failing, pause the consumer:

```python
while True:
    if downstream_healthy():
        message = queue.get()
        process(message)
    else:
        time.sleep(10)  # Pause until healthy
```

**Eventual consistency acceptance:**

Asynchronous architecture means eventual consistency. The order confirmation email arrives 5 seconds after the user sees "Order submitted." Analytics dashboards update with a 2-minute delay. This is acceptable and necessary for survivability.

**Queue design patterns:**

* **At-least-once delivery** – Messages may be delivered multiple times. Make consumers idempotent.
* **Dead letter queues** – Failed messages go to DLQ for manual inspection.
* **Delayed retries** – Failed messages are retried with exponential backoff.
* **Message TTL** – Old messages expire to prevent processing stale work.

## Operational Control Plane

Black Friday is not an automated event. It requires humans making real-time decisions under pressure. The operational control plane is the set of tools and processes that enable this.

**Feature flags as circuit breakers:**

Feature flags aren't just for gradual rollouts. They're emergency shut-off switches. Examples:

* `ENABLE_PRODUCT_RECOMMENDATIONS` – Turn off recommendation engine
* `ENABLE_USER_REVIEWS` – Hide reviews section
* `ENABLE_REALTIME_INVENTORY` – Fall back to cached inventory
* `ENABLE_LOYALTY_POINTS` – Disable points calculation

Each flag has a runbook explaining:

* What it controls
* Performance impact when disabled
* User-visible changes
* How to re-enable safely

**Kill switches by subsystem:**

More granular than feature flags, kill switches disable entire subsystems:

* `KILL_SEARCH` – Serve cached search results only
* `KILL_CART_RECOMMENDATIONS` – Remove upsells from cart page
* `KILL_LIVE_CHAT` – Disable chat widget
* `KILL_EXTERNAL_ANALYTICS` – Stop sending data to third parties

**Waiting rooms and load shedding:**

When traffic exceeds capacity, options are:

* **Waiting room** – Queue users before they reach the site. Show estimated wait time. Better UX than error pages.
* **Load shedding** – Reject excess requests with 503 errors. Fast failure instead of slow failure.

Waiting rooms are implemented at CDN layer:

```
if (current_users > threshold) {
  return waiting_room_page();
} else {
  allow_through();
}
```

**Traffic prioritization:**

Not all users are equal. VIP customers, mobile app users, or users mid-checkout get priority:

```
if (user.is_vip || user.in_checkout) {
  bypass_rate_limit();
} else {
  apply_rate_limit();
}
```

**Why rollback is often impossible during peak:**

Rolling back code during peak traffic is risky. Reasons:

* Rollback requires redeploying, which causes brief outages
* State may have changed in ways incompatible with old code
* Testing rollback under peak load is impossible
* Risk of making things worse is too high

Instead, disable features via flags. This is instant and reversible.

**Why disabling features beats fixing bugs:**

A bug appears during peak. Options:

1. Fix the bug (requires code change, testing, deployment)
2. Disable the feature (flip a flag)

Option 2 is safer and faster. The bug fix can wait until after peak.

**Runbook examples:**

* **High database CPU:** Disable analytics queries, check for slow queries, scale read replicas, consider failing over.
* **Payment provider degraded:** Enable queue-based checkout, communicate delays to users, enable alternative payment methods.
* **Cache miss rate spike:** Check for cache invalidation storm, increase cache TTL, pre-warm caches.

## Observability, Alerts, and Runbooks

During Black Friday, observability must answer three questions:

1. Is the system healthy?
2. If not, what's wrong?
3. What should I do about it?

**What metrics matter during Black Friday:**

* **Business metrics:** Orders per second, revenue per minute, conversion rate
* **System metrics:** Request latency (p50, p95, p99), error rate, queue depth
* **Infrastructure metrics:** CPU, memory, database connections, cache hit rate
* **Dependency metrics:** Payment provider latency, external API error rates

**Why precision matters less than speed:**

On a normal day, you investigate why p99 latency increased from 200ms to 250ms. On Black Friday, you only care if latency exceeds 1 second. Precision doesn't matter—speed of detection and response matters.

**Alert fatigue avoidance:**

* **Fewer, broader alerts** – Don't alert on every small anomaly
* **Meaningful thresholds** – Alert when error rate > 1%, not > 0.1%
* **Auto-resolve alerts** – If an alert clears itself, don't bother humans
* **Alert grouping** – Combine correlated alerts into single notification

**Example dashboards:**

**Dashboard 1: Business Health**

* Orders per minute (time series)
* Revenue per minute (time series)
* Conversion rate (%) (time series)
* Cart abandonment rate (gauge)

**Dashboard 2: System Health**

* Request rate (requests/second)
* Error rate (%)
* p95 Latency (milliseconds)
* Queue depth (count)

**Dashboard 3: Infrastructure**

* Database CPU (%)
* Redis memory usage (%)
* Application server CPU (%)
* Network throughput (Mbps)

**Example alert thresholds:**

* Error rate > 1% for 2 minutes → Page on-call engineer
* p95 latency > 2 seconds for 5 minutes → Warning
* Queue depth > 50k messages → Warning
* Payment provider error rate > 5% → Critical alert

**Role of pre-written runbooks:**

Runbooks are step-by-step guides for handling incidents:

```
Alert: Database CPU > 80%

1. Check slow query log
2. Identify problematic queries
3. If analytics queries: Kill them, disable analytics flag
4. If checkout queries: Scale read replicas
5. If no obvious cause: Fail over to secondary database
6. Communicate status to team
```

Pre-written runbooks reduce time-to-mitigation from 15 minutes to 2 minutes.

## Failure Scenarios and How Systems Survive Them

This section describes real failure scenarios and how well-designed systems survive them.

**Scenario 1: Database slowdown**

**Symptom:** Query latency increases from 10ms to 500ms.

**Cascade:** Application threads wait for queries. Thread pool exhausts. New requests queue. Users see timeouts.

**Automatic response:**

* Circuit breaker trips on slow database
* Application falls back to cached data
* Write operations queue in memory/Redis

**Manual response:**

* Engineers check slow query log
* Kill long-running queries
* Scale database read replicas
* Disable non-essential queries (analytics, reports)

**What is sacrificed:** Real-time data freshness. Users see cached data up to 60 seconds old.

**Scenario 2: Cache failure (Redis cluster down)**

**Symptom:** Redis cluster becomes unavailable.

**Cascade:** Application queries database for every request. Database load increases 50x. Database slows down or crashes.

**Automatic response:**

* Application detects Redis failure, skips cache layer
* Rate limiting kicks in to protect database
* Waiting room activates to shed excess load

**Manual response:**

* Engineers restart Redis cluster
* Pre-warm cache with hot keys
* Gradually increase traffic to origin

**What is sacrificed:** Throughput. System operates at 20% capacity while cache is down.

**Scenario 3: Payment provider outage**

**Symptom:** Payment API returns 503 errors.

**Cascade:** Checkout attempts fail. Users retry. Retry storm amplifies load on payment provider.

**Automatic response:**

* Circuit breaker trips on payment API
* Checkout requests queue locally
* Users shown "Payment processing delayed" message

**Manual response:**

* Engineers enable alternative payment provider (if available)
* Communicate estimated wait time to users
* Monitor queue depth

**What is sacrificed:** Real-time checkout. Orders process with 5-30 minute delay.

**Scenario 4: Partial regional outage (AWS us-east-1 degrades)**

**Symptom:** One AWS region experiences high latency.

**Cascade:** Requests to that region time out. Load balancer detects unhealthy instances. Traffic shifts to other regions.

**Automatic response:**

* Multi-region load balancing routes traffic away
* Local caches in healthy regions serve more traffic
* Database read replicas in healthy regions take more load

**Manual response:**

* Engineers verify failover worked correctly
* Monitor capacity in healthy regions
* Decide whether to scale up or wait for degraded region to recover

**What is sacrificed:** Nothing if architecture is truly multi-region. Otherwise, capacity decreases.

**Scenario 5: Traffic doubles beyond forecast**

**Symptom:** Forecasted 200k RPS, actually seeing 400k RPS.

**Cascade:** Every system is at capacity. Queues fill up. Latency increases. Error rates rise.

**Automatic response:**

* Auto-scaling adds more application servers (if configured)
* Rate limiting protects databases
* Waiting room activates to shed excess load

**Manual response:**

* Engineers disable low-priority features
* Enable aggressive caching (longer TTLs)
* Communicate with business stakeholders about capacity

**What is sacrificed:** User experience. Waiting room delays access. Features disabled.

## What Success Actually Looks Like

Success on Black Friday doesn't mean graphs spiking upward. It means graphs staying flat and predictable.

**Why boring graphs are the goal:**

Exciting graphs mean something unexpected happened. Unexpected things during peak traffic are bad. Success looks like:

* Error rate stays below 0.5% all day
* p95 latency stays below 500ms all day
* No manual interventions required
* No outages

**Why no heroics is success:**

If engineers are frantically restarting services, tuning configurations, and disabling features in real-time, the system wasn't prepared. Success is when engineers sit bored in the war room because everything works as designed.

**How teams evaluate post-event results:**

* **Business metrics:** Total revenue, number of orders, conversion rate
* **Reliability metrics:** Uptime %, error rate, p99 latency
* **Operational metrics:** Number of incidents, time to resolution, manual interventions
* **Capacity metrics:** Peak traffic handled, headroom remaining

**Postmortem culture:**

Even successful events have postmortems. Questions:

* What almost broke?
* Where did we get lucky?
* What should we change for next year?
* What surprised us?

Blameless postmortems improve systems year over year.

**Metrics used after the event:**

* **Lost revenue due to errors** – Estimated value of failed checkouts
* **Cost of infrastructure** – Cloud bill for the event
* **Engineering time** – Hours spent preparing and monitoring
* **Customer complaints** – Support tickets related to site performance

## Pre-Launch and Event-Day Playbook

This section provides a practical, actionable guide for preparing for and executing a Black Friday-level event.

**Pre-launch checklist (4-6 weeks before):**

* [ ] Load test at 2x forecasted peak (validate auto-scaling, failure modes)
* [ ] Review and test all feature flags and kill switches
* [ ] Freeze non-essential code changes (2 weeks before event)
* [ ] Pre-warm caches with hot keys (1 day before)
* [ ] Conduct failover drills (database, cache, payment provider)
* [ ] Pre-write runbooks for common failure scenarios
* [ ] Schedule on-call rotations and war room staffing
* [ ] Set up monitoring dashboards and alerts
* [ ] Disable automatic deployments during event window
* [ ] Communicate with third-party providers (payment, shipping, email)
* [ ] Set up status page for customer communication
* [ ] Review SLAs with cloud provider and enable enterprise support

**Event-day decision rules:**

* **If error rate > 1%:** Investigate immediately, disable suspected feature
* **If database CPU > 80%:** Scale read replicas, disable analytics
* **If queue depth > 100k:** Pause low-priority consumers, scale high-priority consumers
* **If payment provider latency > 5s:** Enable queueing, communicate delays
* **If traffic > 150% forecast:** Enable waiting room

**Post-event cleanup steps:**

* [ ] Re-enable disabled features gradually (over 24 hours)
* [ ] Process queued jobs (emails, analytics, third-party integrations)
* [ ] Reconcile payments and orders
* [ ] Generate revenue and reliability reports
* [ ] Conduct postmortem meeting (within 1 week)
* [ ] Document lessons learned
* [ ] Plan infrastructure changes for next year
* [ ] Scale down infrastructure to normal levels (gradually)
* [ ] Thank the team

## Questions

1. **Why is Black Friday considered a correctness-under-stress problem rather than just a scaling problem?** How does this distinction change architectural decisions?

2. **What are the key trade-offs between data freshness and system survivability** when designing cache hierarchies for peak traffic events?

<!-- 
Subtopic Selection Rationale:
The 12 subtopics were chosen to partition the problem space of Black Friday architecture:
1. Introduction establishes the problem scope
2. Philosophy explains the mindset shift required
3-7. Cover the technical architecture from request ingress to data persistence
8-9. Address operational concerns during the event
10-11. Cover failure handling and success criteria
12. Provides actionable guidance

Each subtopic builds on previous ones while remaining self-contained. The progression moves from conceptual (philosophy) to technical (request path, caching, inventory) to operational (control plane, observability) to practical (playbook).

Selection was based on: 
- Relevance to the core thesis (correctness under stress)
- Longevity of concepts (caching, queues, failure handling are timeless)
- Decision impact (inventory management and payment are revenue-critical)
- Evidence quality (patterns are widely documented in SRE literature)
-->
