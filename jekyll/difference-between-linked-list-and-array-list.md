---
title: "Difference Between Linked List and Array List"
description: "How dynamic arrays and linked lists store elements, what that means for performance, and how to choose between them."
tags: [research, data-structures, algorithms]
date: 2025-10-04
image: https://storage.googleapis.com/junedang_blog_images/difference-between-linked-list-and-array-list/array_list_vs_linked_list.webp
---

Picking a list implementation seems trivial until your workload grows. Dynamic array lists (such as Java's `ArrayList` or C++'s `std::vector`) keep items in contiguous memory and deliver blistering random access. Linked lists, in contrast, stitch nodes together with pointers so inserts and deletes stay cheap even in the middle of the sequence. Understanding the memory layout, cache behavior, and algorithmic trade-offs of each structure helps you keep latency predictable and resource usage low.

> **At a glance**
> - Array lists keep elements in contiguous memory, making index-based access O(1) with excellent cache locality.
> - Linked lists break elements into nodes connected by pointers, so inserts and deletes near known positions stay O(1).
> - Resizing an array list requires copying elements into a larger buffer; linked lists avoid resizing but pay higher pointer overhead.
> - Cache misses dominate linked list traversals because nodes can live anywhere in memory.
> - Choose array lists for read-heavy workloads and linked lists for mutation-heavy workloads where positions are already known.

## Array lists in practice

Array lists manage two numbers internally: the logical size and the allocated capacity. When appends exceed capacity, the structure allocates a larger contiguous block (usually doubling the size) and copies existing elements. The payoff is direct indexing and cache-friendly sequential reads.

```java
import java.util.ArrayList;

public class ArrayListDemo {
    public static void main(String[] args) {
        ArrayList<Integer> numbers = new ArrayList<>();
        numbers.add(10);  // amortized O(1)
        numbers.add(20);
        numbers.add(30);

        int value = numbers.get(1); // O(1) access, returns 20

        numbers.add(1, 15); // O(n) insertion, shifts 20 and 30 right
        numbers.remove(2);  // O(n) removal, shifts trailing items left
    }
}
```

Because all elements sit side by side, the CPU prefetcher can stream through memory. That makes operations like sorting or iterating millions of records far faster than equivalent pointer-chasing structures.

## Linked lists in practice

Linked lists represent each element as a node containing the payload and references to neighboring nodes. Singly linked lists store one `next` pointer, while doubly linked lists track both `prev` and `next` pointers to support bidirectional traversal. Nodes can live anywhere in memory, so growing the list never requires copying existing elements.

```python
class Node:
    def __init__(self, value, next_node=None):
        self.value = value
        self.next = next_node

class SinglyLinkedList:
    def __init__(self):
        self.head = None

    def prepend(self, value):
        self.head = Node(value, self.head)

    def insert_after(self, node, value):
        node.next = Node(value, node.next)

numbers = SinglyLinkedList()
numbers.prepend(30)
numbers.prepend(20)
numbers.prepend(10)
```

Linked lists shine when you already hold a reference to the insertion point. Updating a node's pointers keeps the operation O(1) regardless of list length. However, traversing to that position still requires O(n) pointer hops.

## Performance characteristics

| Operation                | Array list                     | Linked list (singly)                | Linked list (doubly)           |
| ------------------------ | ------------------------------ | ----------------------------------- | ------------------------------ |
| Access by index          | O(1)                           | O(n)                                | O(n)                           |
| Append at end            | Amortized O(1)                 | O(1) with tail pointer              | O(1) with tail pointer         |
| Insert/delete in middle  | O(n) shift cost                | O(1) after locating the node        | O(1) after locating the node   |
| Memory overhead          | Minimal metadata               | +1 pointer per node                 | +2 pointers per node           |
| Cache behavior           | Excellent locality             | Poor (pointer chasing)              | Poor (pointer chasing)         |
| Random removal by value  | O(n) search + O(n) shift       | O(n) traversal + O(1) pointer fix   | O(n) traversal + O(1) pointer fix |

Array lists prefer workloads where reads dominate writes and where you can estimate capacity to avoid frequent resizes. Linked lists thrive in constantly mutating workloads that manipulate nodes via existing references, such as implementing an LRU cache or maintaining editor undo stacks.

## Choosing a list structure

Consider three questions before picking a structure:

1. **Do you index directly by position?** If yes, the O(1) access and cache locality of array lists are decisive.
2. **Do you frequently insert or delete in the middle with a known node reference?** Linked lists avoid global shifts and keep latency stable.
3. **Is memory density important?** Array lists pack elements tightly. Linked lists add pointer overhead that can double memory usage for small payloads.

Mixed workloads often pair structures. For example, a service might maintain an array list of hot items for fast iteration while linking those items into a doubly linked list to support recency-based eviction.

## Implementation tips

- **Hide resize pauses.** Reserve capacity in array lists (`ensureCapacity` in Java or `reserve` in C++) when you know the target size so the expensive copy happens off the critical path.
- **Track tails in linked lists.** Maintaining a tail pointer or sentinel nodes keeps appends O(1) without scanning from the head.
- **Mind allocator behavior.** Custom allocators or object pools mitigate heap fragmentation for linked list nodes.
- **Use hybrid structures.** Skip lists, unrolled linked lists, or array-of-structures layouts blend contiguous storage with flexible updates when neither pure structure fits.
- **Profile cache behavior.** Pointer-heavy traversals can stall CPUs; consider alternatives like `std::deque` or gap buffers when cache misses dominate.

## Design and trade-offs

| Option                | Pros                                              | Cons                                                 | Use when |
| --------------------- | ------------------------------------------------- | ---------------------------------------------------- | -------- |
| Array list            | O(1) indexing, tight memory footprint, cache hot  | Inserts/deletes in middle shift elements, resize cost | Reads dominate and order by index matters |
| Singly linked list    | O(1) insert/delete with node reference, simple    | O(n) traversal, poor cache locality, extra pointer    | You mutate frequently and hold node references |
| Doubly linked list    | Bidirectional traversal, easy removal from middle | Higher memory overhead, more pointer updates          | You need backward traversal or LRU-style eviction |

## Questions

1. How would you redesign a linked list to improve cache locality without sacrificing O(1) insertions?
2. When would a deque or gap buffer outperform both linked lists and array lists for text editing workloads?

<!-- Subtopic rationale: Covered contiguous arrays, pointer-based lists, performance trade-offs, decision criteria, and implementation patterns to map the full decision space. -->
