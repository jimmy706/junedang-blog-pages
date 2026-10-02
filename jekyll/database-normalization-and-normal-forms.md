---
title: "Database Normalization and Normal Forms (1NF, 2NF, 3NF, BCNF)"
description: "A practical walk through normalization, from one messy orders table to 1NF, 2NF, 3NF and BCNF, and when to break the rules on purpose"
tags: [database, sql, postgresql, normalization, system-design]
image: https://storage.googleapis.com/junedang_blog_images/database-normalization-and-normal-forms/thumbnail.webp
date: 2026-09-30
---

Most schemas start life as one convenient table. Then the data grows, and that table starts to hurt. Normalization means restructuring tables so each fact lives in exactly one place, and a normal form is a named checkpoint along the way. In this post we take one messy e-commerce table and fix it step by step. You only need basic SQL, and if you want the background first, read [how relational databases work](/posts/how-relational-database-works).

## The Table That Looks Fine

Here's the first version of `orders`, the kind many of us wrote on day one:

<pre class="mermaid">
erDiagram
  ORDERS {
    BIGINT order_id PK
    BIGINT customer_id
    TEXT customer_name
    TEXT customer_address
    TEXT products "comma-separated product IDs"
    TEXT product_names "comma-separated names"
    TEXT product_prices "comma-separated prices"
    TEXT quantities "comma-separated quantities"
  }
</pre>

| order_id | customer_name | products | product_names | quantities |
|---|---|---|---|---|
| 1 | Ana | 10, 11 | Mouse, Keyboard | 2, 1 |

One row per order, no joins. It feels great until the data grows. Then four problems show up:

- **Redundancy**: Ana's address is copied into every order she places.
- **Update anomaly**: she moves, so you fix every row. Miss one and the data now disagrees with itself.
- **Insert anomaly**: you can't record a new product until someone orders it.
- **Delete anomaly**: delete her only order and the customer and product info vanish with it.

### First normal form (1NF)

The rule: one cell, one atomic value. `10, 11` in a single cell breaks it, because you can't index it, join on it, or count it reliably. The fix is one row per product per order:

```sql
order_line(order_id, product_id, product_name, product_price, quantity,
           customer_id, customer_name, customer_address)
```

Now we need some key vocabulary. A **candidate key** is a minimal set of columns that uniquely identifies a row. The **primary key** is the candidate key you pick. A **composite key** spans several columns, like our `(order_id, product_id)`.

The catch: we have more rows, and the redundancy got worse. Ana's address now repeats for every product she buys.

![1NF](https://storage.googleapis.com/junedang_blog_images/database-normalization-and-normal-forms/1nf.webp)

## Second Normal Form (2NF): The Whole Key

A **functional dependency** (FD) means one set of columns determines another. We write `A → B`, meaning if you know A, you know B. In `order_line`:

```
order_id   → customer_id, customer_name, customer_address
product_id → product_name, product_price
(order_id, product_id) → quantity
```

A **partial dependency** is a column that depends on only part of a composite key. Customer data depends only on `order_id`, and product data only on `product_id`. 2NF forbids that, so we split the table:

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

Product names now live in one row, which fixes the product insert and update anomalies. The price: reading a full order now takes joins.

![2NF](https://storage.googleapis.com/junedang_blog_images/database-normalization-and-normal-forms/2nf.webp)

## Third Normal Form (3NF): Nothing But the Key

`orders` still repeats customer details. We have `order_id → customer_id` and `customer_id → customer_name`, so `order_id` reaches `customer_name` only through a middle column. That's a **transitive dependency**: a non-key column determined by another non-key column.

The classic example:

```
employee_id → department_id → department_name
```

`department_name` is a fact about the department, not the employee. Rename a department and you touch every employee row. 3NF says every non-key column must depend directly on the key, so we pull the middle column out into its own table:

```sql
CREATE TABLE customers (customer_id BIGINT PRIMARY KEY, name TEXT, address TEXT);
CREATE TABLE orders (order_id BIGINT PRIMARY KEY,
                     customer_id BIGINT REFERENCES customers,
                     created_at TIMESTAMPTZ);
```

There's a handy mnemonic: "the key, the whole key, and nothing but the key." That's 1NF, 2NF and 3NF in order. It's a memory aid, not the formal definition. Formally, 3NF requires that for every dependency `X → A`, either X is a superkey (any column set that uniquely identifies a row) or A is part of some candidate key.

![3NF](https://storage.googleapis.com/junedang_blog_images/database-normalization-and-normal-forms/3nf.webp)

## BCNF: When 3NF Isn't Strict Enough

Boyce-Codd normal form (BCNF) has a one-line rule: for every functional dependency `X → Y`, X must be a superkey. In other words, every determinant (the left side of an FD) has to be able to identify a whole row on its own. 3NF has the same rule with an escape hatch: it also accepts the dependency when Y is part of some candidate key. BCNF removes that hatch. Every BCNF table is in 3NF, but not the other way around.

The gap only appears in a narrow case: a table with overlapping composite candidate keys. That's why most schemas that reach 3NF are already in BCNF.

### A worked example

Students enroll in courses. Each teacher teaches exactly one course, but a course can have several teachers. A student takes a course with one teacher.

```sql
CREATE TABLE enrollment (
  student TEXT,
  course  TEXT,
  teacher TEXT,
  PRIMARY KEY (student, course)
);
```

| student | course | teacher |
|---|---|---|
| Ana | Databases | Dr. Lee |
| Bao | Databases | Dr. Lee |
| Chi | Databases | Dr. Kim |
| Ana | Networks | Dr. Roy |

The dependencies:

```
(student, course) → teacher
teacher → course
```

The candidate keys are `(student, course)` and `(student, teacher)`. The second works because a teacher determines a course, so `(student, teacher)` determines the whole row.

**Why it passes 3NF.** Take `teacher → course`. `teacher` is not a superkey, but `course` is part of the candidate key `(student, course)`. That satisfies the 3NF escape hatch. No partial dependency on a non-key column and no transitive one, so 3NF is happy.

**Why it fails BCNF.** `teacher` is a determinant but not a superkey. Alone, it can't identify a row, because Dr. Lee appears in many rows.

**What it costs you.** The fact "Dr. Lee teaches Databases" is repeated for every student in Dr. Lee's class. That brings back the same anomalies we saw earlier:

- **Update**: Dr. Lee moves to Networks. You must change every one of their rows, and missing one leaves the data contradicting itself.
- **Insert**: you can't record that Dr. Park teaches Algorithms until a student enrolls.
- **Delete**: if Chi is Dr. Kim's only student and drops the course, the fact that Dr. Kim teaches Databases disappears.

### The decomposition

Split on the offending dependency: put `teacher → course` in its own table, and keep the rest.

```sql
CREATE TABLE teacher_course (
  teacher TEXT PRIMARY KEY,
  course  TEXT NOT NULL
);

CREATE TABLE enrollment (
  student TEXT,
  teacher TEXT REFERENCES teacher_course,
  PRIMARY KEY (student, teacher)
);
```

Now `teacher → course` lives in one row per teacher, where `teacher` is the key. The student's course is found by joining through the teacher.

### The trade-off: lost dependencies

BCNF decomposition always gives you a lossless split, meaning a join rebuilds the original rows exactly. What it can't always do is preserve every dependency. Here, the rule `(student, course) → teacher` ("a student has only one teacher per course") spans both new tables. No key or foreign key can enforce it anymore. Nothing stops this:

```sql
INSERT INTO teacher_course VALUES ('Dr. Lee', 'Databases'), ('Dr. Kim', 'Databases');
INSERT INTO enrollment VALUES ('Ana', 'Dr. Lee'), ('Ana', 'Dr. Kim');
-- Ana now has two Databases teachers
```

To block that, you need a trigger, a constraint across tables, or application logic. 3NF, by contrast, can always be reached with a lossless split that preserves dependencies. That's the practical reason 3NF is the usual target, and why some designers stop there on purpose when BCNF would push a business rule out of the database. The theory goes back to Codd's original work and Boyce and Codd's refinement; see C. J. Date's *An Introduction to Database Systems* for the formal treatment.

### Quick decision guide

| Question | If yes |
|---|---|
| Is every determinant a superkey? | You're in BCNF |
| Does a violation exist, and does splitting keep all rules enforceable? | Split to BCNF |
| Does splitting push a rule out of the database? | Stay in 3NF and enforce the rule another way |

4NF and 5NF go further, covering multi-valued and join dependencies. You'll rarely meet them in practice.

## Normalization Is Not Always the Right Answer

Look at `products.price` again. It's a trap: change the price and every old order silently changes with it. So we copy it on purpose:

```sql
ALTER TABLE order_item ADD COLUMN unit_price_at_purchase NUMERIC(10,2) NOT NULL;
```

This isn't the bad kind of redundancy. It records a historical fact: what the customer actually paid. The current price and the price at purchase are two different facts that happen to look alike.

That's the line to draw. **Accidental duplication** is the same fact stored twice with no plan to keep it consistent. **Intentional denormalization** is a deliberate decision, with a known cost and a way to keep it correct. Common reasons:

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

Normalize first, then denormalize where measurements justify it. Analytics warehouses go furthest here, with wide tables built for scanning.

## Closing Thoughts

Normalization comes down to one question: where should each fact live? Ask it for every column and you'll land on 3NF most of the time without memorizing anything. When you break the rules, do it knowingly and write down why. Here's the cheat sheet:

| Term | Meaning | Main idea |
| --- | --- | --- |
| **1NF** | First Normal Form | One value per cell; no repeating groups |
| **2NF** | Second Normal Form | 1NF + no partial dependency on a composite key |
| **3NF** | Third Normal Form | 2NF + no transitive dependency |
| **BCNF** | Boyce-Codd Normal Form | every determinant is a candidate key or superkey |
