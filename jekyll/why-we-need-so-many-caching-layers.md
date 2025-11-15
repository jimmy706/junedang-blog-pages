---
title: "Why We Need So Many Caching Layers"
description: "Understanding why modern systems require multiple levels of caching—from CPU caches to CDNs—and how they form a speed pyramid."
tags: [research, caching, operating-systems, performance, architecture]
date: 2025-11-15
---

Picture a skyscraper with a single elevator moving at walking speed. Every trip from floor 50 to the ground-floor café takes fifteen minutes. That's computing without caching. Now add express elevators to every tenth floor, escalators between nearby floors, and coffee machines on each level. That's layered caching—distributing speed so no one waits for the slowest part.

Modern systems have L1, L2, L3 CPU caches, OS page caches, database caches, application caches, and CDN edge caches. This looks redundant until you see each hides a different performance cliff. CPU to RAM: nanoseconds to microseconds—100x. RAM to disk: microseconds to milliseconds—1000x. Disk to network: milliseconds to tens of milliseconds—10-100x. Can't solve a 100,000x latency problem with one cache. Need layers.

## The Latency Pyramid

Network latency: tens to hundreds of milliseconds cross-continental. Disk I/O: single-digit milliseconds. RAM: hundreds of nanoseconds. CPU registers: sub-nanosecond. Each layer is orders of magnitude faster, and each cache hides the layer below.

Browser requests a page? Check browser cache first. Miss? Ask CDN. CDN checks edge cache. Miss? Origin server checks application cache, then database query cache, then disk. Every hit saves you from falling down. Every miss waits for the next slowest thing.

## CPU Caches: Covering the Memory Wall

The CPU runs at gigahertz speeds, but RAM can't keep up. Fetching from memory: 100-200 CPU cycles—time for dozens of instructions. L1 cache: 3-4 cycles. L2: 10-15. L3 (shared): 40-50. These exploit instruction locality—code reuses memory in tight loops—and prefetch what's next. Without them, CPUs idle waiting for data.

Cache coherence keeps cores synchronized. Core 1 writes to an address Core 2 cached? Hardware invalidates Core 2's copy. This tight coordination works because all CPU caches sit on-chip with fast buses. Consistency is strict: coherent memory across cores. Cost: latency from coherence traffic. But at nanosecond timescales, microsecond delays are catastrophic.

## OS Page Cache: Hiding Disk Latency

Disk I/O: milliseconds—a million nanoseconds, enough for tens of millions of CPU instructions. The OS page cache in RAM caches frequent disk blocks. Read a file? OS pulls entire 4KB pages, betting you'll read nearby data soon. Spatial locality: sequential file access.

Page cache uses weaker consistency. Write to a file, OS buffers in cache, flushes to disk seconds later. Asynchronous write-back boosts performance but risks data loss on crashes. Databases use synchronous writes or journals. Trade-off: most applications choose speed over instant persistence.

## Database Query Cache: Skipping Computation

Databases cache query results, not just disk blocks. Parsing SQL, planning execution, scanning indexes—all expensive. Same query runs repeatedly? Database skips the work, returns cached result. Optimizes repeated access: dashboards, leaderboards, profile lookups.

Catch: staleness. Data changes, cached results become stale. Databases use TTL or write-through invalidation. Distributed databases loosen consistency: eventual consistency lets replicas serve stale reads, betting low latency beats perfect freshness. Works because many apps tolerate slightly old data.

## Application Cache: Bridging Services

Distributed systems: services talk over network, every hop adds milliseconds. Application caches (Redis, Memcached) sit in memory, cache backend results or expensive computations. General-purpose: session data, user preferences, rendered HTML, API responses.

Weak consistency. Entry expires or evicted? Application fetches fresh data, repopulates. Misses slow the system temporarily, don't break it. Crucial: cache is optimization, not dependency. Heavy reliance on caching creates brittleness when cache fails. Good designs: caches as accelerators, not load-bearing.

## CDN Edge Cache: Defeating Geography

Network latency: limited by light speed. Sydney to Virginia: 16,000km—80ms minimum round-trip. CDNs cache content at edge locations near users. Requests hit nearby caches, return in single-digit milliseconds instead of crossing continents.

Loosest consistency. Edge servers cache with TTLs in minutes or hours. Origin updates a file? Edge serves stale content until TTL expires or manual purge. Works because most web content—images, stylesheets, JavaScript—is immutable or changes infrequently. Dynamic content? CDNs fall back to origin, accepting latency when freshness matters.

## Cumulative, Not Redundant

Caching layers aren't redundant—they're cumulative. Each optimizes a different problem. L1 hides CPU-to-L2 latency. L2 hides L2-to-RAM. Page cache hides RAM-to-disk. Query caches hide computation. Application caches hide service-to-service network latency. CDNs hide geography.

Speed pyramid: each layer wider and slower than above, but collectively creating a smooth gradient from nanoseconds to milliseconds. Remove one layer, expose a cliff. Remove L1, CPU stalls for L2. Remove page cache, every file read hits disk. Remove CDN, Asian users wait for transatlantic round-trips.

Cache miss costs escalate downward. L1 miss: 10-20 cycles. Page cache miss: millions of cycles (disk seek). CDN miss: tens of millions (cross-continental hop). Layered caching is risk mitigation: each layer reduces probability of falling to the next slower tier.

## Design and Trade-offs

| Cache Layer | Latency | Consistency | Invalidation Strategy | Typical Use Case |
|-------------|---------|-------------|-----------------------|------------------|
| L1/L2/L3 CPU | 1-50 cycles | Strict coherence | Hardware-managed | Instruction/data locality |
| OS Page Cache | 100-200ns | Write-back, async flush | LRU eviction | Disk block caching |
| Database Query | 1-10ms | Invalidate on write | TTL or explicit purge | Repeated query results |
| Application Cache | 1-5ms | Eventual consistency | TTL or manual eviction | Session data, API responses |
| CDN Edge | 10-50ms | Weak, TTL-based | Time or explicit purge | Static assets, media |

## Questions

1. Why does each caching layer use progressively weaker consistency models as you move from CPU caches to CDNs?
2. What would happen to system performance if you removed the OS page cache but kept all other caching layers intact?

<!-- Selection rationale: Subtopics chosen to partition the caching problem space by latency tier (CPU, memory, disk, network, geography). Each subtopic covers a distinct performance gap and consistency model. Topics are enduring architectural concepts, not tied to specific tools. Real-world examples anchor abstract latency numbers to observable system behavior. -->
