---
title: "Java HashMap: Understanding equals() and hashCode()"
description: "A complete guide to equals() and hashCode() in Java, explaining the contract, how HashMap works internally, common mistakes, and best practices."
tags: [java, hashmap, data-structures, best-practices]
image: https://storage.googleapis.com/junedang_blog_images/java-hashmap-equals-and-hashcode/java_hashcode_and_equal.webp
date: 2025-12-17
---

If you've ever used a `HashMap` in Java, you've relied on two methods you might not fully understand: `equals()` and `hashCode()`. These methods form a contract that's easy to break and painful to debug. Override `equals()` without `hashCode()`? Your objects mysteriously disappear from the map. Use mutable fields in your hash function? Your HashMap becomes a black hole where data goes in but never comes out.

This isn't just academic minutiae. It's the difference between code that works and code that silently corrupts data. This guide builds understanding from first principles—what logical equality means, how hashing works, why the contract exists, and how to implement it correctly in modern Java.

## Logical Equality vs Reference Equality

Java distinguishes between two forms of equality. **Reference equality** (`==`) asks: "Are these the same object in memory?" **Logical equality** (`equals()`) asks: "Do these objects represent the same value?"

```java
String a = new String("hello");
String b = new String("hello");

System.out.println(a == b);        // false - different objects
System.out.println(a.equals(b));   // true - same value
```

For primitive types like `int` or `boolean`, `==` compares values directly because primitives aren't objects. But for reference types, `==` compares memory addresses. Two distinct `String` objects containing "hello" are different objects (`==` returns false) but represent the same value (`equals()` returns true).

By default, `Object.equals()` uses reference equality—it's just `this == obj`. This works for objects with identity semantics (database entities, UI components, threads). But for value objects like `Point`, `Money`, or `Email`, you want logical equality. Two `Point` instances with coordinates (10, 20) should be equal even if they're separate objects.

**When to override equals():**
* Value objects where identity doesn't matter (coordinates, email addresses, phone numbers)
* Domain objects compared by business key (User by email, Product by SKU)
* Data transfer objects (DTOs) compared by content

**When NOT to override:**
* Objects with strong identity (Thread, Connection, FileInputStream)
* Singletons or stateless services
* Objects compared by reference for performance or correctness reasons

## The Java Contract: equals() and hashCode()

The contract between `equals()` and `hashCode()` is non-negotiable. From the Java specification:

> If two objects are equal according to `equals()`, they **must** have the same hash code.

Written formally: if `a.equals(b)` returns `true`, then `a.hashCode() == b.hashCode()` **must** return `true`.

The reverse is not required. Different objects can have the same hash code (called a **collision**), but equal objects cannot have different hash codes.

**Why does this rule exist?** Because hash-based collections like `HashMap`, `HashSet`, and `Hashtable` use `hashCode()` first to locate a bucket, then use `equals()` to find the exact object within that bucket. If equal objects have different hash codes, they land in different buckets and will never find each other.

**The equals() contract requires:**

1. **Reflexive**: `x.equals(x)` must be true
2. **Symmetric**: if `x.equals(y)`, then `y.equals(x)`
3. **Transitive**: if `x.equals(y)` and `y.equals(z)`, then `x.equals(z)`
4. **Consistent**: multiple calls return the same value (unless object modified)
5. **Null safety**: `x.equals(null)` must be false

**The hashCode() contract requires:**

1. **Consistent**: same object returns same hash code during execution (unless modified)
2. **Equal objects have equal hash codes**: if `x.equals(y)`, then `x.hashCode() == y.hashCode()`
3. **Unequal objects should have different hash codes** (not required, but improves performance)

Breaking these contracts leads to broken collections, lost data, and subtle bugs that surface only in production.

## How HashMap Works Internally

Understanding HashMap's internals clarifies why the contract matters. At its core, HashMap is an array of "buckets," each holding a linked list (or tree) of entries.

**Step-by-step lookup process:**

```
1. Compute hash code:        hashCode() → 42891
2. Map to bucket index:      42891 % 16 = 11
3. Find bucket 11
4. Iterate entries in bucket 11
5. Use equals() to find exact match
```

**ASCII diagram:**

```
HashMap (capacity: 16)
┌────┬────────────────────────┐
│  0 │ null                   │
├────┼────────────────────────┤
│  1 │ null                   │
├────┼────────────────────────┤
│  2 │ Entry → Entry → null   │  (collision: multiple entries)
├────┼────────────────────────┤
│  3 │ null                   │
├────┼────────────────────────┤
│ .. │ ...                    │
├────┼────────────────────────┤
│ 11 │ Entry → null           │  ← hashCode() % 16 = 11
├────┼────────────────────────┤
│ .. │ ...                    │
└────┴────────────────────────┘

Each Entry contains:
{ key, value, next, hash }
```

**Insertion (`put`):**

```java
public V put(K key, V value) {
    int hash = hash(key.hashCode());        // Step 1: compute hash
    int index = indexFor(hash, capacity);   // Step 2: bucket selection
    
    // Step 3: check if key exists
    for (Entry<K,V> e = table[index]; e != null; e = e.next) {
        if (e.hash == hash && (e.key == key || key.equals(e.key))) {
            V oldValue = e.value;
            e.value = value;                // update existing
            return oldValue;
        }
    }
    
    addEntry(hash, key, value, index);      // add new entry
    return null;
}
```

**Lookup (`get`):**

```java
public V get(Object key) {
    int hash = hash(key.hashCode());        // Step 1
    int index = indexFor(hash, capacity);   // Step 2
    
    // Step 3: linear search in bucket
    for (Entry<K,V> e = table[index]; e != null; e = e.next) {
        if (e.hash == hash && (e.key == key || key.equals(e.key))) {
            return e.value;                 // found
        }
    }
    
    return null;                            // not found
}
```

Notice that `hashCode()` determines the bucket, while `equals()` confirms the exact match. If you override `equals()` but not `hashCode()`, equal objects land in different buckets and never find each other.

**Collision handling:**

When multiple keys hash to the same bucket, HashMap uses:
* **Linked list** (Java 7 and before, or small buckets in Java 8+)
* **Balanced tree** (Java 8+, when bucket has 8+ entries)

This keeps worst-case lookup at O(log n) instead of O(n) during heavy collisions.

## Default Behavior: Object Class

If you don't override `equals()` and `hashCode()`, you get the defaults from `Object`:

```java
// From java.lang.Object
public boolean equals(Object obj) {
    return (this == obj);  // reference equality
}

public native int hashCode();  // identity-based, typically memory address
```

**Default equals()** uses `==`, meaning two objects are equal only if they're the exact same instance. Two `Person` objects with name "Alice" are not equal.

**Default hashCode()** typically derives from the object's memory address (implementation-defined). Each distinct object gets a unique hash code.

**When the default is correct:**

```java
class DatabaseConnection {
    private Socket socket;
    private String connectionId;
    
    // Don't override equals/hashCode
    // Each connection is unique by identity
}

// Usage
Map<DatabaseConnection, Long> connectionTimes = new HashMap<>();
DatabaseConnection conn1 = new DatabaseConnection();
DatabaseConnection conn2 = new DatabaseConnection();

connectionTimes.put(conn1, System.currentTimeMillis());
System.out.println(connectionTimes.get(conn1));  // Works: same object
System.out.println(connectionTimes.get(conn2));  // null: different object
```

**When the default is wrong:**

```java
class Point {
    private int x, y;
    
    Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    // No equals/hashCode override - BUG
}

// Bug demonstration
Set<Point> points = new HashSet<>();
points.add(new Point(10, 20));
System.out.println(points.contains(new Point(10, 20)));  // false - BUG!

// Two Point(10,20) objects are different instances,
// so contains() fails even though they represent the same coordinate
```

The rule: override `equals()` when logical equality differs from reference equality. And when you override `equals()`, you **must** override `hashCode()`.

## Common Mistakes That Break HashMap

### Mistake 1: Override equals() but not hashCode()

This is the most common error. It violates the contract and breaks all hash-based collections.

```java
class User {
    private String email;
    
    User(String email) { this.email = email; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof User)) return false;
        User other = (User) obj;
        return email.equals(other.email);
    }
    
    // BUG: No hashCode() override
}

// Broken behavior
Map<User, String> users = new HashMap<>();
User alice1 = new User("alice@example.com");
User alice2 = new User("alice@example.com");

users.put(alice1, "Alice");

// This should return "Alice" but returns null!
System.out.println(users.get(alice2));  // null - BUG!

// Why: alice1 and alice2 are equal but have different hash codes,
// so they land in different buckets. HashMap never finds alice1 when
// looking up alice2.
```

**Fix:** Always override both methods together.

### Mistake 2: Using Mutable Fields in hashCode()

Hash codes must remain constant while an object is stored in a hash collection. If the hash code changes, the object becomes unreachable.

```java
class MutablePoint {
    private int x, y;
    
    MutablePoint(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    public void setX(int x) { this.x = x; }
    public void setY(int y) { this.y = y; }
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof MutablePoint)) return false;
        MutablePoint p = (MutablePoint) obj;
        return x == p.x && y == p.y;
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(x, y);  // BUG: uses mutable fields
    }
}

// Black hole bug
Set<MutablePoint> points = new HashSet<>();
MutablePoint p = new MutablePoint(10, 20);
points.add(p);

System.out.println(points.contains(p));  // true

p.setX(15);  // Modifies fields used in hash code

// Now the point is lost! It's still in the set, but in the wrong bucket
System.out.println(points.contains(p));  // false - BLACK HOLE BUG!

// The set thinks it has 1 element, but contains() returns false
// You can't remove it, you can't find it, but iteration shows it
System.out.println(points.size());       // 1
points.forEach(System.out::println);     // Prints the point
```

**Fix:** Only use immutable fields in `hashCode()`, or make your entire class immutable.

### Mistake 3: Inconsistent equals() and hashCode() Logic

Both methods must use the exact same fields.

```java
class Product {
    private String sku;
    private String name;
    
    @Override
    public boolean equals(Object obj) {
        if (!(obj instanceof Product)) return false;
        Product p = (Product) obj;
        return sku.equals(p.sku);  // Only uses sku
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(sku, name);  // BUG: uses sku AND name
    }
}

// Broken behavior
Product p1 = new Product("SKU-123", "Widget");
Product p2 = new Product("SKU-123", "Gadget");

System.out.println(p1.equals(p2));       // true (same sku)
System.out.println(p1.hashCode() == p2.hashCode());  // false - VIOLATION!
```

**Fix:** Use the exact same fields in both methods.

## Best Practices for Correct Implementation

**1. Choose the right fields:**

Include only fields that define logical equality. Typically:
* **Value objects**: all fields
* **Entities**: business key fields (ID, SKU, email)
* **Exclude**: derived fields, transient state, timestamps (unless they define equality)

**2. Make classes immutable when possible:**

```java
public final class Email {
    private final String address;
    
    public Email(String address) {
        this.address = address.toLowerCase();
    }
    
    public String getAddress() { return address; }
    
    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Email)) return false;
        Email other = (Email) obj;
        return address.equals(other.address);
    }
    
    @Override
    public int hashCode() {
        return address.hashCode();
    }
}
```

**3. Use Objects.hash() for convenience:**

```java
@Override
public int hashCode() {
    return Objects.hash(field1, field2, field3);
}
```

This is simple and correct. It generates hash codes using a formula similar to `Arrays.hashCode()`.

**Alternative: Prime multiplication (manual, optimized):**

```java
@Override
public int hashCode() {
    int result = 17;
    result = 31 * result + field1.hashCode();
    result = 31 * result + field2.hashCode();
    result = 31 * result + field3;
    return result;
}
```

Prime multiplication (31 is traditional) reduces collisions. Use this when profiling shows `Objects.hash()` is a bottleneck (rare).

**4. Standard equals() pattern:**

```java
@Override
public boolean equals(Object obj) {
    if (this == obj) return true;                    // Optimization
    if (obj == null || getClass() != obj.getClass()) return false;
    
    MyClass other = (MyClass) obj;
    return Objects.equals(field1, other.field1)
        && Objects.equals(field2, other.field2)
        && field3 == other.field3;
}
```

**5. Use `instanceof` carefully:**

```java
// Strict: class must match exactly
if (obj == null || getClass() != obj.getClass()) return false;

// Lenient: allows subclasses (breaks symmetry if subclass adds fields)
if (!(obj instanceof MyClass)) return false;
```

Prefer exact class match (`getClass()`) unless you have a specific reason to allow subclasses.

**6. Handle nulls safely:**

Use `Objects.equals(a, b)` which handles null values:

```java
Objects.equals(null, null)     // true
Objects.equals("a", null)      // false
Objects.equals(null, "a")      // false
Objects.equals("a", "a")       // true
```

## Modern Java Solutions

Modern Java provides tools to generate correct implementations automatically.

### Java Records (Java 14+)

Records are immutable data carriers with automatic `equals()`, `hashCode()`, and `toString()`:

```java
public record Point(int x, int y) {}

// Equivalent to:
public final class Point {
    private final int x;
    private final int y;
    
    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }
    
    // Auto-generated equals(), hashCode(), toString()
    // Auto-generated getters: x(), y()
}

// Usage
Point p1 = new Point(10, 20);
Point p2 = new Point(10, 20);

System.out.println(p1.equals(p2));  // true
System.out.println(p1.hashCode() == p2.hashCode());  // true

Map<Point, String> map = new HashMap<>();
map.put(p1, "Origin");
System.out.println(map.get(p2));  // "Origin" - works correctly!
```

Records are perfect for DTOs, value objects, and any immutable data structure.

### Lombok @EqualsAndHashCode

For pre-Java 14 projects or complex classes:

```java
import lombok.EqualsAndHashCode;

@EqualsAndHashCode
public class User {
    private String email;
    private String name;
    
    @EqualsAndHashCode.Exclude
    private LocalDateTime lastLogin;  // Exclude from equality
}
```

Lombok generates methods at compile time. Use `@EqualsAndHashCode.Exclude` for fields that shouldn't affect equality.

### IDE Generation

IntelliJ IDEA and Eclipse can generate correct implementations:
* IntelliJ: Code → Generate → `equals()` and `hashCode()`
* Eclipse: Source → Generate `hashCode()` and `equals()`

Choose fields, pick a generation strategy, and review the output.

### When NOT to Use Automation

Don't auto-generate for:
* **Entities with database IDs**: Use only the ID, not all fields
* **Classes with complex equality logic**: Custom business rules require manual implementation
* **Performance-critical code**: Hand-tuned hash functions may be necessary

## Questions

**1. What happens if you put an object in a HashMap, then modify a field used in hashCode()?**

The object becomes unreachable. It's stored in a bucket determined by the old hash code, but lookups use the new hash code and search the wrong bucket. The object is "lost" in the map—it's still there (size includes it), but `get()` and `contains()` return null/false. This is why hash code fields must be immutable.

**2. Why does the contract allow unequal objects to have the same hash code?**

Perfect hashing (unique hash codes for all objects) is mathematically impossible for unbounded domains. Hash codes are `int` (32 bits, ~4 billion values), but there are infinitely many possible Strings. Collisions are inevitable. HashMap handles them with buckets containing multiple entries. Good hash functions minimize collisions, but they can't eliminate them.
