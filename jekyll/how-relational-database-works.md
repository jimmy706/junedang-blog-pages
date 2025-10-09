---
title: "How databases really store and find your rows"
description: "Inside relational database storage: identifiers, pages, heaps, indexes, and how query planners stitch them together."
tags: [research, database, relational, storage, sql]
date: 2025-09-20
image: https://storage.googleapis.com/junedang_blog_images/how-relational-database-works/database_physical_storage_hierachy.webp
---

SQL statements look simple, yet the database must translate them into precise I/O operations. Relational engines map tables onto disk blocks, track internal identifiers, and coordinate buffer pools so they touch as few pages as possible. Understanding these internals helps you tune queries, predict maintenance tasks, and explain why an "easy" change sometimes takes hours to run.

> **At a glance**
> - Every row receives an internal identifier (TID/ROWID/RID) that points to a page number and slot on disk.
> - Data lives inside fixed-size pages (4–16 KB) that act as the fundamental unit of I/O and buffering.
> - Heap tables append rows without ordering, trading cheap inserts for slower predicate lookups.
> - Indexes (usually B-trees) map key values to heap locations, enabling logarithmic access patterns.
> - Planners choose between sequential scans, index scans, bitmap scans, and joins based on statistics and cost models.

## Internal identifiers and physical layout

User-visible primary keys are not how the engine finds rows. PostgreSQL assigns each tuple a `ctid` (page, slot). Oracle exposes `ROWID`, and SQL Server uses `RID` for heap tables. These identifiers feed into the storage manager, which translates them into byte offsets within pages.

```sql
SELECT ctid, id, name, hire_date
FROM employees
LIMIT 3;
-- Example output:
--  ctid  | id |   name   | hire_date
-- (0,1)  | 42 | Ada Lovelace | 2021-05-01
```

Systems store row metadata alongside column data: null bitmaps, variable-length offsets, and visibility flags for MVCC. Updating a row often means creating a new tuple version elsewhere and adjusting pointers, which keeps transactions isolated but makes vacuuming or garbage collection necessary.

## Pages and buffer pools

Pages (sometimes called blocks) bundle many rows into a single I/O. A typical 8 KB page might hold 50–200 tuples depending on column widths. Each page contains a header, a line pointer array with slot metadata, free space tracking, and the actual row data packed from the end of the page backward.

When queries run, the buffer manager pulls pages into shared memory buffers. Replacement algorithms such as clock-sweep or LRU-variants decide which pages to evict. Sequential scans touch every page in order, while index scans hop across pages, benefiting from warmed caches. Monitoring views like `pg_stat_io` or `sys.dm_io_virtual_file_stats` reveal whether workloads are I/O-bound or cache-friendly.

## Heap storage and table organization

Heap-organized tables append new rows wherever free space exists. Inserts are cheap and independent of key order, which is perfect for write-heavy ingest pipelines. Over time, deleted or updated tuples leave gaps. Autovacuum (PostgreSQL) or background cleanup tasks reclaim dead space and compact pages to prevent bloat.

Row format matters too. Wide tables might spill large columns (TEXT/BLOB) into overflow segments, leaving only pointers in the main page. Partitioning strategies split large heaps into multiple child tables to keep page counts manageable and improve pruning during scans.

## Index structures and access paths

B-tree indexes dominate transactional workloads because they stay balanced and support range queries. An index entry typically stores the key value plus the row identifier, pointing back into the heap. Unique indexes enforce constraints, while non-unique indexes handle duplicates by chaining row IDs.

```sql
CREATE INDEX idx_hire_date ON employees (hire_date);
SELECT name FROM employees WHERE hire_date = DATE '2023-01-01';
-- Planner can perform an index scan, follow matching entries, then fetch rows via their TIDs.
```

Other structures supplement B-trees: hash indexes for exact matches, GIN/GiST for full-text or spatial data, and covering indexes that include extra columns to avoid heap lookups entirely. Maintaining indexes costs extra writes, so monitor `pg_stat_user_indexes` or DMV equivalents to prune unused ones.

## Query execution flow

The planner evaluates statistics (histograms, correlation, row counts) to choose scan and join strategies. For simple filters on non-indexed columns, a sequential scan reads every page. With selective predicates, the planner picks an index scan or a bitmap heap scan that batches TIDs to reduce random I/O. Join algorithms (nested loop, hash, merge) consume these streams of tuples, respecting transaction visibility rules.

Once execution begins, the executor requests pages from the buffer manager, applies filters, and returns rows. Caching, work_mem (or sort/hash memory), and parallel workers all influence how many physical reads are required. Tools like `EXPLAIN (ANALYZE, BUFFERS)` surface actual page hits versus misses so you can validate expectations.

## Design and trade-offs

| Option                 | Pros                                                | Cons                                                   | Use when |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------ | -------- |
| Heap-organized table   | Fast inserts, simple storage, easy bulk load        | Full scans for predicates, needs vacuum/cleanup        | Write-heavy tables without strict ordering |
| Clustered index/table  | Rows stored in key order, great for range queries   | Slower random inserts, requires periodic rebalancing   | OLTP workloads with key-range access |
| Covering secondary index | Serves queries without heap lookups               | Higher storage cost, extra write amplification         | Read-heavy queries targeting small column subsets |

## Questions

1. How would you diagnose and fix page bloat when autovacuum cannot keep up with update-heavy workloads?
2. What statistics or telemetry would convince you to create (or drop) a secondary index on a busy table?

<!-- Subtopic rationale: Focused on identifiers, page buffering, heap organization, index structures, and planner execution to cover the full row-access lifecycle. -->
