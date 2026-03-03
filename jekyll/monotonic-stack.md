---
title: "Monotonic Stack Pattern"
description: "Plain-language guide to using monotonic stacks for one-pass comparisons."
tags: [research, algorithms, data-structures, competitive-programming]
date: 2026-03-03
permalink: /monotonic-stack/
---

Monotonic stacks feel like carrying a neat pile of plates: every new plate must fit the order, and anything that no longer fits gets popped off. By enforcing that rule, you can answer “what’s the next higher (or lower) item?” in one left-to-right sweep instead of scanning repeatedly. This guide keeps the tone conversational while showing you how to apply the pattern when you have to compare neighbors in a stream of values. Use it as a reference: skim the subtopics, grab the code snippets, and check the trade-offs table when deciding if the approach fits your problem.

## Intuition and When to Reach for It

A monotonic stack is just a stack with an extra promise: its contents stay sorted (increasing or decreasing) from bottom to top. Before pushing a new element, you pop anything that breaks the order. The result is a tiny “frontier” of candidates that might matter for future comparisons. Because each element is pushed and popped at most once, the whole pass runs in O(n) time [1].

Reach for it when you need relative comparisons across neighbors—“next warmer day,” “first taller bar,” “previous smaller price”—and you cannot afford to scan backward repeatedly. Skip it if your queries are random access; segment trees or binary indexed trees may serve better.

## Increasing vs Decreasing Stacks

Choosing the direction flips the comparison:

* **Increasing stack** (top is smallest): pop while top ≥ incoming. This reveals the previous smaller element.
* **Decreasing stack** (top is largest): pop while top ≤ incoming. This reveals the next greater element.

Store indices, not raw values, so you can compute distances or look up original data. Here is a friendly Python example for “next greater element” that resolves each index exactly once:

```python
def next_greater(nums):
    res = [-1] * len(nums)
    stack = []  # holds indices of unresolved items, values decreasing top-down

    for i, val in enumerate(nums):
        while stack and nums[stack[-1]] < val:
            res[stack.pop()] = val
        stack.append(i)
    return res

print(next_greater([2, 1, 5, 6, 2, 3]))
# -> [5, 5, 6, -1, 3, -1]
```

The moment a bigger value arrives, the stack lets you “pay off” every smaller value waiting for a match—no rework, no nested loops.

## Canonical Problems to Practice

* **Daily Temperatures / Next Greater Element**: Find the next warmer day or larger number by sweeping once with a decreasing stack [2].
* **Largest Rectangle in Histogram**: Use a decreasing stack of bar indices; when a shorter bar appears, you pop to compute maximal widths [3].
* **Trapping Rainwater (two-pass variant)**: A monotonic stack can capture left/right boundaries for each bar without multiple scans [4].
* **Stock Span**: With a decreasing stack, count how many prior days were cheaper or equal, then push today’s index for future spans.

These exercises cover right-to-left, left-to-right, and bi-directional scans, which is all you need to adapt the pattern to most interview and production tasks.

## Implementation Tips and Edge Cases

* **Duplicates**: Decide whether “greater” means strictly greater or greater-or-equal, and adjust the pop condition accordingly.
* **Bounds**: Add a sentinel (e.g., push `0` height at the end for histogram) to flush the stack without extra loops.
* **Circular arrays**: Iterate twice with modulo indexing to find “next” values in a wraparound list.
* **Memory**: The stack size never exceeds `n`, but for streaming systems consider discarding fully resolved prefixes to keep memory flat.

## Design and Trade-offs

| Approach | Strengths | Weaknesses | Use when |
| --- | --- | --- | --- |
| Brute-force scan | Simple, no extra memory | O(n²) time [1] | Tiny inputs or quick prototypes |
| Balanced tree / heap window | Handles arbitrary order stats | O(n log n) time, more code | Sliding-window percentiles, not just next greater |
| Monotonic stack | O(n) time, small and cache-friendly [1] | Only answers monotone neighbor queries; order matters | One-pass “next greater/smaller,” histogram, span problems |

## Questions

1. Which pop condition (strict vs non-strict) matches your definition of “next greater” in this problem?
2. Can you process the data in the opposite direction to simplify how you compute distances or spans?

References: [1] MIT 6.006 lecture notes on amortized analysis and stacks (O(n) pushes/pops) — https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/resources/lecture-3-amortization/; [2] LeetCode 739 “Daily Temperatures” official solution (monotonic stack) — https://leetcode.com/problems/daily-temperatures/solutions/157480/daily-temperatures/; [3] LeetCode 84 “Largest Rectangle in Histogram” official solution — https://leetcode.com/problems/largest-rectangle-in-histogram/solutions/289680/approach-3-using-stack-accepted/; [4] LeetCode 42 “Trapping Rain Water” official solution (stack variant) — https://leetcode.com/problems/trapping-rain-water/solutions/173113/trapping-rain-water/

<!-- Rationale: picked intuition, stack direction, canonical problems, and implementation tips as the 4 subtopics because they partition what readers need to understand (concept, configuration, practice set, operational details) without overlap. -->
