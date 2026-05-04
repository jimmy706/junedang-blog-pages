---
title: "Kadane's Algorithm — Why This Simple Trick Beats Brute Force"
description: "Understanding how Kadane's Algorithm solves the maximum subarray problem in linear time with elegant simplicity"
tags: [algorithms, dynamic-programming, optimization, problem-solving]
image: https://storage.googleapis.com/junedang_blog_images/kadane-algorithm-maximum-subarray/thumbnail.webp
date: 2026-05-04
---

You're analyzing a stock's daily price changes over the last year. Some days it went up, some days it tanked. Your task: find the best consecutive period to hold the stock. Check every possible window of days and you're looking at millions of calculations. Or, you could use Kadane's Algorithm and solve it in one clean pass. This is the beauty of recognizing that sometimes, carrying forward negative momentum just isn't worth it.

## The Problem: Maximum Subarray Sum

Given an array of integers (positive, negative, or zero), find the contiguous subarray with the largest sum. For example, in `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`, the answer is `[4, -1, 2, 1]` with sum `6`. The challenge is that every element could be the start, middle, or end of the optimal window—or not included at all.

This problem appears everywhere: financial systems tracking profit windows, monitoring systems detecting peak load intervals, analytics finding best-performing time segments, and game developers calculating maximum scoring streaks. The naive approach of checking all possible subarrays hits O(n²) or O(n³), which becomes unacceptable when you're processing millions of data points in real-time systems.

## The Naive Approach and Why It Fails

The brute force method checks every possible subarray. For each starting position, calculate sums for all ending positions. With n elements, that's n × (n+1) / 2 subarrays to evaluate.

```python
def maxSubArrayBruteForce(nums):
    n = len(nums)
    max_sum = float('-inf')

    for start in range(n):
        current_sum = 0
        for end in range(start, n):
            current_sum += nums[end]
            max_sum = max(max_sum, current_sum)

    return max_sum
```

For an array with 10,000 elements, that's roughly 50 million operations. For 100,000 elements—common in real-world data streams—you're looking at 5 billion operations. When milliseconds matter and data flows continuously, this approach doesn't just slow down; it becomes architecturally unviable. Imagine a monitoring system trying to detect anomalies in real-time but spending seconds on each calculation window.

## The Core Insight: Local vs Global Decisions

Kadane's Algorithm rests on one powerful observation: **at each position, you face a binary choice—extend the current subarray or start fresh**. If carrying forward your current sum helps the next element, keep it. If it's dragging you down, abandon it and start over.

Think of it like this: you're climbing a mountain range. Each step can either build on your current altitude or reset to ground level. If your altitude has gone negative (you've descended below the starting point), there's no benefit in carrying that deficit forward. You're better off starting your ascent from the current position.

The decision rule is elegantly simple:

```python
current_sum = max(num, current_sum + num)
```

This single line captures the essence: "Is this element stronger on its own, or does the momentum I've built help it?" If `current_sum` has turned negative, `num` alone will be larger. If `current_sum` is positive, adding it to `num` creates a bigger result. No complex conditions, just pure optimization logic.

## Kadane's Algorithm: Step-by-Step Walkthrough

Let's trace through `[-2, 1, -3, 4, -1, 2, 1, -5, 4]` step by step:

| Index | Element | Current Sum (before) | Decision | Current Sum (after) | Max Sum |
|-------|---------|---------------------|----------|---------------------|---------|
| 0 | -2 | -2 (init) | Start here | -2 | -2 |
| 1 | 1 | -2 | Reset (1 > -2+1) | 1 | 1 |
| 2 | -3 | 1 | Extend (1-3 > -3) | -2 | 1 |
| 3 | 4 | -2 | Reset (4 > -2+4) | 4 | 4 |
| 4 | -1 | 4 | Extend (4-1 > -1) | 3 | 4 |
| 5 | 2 | 3 | Extend (3+2 > 2) | 5 | 5 |
| 6 | 1 | 5 | Extend (5+1 > 1) | 6 | 6 |
| 7 | -5 | 6 | Extend (6-5 > -5) | 1 | 6 |
| 8 | 4 | 1 | Extend (1+4 > 4) | 5 | 6 |

The algorithm resets at indices 1 and 3, when carrying forward the accumulated sum would be worse than starting fresh. The maximum sum `6` was locked in at index 6, representing the subarray `[4, -1, 2, 1]`.

<pre class="mermaid">
---
config:
  layout: elk
  look: handDrawn
---
flowchart TD
    Start["Array: [-2,1,-3,4,-1,2,1,-5,4]"]

    A1["Index 0: -2<br>curr_sum = -2<br>max_sum = -2"]
    A2["Index 1: 1<br>Reset: 1 > -2+1<br>curr_sum = 1<br>max_sum = 1"]
    A3["Index 2: -3<br>Extend: -2 > -3<br>curr_sum = -2<br>max_sum = 1"]
    A4["Index 3: 4<br>Reset: 4 > 2<br>curr_sum = 4<br>max_sum = 4"]
    A5["Index 4: -1<br>Extend: 3 > -1<br>curr_sum = 3<br>max_sum = 4"]
    A6["Index 5: 2<br>Extend: 5 > 2<br>curr_sum = 5<br>max_sum = 5"]
    A7["Index 6: 1<br>Extend: 6 > 1<br>curr_sum = 6<br>max_sum = 6"]
    A8["Index 7: -5<br>Extend: 1 > -5<br>curr_sum = 1<br>max_sum = 6"]
    A9["Index 8: 4<br>Extend: 5 > 4<br>curr_sum = 5<br>max_sum = 6"]
    Result["Final: max_sum = 6<br>Subarray: [4,-1,2,1]"]

    Start --> A1
    A1 --> A2
    A2 --> A3
    A3 --> A4
    A4 --> A5
    A5 --> A6
    A6 --> A7
    A7 --> A8
    A8 --> A9
    A9 --> Result
</pre>

## Implementation

Here's the clean Python implementation:

```python
def maxSubArray(nums):
    """
    Find maximum sum of contiguous subarray using Kadane's Algorithm.

    Args:
        nums: List of integers (can be negative, positive, or zero)

    Returns:
        Integer representing the maximum subarray sum
    """
    if not nums:
        return 0

    curr_sum = nums[0]
    max_sum = nums[0]

    for num in nums[1:]:
        # Decide: extend current subarray or start fresh
        curr_sum = max(num, curr_sum + num)
        # Update global maximum
        max_sum = max(max_sum, curr_sum)

    return max_sum
```

**Why initialization matters**: Starting with `nums[0]` handles the all-negative case correctly. If you initialized to zero, an array like `[-3, -2, -5]` would incorrectly return `0` instead of `-2`.

**Edge case handling**: When all numbers are negative, the algorithm correctly returns the least negative number (the maximum single element), not zero or an invalid result.

If you need the actual subarray indices:

```python
def maxSubArrayWithIndices(nums):
    """
    Returns the maximum sum AND the subarray indices.
    """
    if not nums:
        return 0, 0, 0

    curr_sum = nums[0]
    max_sum = nums[0]
    start = 0
    end = 0
    temp_start = 0

    for i in range(1, len(nums)):
        # If starting fresh, update temp_start
        if nums[i] > curr_sum + nums[i]:
            curr_sum = nums[i]
            temp_start = i
        else:
            curr_sum = curr_sum + nums[i]

        # Update max and lock in indices
        if curr_sum > max_sum:
            max_sum = curr_sum
            start = temp_start
            end = i

    return max_sum, start, end

# Example usage
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
max_sum, start, end = maxSubArrayWithIndices(nums)
print(f"Max sum: {max_sum}")  # 6
print(f"Subarray: {nums[start:end+1]}")  # [4, -1, 2, 1]
```

For Java developers:

```java
public class KadaneAlgorithm {
    public static int maxSubArray(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }

        int currSum = nums[0];
        int maxSum = nums[0];

        for (int i = 1; i < nums.length; i++) {
            currSum = Math.max(nums[i], currSum + nums[i]);
            maxSum = Math.max(maxSum, currSum);
        }

        return maxSum;
    }
}
```

## Complexity Analysis

**Time Complexity: O(n)**
Single pass through the array. Each element is visited exactly once. No nested loops, no backtracking.

**Space Complexity: O(1)**
Only two variables maintained (`curr_sum` and `max_sum`). No auxiliary data structures.

**Comparison with alternatives:**

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute force (two loops) | O(n²) | O(1) | Checks all subarrays |
| Brute force (three loops) | O(n³) | O(1) | Recalculates sums from scratch |
| Divide and conquer | O(n log n) | O(log n) | Recursive, more complex |
| **Kadane's Algorithm** | **O(n)** | **O(1)** | **Optimal solution** |

For a system processing 1 million elements:
- Brute force: ~1 trillion operations
- Kadane's: ~1 million operations

That's a **million-fold improvement**.

## Real-World Applications

**Financial Systems**
Finding the best time window to hold a stock. Daily price changes become the array; the maximum subarray is your optimal holding period. Trading algorithms use this to identify profitable patterns in historical data.

**Monitoring and Observability**
Detecting peak load intervals in server metrics. When CPU usage fluctuates, finding the worst consecutive period helps capacity planning. Network traffic analysis uses similar patterns to identify congestion windows.

**Analytics and Time-Series**
Identifying the highest-performing segment in sales data, user engagement metrics, or conversion funnels. E-commerce platforms analyze checkout success rates across time to find optimal periods for marketing pushes.

**Game Development**
Calculating maximum scoring streaks or combo multipliers. Games with momentum-based scoring (like rhythm games) need fast subarray calculations to compute bonuses in real-time.

**Resource Allocation**
Scheduling systems use variations to allocate CPU time, memory, or bandwidth to processes based on historical demand patterns.

## Variations and Extensions

**Maximum Product Subarray**
Instead of sum, find the maximum product. This requires tracking both maximum and minimum (since negative × negative = positive).

```python
def maxProduct(nums):
    max_prod = min_prod = result = nums[0]

    for num in nums[1:]:
        if num < 0:
            max_prod, min_prod = min_prod, max_prod

        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        result = max(result, max_prod)

    return result
```

**Circular Array**
When the array wraps around (last element connects to first), you need to consider both the standard Kadane's result and the "inverted" case (total sum - minimum subarray).

**2D Kadane (Maximum Sum Rectangle)**
Extend to matrices by fixing top and bottom rows, then applying 1D Kadane on column sums. Used in image processing and computational geometry.

**Constrained Subarray**
Find maximum sum with subarrays of length at most k. Requires sliding window with deque for O(n) solution.

## Common Mistakes to Avoid

**Resetting sum incorrectly**
Don't set `curr_sum = 0` when starting fresh. Use `curr_sum = num` instead. Zero initialization fails on all-negative arrays.

**Misunderstanding the decision point**
The choice isn't "include or exclude the current element." It's "start fresh here or extend the existing run." Subtle but critical difference.

**Ignoring all-negative arrays**
Arrays like `[-5, -2, -8, -1]` should return `-1`, not `0`. Proper initialization with `nums[0]` handles this naturally.

**Forgetting the contiguous requirement**
You can't skip elements. `[1, -10, 5]` has maximum sum `5`, not `6` (you can't cherry-pick `1` and `5`).

**Off-by-one errors in index tracking**
When returning indices, ensure your `start` updates match your reset logic. Test with single-element arrays.

## Practice Problems

Sharpen your understanding with these LeetCode problems:

1. **Maximum Subarray** (LeetCode 53) — The canonical Kadane's problem
2. **Maximum Product Subarray** (LeetCode 152) — Track both max and min due to sign flips
3. **Best Time to Buy and Sell Stock** (LeetCode 121) — Kadane's in disguise (maximize price[j] - price[i])
4. **Maximum Sum Circular Subarray** (LeetCode 918) — Handle wrap-around case
5. **Longest Turbulent Subarray** (LeetCode 978) — Kadane's pattern with alternating comparisons

## Closing Thoughts

Kadane's Algorithm is a masterclass in recognizing that local decisions, made greedily at each step, can lead to globally optimal solutions. The brilliance isn't in the code—it's five lines—but in the insight: **negative momentum is dead weight**. By ruthlessly cutting losses and building on positive runs, you transform an O(n²) brute-force slog into an elegant O(n) pass. Whether you're analyzing stock prices, optimizing server loads, or just acing an interview, this algorithm shows that sometimes the best strategy is knowing when to let go and start fresh.

## Questions

<details>
<summary>1. Why does Kadane's Algorithm work correctly for arrays with all negative numbers?</summary>
By initializing both curr_sum and max_sum with nums[0], the algorithm correctly handles all-negative arrays. The max comparison ensures we return the least negative number (the maximum single element), not zero.
</details>

<details>
<summary>2. What's the key decision Kadane's Algorithm makes at each element, and how does it achieve O(n) time?</summary>
At each position, it decides whether to extend the current subarray (curr_sum + num) or start fresh (num). This greedy local choice requires only one pass through the array with constant-time operations at each step, achieving O(n) overall.
</details>

<!-- Subtopic selection rationale:
1. The Problem — establishes context and real-world relevance
2. Naive Approach — shows why optimization matters through concrete complexity analysis
3. Core Insight — builds intuition around the local vs global decision pattern
4. Step-by-Step Walkthrough — visual and tabular breakdown of algorithm execution
5. Implementation — clean code with edge cases and multiple languages
6. Complexity Analysis — rigorous comparison with alternatives
7. Real-World Applications — connects theory to practical systems
8. Variations and Extensions — shows adaptability and related problems
9. Common Mistakes — addresses pitfalls learners face
10. Practice Problems — actionable next steps for mastery

These subtopics cover the full spectrum: problem definition, naive baseline, core algorithm, implementation details, performance analysis, practical usage, extensions, and learning resources. Each section builds on the previous, creating a complete learning path from first principles to mastery.
-->
