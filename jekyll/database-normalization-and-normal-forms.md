---
title: "Database Normalization and Normal Forms (1NF, 2NF, 3NF, BCNF)"
description: "A practical walk through normalization, from one messy orders table to 1NF, 2NF, 3NF and BCNF, and when to break the rules on purpose"
tags: [database, sql, postgresql, normalization, system-design]
image: https://storage.googleapis.com/junedang_blog_images/database-normalization-and-normal-forms/database-normalization.webp
date: 2026-09-30
---

Most schemas start as one convenient table. Normalization is the process of restructuring tables so each fact is stored in exactly one place. A normal form is a named checkpoint on that path. We will take one e-commerce table and fix it step by step. It assumes you know basic SQL, and it builds on [how relational databases work](/posts/how-relational-database-works).

## The Table That Looks Fine

Here is the first version of `orders`, the kind many of us have written on day one:

```sql
orders(order_id, customer_id, customer_name, customer_address,
       products, product_names, product_prices, quantities)
```

| order_id | customer_name | products | product_names | quantities |
|---|---|---|---|---|
| 1 | Ana | 10, 11 | Mouse, Keyboard | 2, 1 |

One row per order, no joins. It works until the system grows.

- **Redundancy**: Ana's address is copied into every order she places.
- **Update anomaly**: she moves, and you must fix every row. Miss one and the data disagrees with itself.
- **Insert anomaly**: you cannot record a new product until someone orders it.
- **Delete anomaly**: delete her only order and you lose the customer and product info too.

### First normal form (1NF)

The rule: one cell holds one atomic value. `10, 11` in a single cell breaks it. You cannot index it, join on it, or count it reliably. The fix is one row per product per order:

```sql
order_line(order_id, product_id, product_name, product_price, quantity,
           customer_id, customer_name, customer_address)
```

Now we need keys. A **candidate key** is a minimal set of columns that uniquely identifies a row. The **primary key** is the candidate key you choose. A **composite key** spans several columns. Here it is `(order_id, product_id)`.

The trade-off: more rows, and the redundancy is worse than before.

## Second Normal Form (2NF): The Whole Key

A **functional dependency** (FD) means one column set determines another. Written `A → B`: knowing A tells you B. In `order_line`:

```
order_id   → customer_id, customer_name, customer_address
product_id → product_name, product_price
(order_id, product_id) → quantity
```

A **partial dependency** is when a column depends on only part of a composite key. Customer data depends only on `order_id`, product data only on `product_id`. 2NF forbids this for non-key columns. Split the table:

```sql
CREATE TABLE orders   (order_id BIGINT PRIMARY KEY, customer_id BIGINT, created_at TIMESTAMPTZ,
                       customer_name TEXT, customer_address TEXT);
CREATE TABLE products (product_id BIGINT PRIMARY KEY, name TEXT, price NUMERIC(10,2));
CREATE TABLE order_item (
  order_id   BIGINT REFERENCES orders,
  product_id BIGINT REFERENCES products,
  quantity   INT NOT NULL,
  PRIMARY KEY (order_id, product_id)
);
```

Product names now live once, which fixes the product insert and update anomalies. Trade-off: reading an order needs joins.

## Third Normal Form (3NF): Nothing But the Key

`orders` still repeats customer details. Here `order_id → customer_id` and `customer_id → customer_name`, so `order_id → customer_name` only through a middle column. That is a **transitive dependency**: a non-key column determined by another non-key column.

The classic illustration:

```
employee_id → department_id → department_name
```

`department_name` is a fact about the department, not the employee. Rename a department and you update every employee row. 3NF says every non-key column must depend directly on the key. Extract the middle column:

```sql
CREATE TABLE customers (customer_id BIGINT PRIMARY KEY, name TEXT, address TEXT);
CREATE TABLE orders (order_id BIGINT PRIMARY KEY,
                     customer_id BIGINT REFERENCES customers,
                     created_at TIMESTAMPTZ);
```

The mnemonic is "the key, the whole key, and nothing but the key": the key (1NF), the whole key (2NF), nothing but the key (3NF). It is a memory aid, not the formal definition. Formally, 3NF requires that for every dependency `X → A`, either X is a superkey (any column set that uniquely identifies a row) or A is part of some candidate key.

## BCNF in Brief

Boyce-Codd normal form (BCNF) removes that second escape hatch: every determinant (the left side of an FD) must be a superkey. Example: students enroll in courses, each teacher teaches one course, but a course may have several teachers.

```
(student, course) → teacher
teacher → course
```

Candidate keys are `(student, course)` and `(student, teacher)`. Since `course` is part of a key, 3NF allows `teacher → course`. BCNF does not, because `teacher` is not a superkey. The result is that the teacher-course pairing is repeated for every student. Fix it by splitting into `teacher_course(teacher, course)` and `enrollment(student, teacher)`. The cost: the original rule "a student has one teacher per course" can no longer be enforced by a simple key. 4NF and 5NF cover multi-valued and join dependencies and rarely come up.

## When Normalization Is Not Always the Right Answer

Notice that our `products.price` is now a trap. If the price changes, old orders silently change too. So we deliberately copy it:

```sql
ALTER TABLE order_item ADD COLUMN unit_price_at_purchase NUMERIC(10,2) NOT NULL;
```

This is not redundancy in the bad sense. It records a historical fact: what the customer actually paid. The current price and the price at purchase are different facts that happen to look alike.

The distinction that matters: **accidental duplication** is the same fact stored twice with no plan to keep it consistent. **Intentional denormalization** is a documented decision, with a known cost and a mechanism to keep it correct. Common reasons:

| Situation | Approach |
|---|---|
| Historical snapshots | Copy price, address, or tax rate at purchase time |
| Read-heavy pages, costly joins | Duplicate a hot column or total, kept in sync by code or triggers |
| Dashboards | Materialized view, refreshed on a schedule |

```sql
CREATE MATERIALIZED VIEW daily_sales AS
SELECT date_trunc('day', o.created_at) AS day, SUM(i.quantity * i.unit_price_at_purchase) AS revenue
FROM orders o JOIN order_item i USING (order_id) GROUP BY 1;
```

Normalize first, then denormalize where measurements justify it. Analytics warehouses take this furthest with wide, scan-friendly tables.

## Closing Thoughts

Normalization is about asking where each fact should live. The interview mental model:

- 1NF: atomic values
- 2NF: depend on the whole key
- 3NF: no inappropriate transitive dependency
- BCNF: every determinant is a candidate key or superkey

## Questions

1. In `order_item(order_id, product_id, product_name, quantity)`, which dependency violates 2NF, and how do you fix it?
2. Why is `unit_price_at_purchase` not a 3NF violation worth fixing?

<!-- Selection rationale: subtopics follow the normalization progression (1NF, 2NF, 3NF, BCNF) plus the practical counterweight of denormalization, per the issue. Sources: Codd 1970 relational model paper; PostgreSQL documentation on materialized views; Kent, "A Simple Guide to Five Normal Forms in Relational Database Theory" (1983). -->
