---
title: How Relational Databases Work
description: Understanding how relational databases store data in tables, use keys to enforce relationships, and guarantee ACID properties through practical PostgreSQL and MySQL examples.
tags: [research, database, postgresql, mysql, sql]
date: 2024-09-17
---

Relational databases organize data into structured tables with well-defined relationships, forming the backbone of modern applications. This guide explores how they work internally, comparing PostgreSQL and MySQL with practical examples covering ACID properties, transactions, and operational differences.

> **At a glance**
> - Relational databases organize data in tables with rows and columns, enforcing relationships through keys
> - ACID properties (Atomicity, Consistency, Isolation, Durability) guarantee reliable transactions
> - PostgreSQL uses MVCC for concurrency with stricter ACID compliance and extensible architecture
> - MySQL offers multiple storage engines with InnoDB as default, optimized for web applications
> - Both systems support indexes, foreign keys, and transactions but differ in isolation levels and JSON handling
> - Query execution plans help optimize performance through EXPLAIN statements
> - Operational differences include replication methods, backup strategies, and extension ecosystems

## Introduction to the Relational Model

The relational model organizes data into tables (relations) where rows represent records and columns represent attributes. It uses mathematical set theory to define relationships through primary and foreign keys.

**Key principles:**
- Data integrity through constraints and normalization
- Declarative SQL queries
- ACID transaction guarantees
- Data independence

## Core Primitives

### Tables and Keys

Tables store structured data with defined schemas. Primary keys uniquely identify rows, while foreign keys establish relationships between tables.

```sql
-- PostgreSQL/MySQL compatible schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);
```

### Indexes

Indexes accelerate data retrieval by creating optimized lookup structures.

```sql
-- B-tree index for frequent lookups
CREATE INDEX idx_user_email ON users(email);

-- Composite index for complex queries
CREATE INDEX idx_order_status_date ON orders(status, created_at);
```

### Transactions

Transactions group operations into atomic units that either succeed completely or fail completely.

```sql
BEGIN;
UPDATE users SET last_login = NOW() WHERE id = 1;
INSERT INTO user_sessions (user_id, token) VALUES (1, 'abc123');
COMMIT;
```

## PostgreSQL Schema and Workflow

PostgreSQL emphasizes standards compliance and extensibility with advanced features.

```sql
-- PostgreSQL-specific features
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    metadata JSONB,
    search_vector TSVECTOR
);

-- JSONB indexing and full-text search
CREATE INDEX idx_product_metadata ON products USING GIN(metadata);
CREATE INDEX idx_product_search ON products USING GIN(search_vector);

-- Complex query with JSON operations
SELECT name, metadata->>'category' as category
FROM products 
WHERE metadata @> '{"featured": true}'
AND search_vector @@ to_tsquery('electronics');
```

## MySQL Schema and Workflow

MySQL focuses on performance and ease of use with multiple storage engines.

```sql
-- MySQL with InnoDB storage engine
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- MySQL JSON functions
SELECT name, JSON_EXTRACT(metadata, '$.category') as category
FROM products 
WHERE JSON_EXTRACT(metadata, '$.featured') = true;
```

## Query Execution and Explain Plans

Both systems provide EXPLAIN commands to analyze query performance.

```sql
-- PostgreSQL EXPLAIN
EXPLAIN (ANALYZE, BUFFERS) 
SELECT u.email, COUNT(o.id) as order_count
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
GROUP BY u.id, u.email;

-- MySQL EXPLAIN
EXPLAIN FORMAT=JSON
SELECT u.email, COUNT(o.id) as order_count
FROM users u 
LEFT JOIN orders o ON u.id = o.user_id 
GROUP BY u.id, u.email;
```

Key metrics include scan types (sequential vs. index), join algorithms (nested loop, hash, merge), and cost estimates.

## Concurrency and Isolation

### PostgreSQL MVCC

PostgreSQL uses Multi-Version Concurrency Control (MVCC) where each transaction sees a consistent snapshot of data. Default isolation level is READ COMMITTED.

```sql
-- PostgreSQL isolation levels
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
SELECT balance FROM accounts WHERE id = 1; -- Consistent snapshot
-- Other transactions can't modify this view
COMMIT;
```

### MySQL Locking

MySQL InnoDB uses row-level locking with MVCC. Default isolation is REPEATABLE READ, which prevents phantom reads.

```sql
-- MySQL locking behavior
START TRANSACTION;
SELECT balance FROM accounts WHERE id = 1 FOR UPDATE; -- Row lock
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

## Operational Contrasts

| Feature | PostgreSQL | MySQL |
|---------|------------|-------|
| **Default Isolation** | READ COMMITTED | REPEATABLE READ |
| **JSON Support** | Native JSONB with operators | JSON with functions |
| **Replication** | Streaming, logical | Master-slave, group replication |
| **Extensions** | Rich ecosystem (PostGIS, pgcrypto) | Limited plugins |
| **Backup Strategy** | pg_dump, pg_basebackup | mysqldump, XtraBackup |
| **Full-text Search** | Built-in with tsvector | Requires external engines |

### Design Trade-offs

| Approach | Pros | Cons | Best For |
|----------|------|------|----------|
| **PostgreSQL** | Standards compliance, advanced features, extensibility | Higher resource usage, complex configuration | Complex analytics, geospatial data, JSON-heavy applications |
| **MySQL** | High performance, simple setup, wide adoption | Less strict standards, limited extensions | Web applications, read-heavy workloads, simple schemas |

**Further reading:**
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Reference Manual](https://dev.mysql.com/doc/)
- [ACID Properties Explained](https://en.wikipedia.org/wiki/ACID)

<!-- Selection rationale: These subtopics cover the essential aspects of relational databases - foundational concepts, practical implementation differences between major systems, performance optimization, and operational considerations. They provide both theoretical understanding and hands-on knowledge needed for database selection and management decisions. -->