---
title: Power of Rate Limiting and Explanation
date: 2025-07-18T00:00:00+00:00
image: https://storage.googleapis.com/junedang_blog_images/how-rate-limit-works/how_rate_limit_works.svg
description: Understanding rate limiting and its importance in API management.
---

A system can only serve well when its resources are correctly consumed and allocated.

In the event that a system is flooded by unusual traffic—whether intentional or not—it could cause the entire system to collapse. A rate limit function in the API gateway can help mitigate this problem.
Rate limiting is a technique for capping how many requests, messages, or resource-consuming actions a client can make within a specific timeframe.

This technique is especially useful during sudden traffic spikes, such as limited-time offers or ticket release events. It also helps prevent malicious bot attacks and keeps your service available for legitimate users.

## How does rate limiting work?
Rate limiting is all about tracking which IP addresses are sending requests to your application, while keeping an eye on how many resource access attempts are made within a specific amount of time.
If too many requests are sent from a single IP and exceed the limit, the service will temporarily deny further requests from that IP address.

This works just like a traffic cop at a busy intersection: when one road becomes too congested, the officer halts traffic on that route so others can flow. Similarly, the system pauses or blocks excessive requests to keep overall traffic running smoothly.

Rate limiting is implemented through these steps:

![How rate limit works](https://storage.googleapis.com/junedang_blog_images/how-rate-limit-works/how_rate_limit_works.svg)

1. Identify the client
Each incoming request is tagged with an identifier (such as IP address, user ID, or API token).

2. Track request counts
The system keeps a lightweight counter for each client, usually stored in memory (e.g., Redis), and monitors how many requests are made within a rolling time window (e.g., 100 requests per minute).

3. Apply the rate limiting algorithm through common algorithms

- Token Bucket – Every request spends a token; tokens refill at a steady rate, allowing short bursts while enforcing an average rate.

- Fixed/Sliding Windows – Simple counters that reset every minute or roll smoothly across recent time intervals.

- Edge Gateways + Redis – Enforce limits at the system’s perimeter using fast in-memory stores to maintain consistency across a distributed environment.

4. Enforce the limit

If the request is within the limit ➜ it is allowed.

If the limit is exceeded ➜ the server responds with `HTTP 429` Too Many Requests, signaling the client to slow down.

## Real cases of using rate limiting

- Social media platforms apply rate limits to control how many API calls are allowed within a certain timeframe.
- Unauthenticated users or free-tier users are typically allowed fewer requests than paid users.
- Login forms block users after too many failed login attempts.
- E-commerce platforms restrict checkout actions for high-demand or limited-quantity sale items.

