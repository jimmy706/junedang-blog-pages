---
title: "Monotonic Stack: A Powerful Pattern for Sequential Problems"
description: "Learn how monotonic stacks solve complex sequential problems with elegant simplicity and O(n) efficiency."
tags: [algorithms, data-structures, competitive-programming, problem-solving]
date: 2025-11-10
---

You're browsing weather forecasts, looking at temperatures day by day. For each day, you wonder: "When will it get warmer?" You could scan forward from each day, comparing every future temperature—but that's wasteful. What if there was a way to answer all "next warmer day" questions in a single pass, never looking backward, never rechecking the same data twice?

That's the essence of the **monotonic stack**: a simple data structure that maintains order while discarding useless information. It transforms quadratic-time scanning problems into linear-time solutions, and once you see it, you'll spot its pattern everywhere—from building skylines to trapping rainwater.

## What is a Monotonic Stack?

A monotonic stack maintains its elements in either strictly increasing or strictly decreasing order. Unlike a regular stack, it enforces a rule: before adding a new element, pop any elements that violate the monotonic property.

Think of it as a filter. For an **increasing stack**, you pop everything greater than or equal to the incoming element. For a **decreasing stack**, you pop everything smaller. This selective forgetting prunes away elements that can never be useful again.

Why? Because once you've seen a "better" element (larger or smaller, depending on the problem), previous elements become irrelevant. The monotonic stack discards the obsolete and keeps only what might matter for future comparisons.

## How It Works: Step-by-Step

Let's solve the classic **"Next Greater Element"** problem: for each element in an array, find the next element to its right that is larger.

Consider the array: `[2, 1, 5, 6, 2, 3]`

We'll use a **decreasing stack** (storing indices, not values) and scan left to right:

```
Array:  [2, 1, 5, 6, 2, 3]
Index:   0  1  2  3  4  5

Step 1: i=0, val=2
  Stack empty → push index 0
  Stack: [0]

Step 2: i=1, val=1
  arr[stack.top]=2 > 1 → push index 1
  Stack: [0, 1]

Step 3: i=2, val=5
  arr[stack.top]=1 < 5 → pop 1, answer[1]=5
  arr[stack.top]=2 < 5 → pop 0, answer[0]=5
  Stack empty → push index 2
  Stack: [2]

Step 4: i=3, val=6
  arr[stack.top]=5 < 6 → pop 2, answer[2]=6
  Stack empty → push index 3
  Stack: [3]

Step 5: i=4, val=2
  arr[stack.top]=6 > 2 → push index 4
  Stack: [3, 4]

Step 6: i=5, val=3
  arr[stack.top]=2 < 3 → pop 4, answer[4]=3
  arr[stack.top]=6 > 3 → push index 5
  Stack: [3, 5]

Result: [5, 5, 6, -1, 3, -1]
```

**Pseudocode:**

```python
def nextGreaterElement(arr):
    result = [-1] * len(arr)
    stack = []
    
    for i in range(len(arr)):
        while stack and arr[stack[-1]] < arr[i]:
            index = stack.pop()
            result[index] = arr[i]
        stack.append(i)
    
    return result
```

**Time Complexity**: O(n). Each element is pushed and popped at most once.

**Space Complexity**: O(n) for the stack.

The beauty: at any moment, the stack holds indices that haven't found their "next greater" yet, stored in decreasing order. When a larger element arrives, it resolves all pending smaller elements in one sweep.

## Use Cases: Where Monotonic Stacks Shine

Monotonic stacks excel at problems involving **relative comparisons in sequences**. Here are the most common patterns:

**Next Greater/Smaller Element**: Given an array, for each element, find the next element (to the right or left) that is greater or smaller. This is the canonical use case and appears in variations across competitive programming.

**Largest Rectangle in Histogram**: Given bar heights, find the largest rectangular area. A decreasing stack tracks bars that could extend rectangles backward, popping when a shorter bar appears.

**Trapping Rainwater**: Calculate how much water can be trapped between elevation bars. Monotonic stacks help find left and right boundaries efficiently.

**Stock Span Problem**: For each day's stock price, calculate how many consecutive previous days had prices less than or equal to today. A decreasing stack naturally tracks this span.

**Building Visibility**: Determine which buildings can "see" each other across a city skyline—a problem reducible to next greater elements in both directions.

These problems share a common thread: you need to track the "next relevant" element based on some ordering constraint, and scanning backward repeatedly would be too slow. The monotonic stack compresses that backward-looking logic into a forward pass.

## Why It Matters

Monotonic stacks represent a shift in thinking: instead of asking "What do I check?" ask "What can I forget?" In interviews, this pattern transforms brute-force O(n²) solutions into elegant O(n) ones.

Beyond interviews, the pattern appears in compiler optimizations, streaming algorithms, and real-time processing where you answer "next greater/smaller" queries continuously without reprocessing history.

Mastering monotonic stacks means understanding that sometimes the best solution is throwing away most of the data. What remains is exactly what you need—nothing more, nothing less.

<!-- 
Research rationale:
Selected subtopics based on:
1. Core definition and intuition (highest priority for understanding)
2. Step-by-step mechanics with concrete example (critical for learning)
3. Common problem patterns (practical application, high relevance)
4. Efficiency analysis embedded in mechanics section
5. Interview and real-world context for motivation

Word count: ~880 words
Sources synthesized: LeetCode problem patterns, algorithm course materials, competitive programming references
-->
