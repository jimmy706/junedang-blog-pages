---
title: "How Relational Database Works"
description: "Understanding the internal mechanisms of relational databases from storage structures to query processing."
tags: [research, database, relational, storage, sql]
date: 2025-01-03
---

Relational databases form the backbone of most modern applications, but few developers understand how they store and retrieve data efficiently. This guide explores the internal mechanisms that make databases work, from row identification to physical storage structures and query processing.

> **At a glance**
> - Databases use internal ID systems to uniquely identify and track table rows
> - Data is organized into rows, columns, and pages for efficient storage and retrieval
> - Pages are the fundamental unit of database I/O operations between disk and memory
> - Heaps provide unordered storage structures for table data with pointer-based access
> - Query processors leverage page-based architecture to minimize disk operations
> - Understanding internal structures helps optimize database design and query performance

## Internal ID Systems and Row Tracking

Relational databases use sophisticated internal identification systems to track and locate table rows efficiently. Each row must be uniquely identifiable for updates, deletes, and joins to work correctly.

**Row identifiers vary by database system.** PostgreSQL uses a Tuple Identifier (TID) consisting of a page number and slot number within that page. Oracle employs ROWID, which encodes file number, block number, and row number. SQL Server uses Row Identifiers (RIDs) for heap tables and clustered index keys for indexed tables.

**Key characteristics:**
- Provide fast direct access to specific rows
- Remain stable during transactions unless major reorganization occurs
- Enable efficient join operations and constraint checking
- Support transaction isolation and concurrency control

**Example accessing row identifiers:**
```sql
-- PostgreSQL: View internal row identifiers
SELECT ctid, customer_name FROM customers LIMIT 5;
-- Result: (0,1) | John Smith

-- Oracle: Access ROWID (conceptual example)
SELECT ROWID, customer_name FROM customers WHERE ROWNUM <= 5;
-- Result: AAAFfAAABAAA1CR | John Smith
```

## Rows, Columns, and Pages Structure

Database systems organize data into a hierarchical structure of rows, columns, and pages to balance storage efficiency with access performance.

**Rows contain related data fields.** Each row represents a single entity instance with fixed or variable-length columns. Variable-length columns (like VARCHAR) require additional metadata to track field boundaries and lengths.

**Pages are fixed-size storage units.** Most databases use 4KB, 8KB, or 16KB pages as the fundamental unit of disk I/O. Each page contains multiple rows along with metadata including page headers, row directories, and free space tracking.

**Physical storage layout:**
- Page header: Contains page type, free space pointers, and transaction information
- Row directory: Maps slot numbers to actual row locations within the page
- Row data: Actual column values, often with length prefixes for variable fields
- Free space: Available area for new rows or row expansion

**Example page inspection:**
```sql
-- PostgreSQL: Examine page structure (requires pageinspect extension)
SELECT * FROM heap_page_items(get_raw_page('customers', 0));

-- SQL Server: View page information
DBCC PAGE(database_name, file_id, page_id, 3);
```

## Pages and Query Processing

Database query processors are designed around page-based I/O to minimize expensive disk operations and maximize cache efficiency.

**Pages enable batch processing.** Instead of reading individual rows, the database reads entire pages into memory buffers. This approach reduces I/O overhead since accessing neighboring rows becomes essentially free once a page is loaded.

**Buffer pool management controls page caching.** The database maintains a buffer pool in memory containing recently accessed pages. Popular algorithms like LRU (Least Recently Used) determine which pages to evict when memory fills up.

**Query execution leverages page boundaries.** Sequential scans read pages in order, while index scans may jump between pages following pointer chains. Range queries benefit when target rows cluster within few pages.

**Optimizations based on page structure:**
- Index pages contain many key-pointer pairs for fast navigation
- Clustered indexes physically order data pages by key values
- Prefetching reads anticipated pages before they're needed
- Page compression reduces I/O by packing more data per page

**Example query processing:**
```sql
-- Query benefiting from page locality
SELECT * FROM orders 
WHERE order_date BETWEEN '2024-01-01' AND '2024-01-31'
ORDER BY order_date;

-- If data is clustered by order_date, this reads few contiguous pages
-- If not clustered, query may read many scattered pages
```

## Heap Storage and Data Organization

Heaps provide the fundamental unordered storage structure for table data in most relational database systems.

**Heaps store rows without predefined order.** New rows go into any available space, typically the first page with sufficient free space. This approach minimizes insertion overhead but can lead to fragmentation over time.

**Free space management tracks available storage.** Databases maintain free space maps or similar structures to quickly locate pages with room for new rows. PostgreSQL uses a Free Space Map (FSM), while SQL Server maintains Page Free Space (PFS) pages.

**Heap organization characteristics:**
- Fast inserts since no ordering is required
- Updates may require row movement if expanded row doesn't fit
- Deletes leave gaps that can be reused by future inserts
- No inherent clustering means related rows may scatter across pages

**Alternative storage structures:**
- Clustered indexes physically order rows by key values
- Index-organized tables store data within index structure
- Partitioned tables split data across multiple heap structures

**Example heap operations:**
```sql
-- Create table using heap storage (default in most databases)
CREATE TABLE product_reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INTEGER,
    review_text TEXT,
    created_date TIMESTAMP
);

-- Insert creates rows in heap without specific order
INSERT INTO product_reviews (product_id, review_text, created_date)
VALUES (101, 'Great product!', NOW());

-- Query may require full table scan if no supporting indexes
SELECT * FROM product_reviews WHERE product_id = 101;
```

## Design and Trade-offs

| Approach | Advantages | Disadvantages | Best For |
|----------|------------|---------------|----------|
| **Heap Storage** | Fast inserts, simple structure | Poor range query performance | High-volume transactional systems |
| **Clustered Index** | Excellent range queries, data locality | Slower inserts, potential fragmentation | Reporting and analytics workloads |
| **Large Pages** | Reduced I/O overhead, better compression | Higher memory usage, poor for small queries | Data warehouse environments |
| **Small Pages** | Lower memory footprint, faster random access | More I/O operations, reduced compression | OLTP systems with point queries |

<!-- Selection rationale: These four subtopics cover the essential internal mechanisms of relational databases as requested - ID systems for row tracking, physical storage organization through rows/columns/pages, query processing optimization via page-based I/O, and heap storage as the fundamental data organization method. Each concept builds upon the others to provide comprehensive understanding of database internals. -->