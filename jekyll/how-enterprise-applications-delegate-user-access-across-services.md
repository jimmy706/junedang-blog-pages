---
title: "How Enterprise Applications Delegate User Access Across Services"
description: "Understanding identity propagation and authorization in distributed systems"
tags: [oauth, microservices, authorization, system-design, security]
image: https://storage.googleapis.com/junedang_blog_images/how-enterprise-applications-delegate-user-access-across-services/thumbnail.webp
date: 2026-04-23
---

When a user makes a request to your system, that request might traverse through an [API gateway](/posts/api-gateway-design-and-key-components), hit Service A, which calls Service B, which finally calls Service C—where the actual authorization rules live. This isn't a theoretical problem. It's the daily reality of microservices architectures, and most teams solve it incorrectly.

The core issue: how do you propagate user identity through multiple services while keeping authorization logic centralized in the system that owns it? This article explores the architectural patterns, trade-offs, and a better solution for enterprise-scale access delegation.

## Why Delegation Is Hard

Access tokens in [OAuth 2.0](/posts/continue-with-google-how-oauth-system-work-4k3l) are audience-specific by design. A token issued for Service A cannot be reused to call Service B. This security constraint prevents token replay attacks but creates a problem: how does Service A prove to Service B that it's acting on behalf of a legitimate user?

The challenge compounds when authorization rules (RBAC, ABAC policies) live in a single service—let's call it Service C. Services A and B need to make decisions based on user permissions they don't own. You face two competing forces:

* **Authorization must remain centralized** to avoid policy drift and security gaps
* **Services must operate independently** without tightly coupling to a single permission system

Most architectures fail because they try to solve this by duplicating authorization logic or stale permission caching, leading to inconsistent security boundaries and maintenance nightmares.

## Common Approaches (and Their Problems)

### Each Service Implements On-Behalf-Of (OBO)

In this pattern, every service performs its own token exchange with the authorization server. Service A receives a user token, exchanges it for a Service B token, calls Service B. Service B then exchanges that token for a Service C token, and so on.

**How it works:**
```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=<user_token_for_service_a>
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&requested_token_type=urn:ietf:params:oauth:token-type:access_token
&audience=service-b
```

**The problems:**
* **Duplicated security logic.** Every service must correctly implement token exchange, handle refresh tokens, and manage errors. One misconfigured service creates a security hole.
* **Inconsistent enforcement.** Without central governance, teams implement different validation strategies, timeout policies, and error handling.
* **Hard to audit.** When every service talks directly to the auth server, tracing who-called-what-on-behalf-of-whom becomes a distributed logging nightmare.
* **Tight coupling to auth infrastructure.** Each service needs credentials for the authorization server and must stay updated with protocol changes.

This works for small systems (3-5 services) but falls apart at scale. When you have 50 services, the combinatorial explosion of service-to-service trust relationships becomes unmaintainable.

### Gateway Token Enrichment

Here, the [API gateway](/posts/api-gateway-design-and-key-components) fetches user permissions from the RBAC system and injects them directly into the request—either by embedding claims in a JWT or adding custom headers.

**How it works:**
```javascript
// Gateway middleware
async function enrichToken(req) {
  const userId = req.token.sub;
  const permissions = await rbacService.getPermissions(userId);

  // Inject into JWT or custom header
  req.headers['X-User-Permissions'] = JSON.stringify(permissions);

  return next(req);
}
```

**The problems:**
* **Stale permissions.** Once the gateway injects permissions, downstream services see a snapshot. If permissions change mid-request (user gets promoted, access revoked), services operate on outdated data.
* **RBAC logic duplication.** The gateway must understand how to query permissions. If RBAC rules change, the gateway needs updates, breaking the single-responsibility principle.
* **Tight coupling.** Services become dependent on the gateway's enrichment format. Changing the permission structure requires coordinated deployment across all services.
* **Token bloat.** Embedding full permission sets in JWTs can exceed size limits (especially for users with hundreds of permissions), causing performance issues and proxy rejections.

This pattern only works for coarse-grained claims (e.g., "user is admin") that rarely change and fit in small tokens. For fine-grained, dynamic permissions, it creates more problems than it solves.

## The Delegation Broker Pattern

Instead of spreading delegation logic across services or injecting stale data at the gateway, introduce a **Delegation Broker**—a single service responsible for all identity propagation and delegation concerns.

**What it does:**
* Accepts delegation requests from services with context (caller service, target API, user identity)
* Validates the requesting service is authorized to act on behalf of the user
* Performs On-Behalf-Of token exchange with the authorization server
* Calls the target API with the correct audience-specific token
* Returns the response to the calling service

**Critical principle:** The broker doesn't replicate authorization logic. Service C (the RBAC owner) still enforces all permission checks. The broker simply handles the mechanics of identity propagation.

**Key benefits:**
* **Centralized security enforcement.** One service implements token exchange correctly, once. Updates to auth protocols happen in one place.
* **No permission duplication.** Services don't cache or embed permissions. They always call the source of truth through the broker.
* **Clear audit trail.** All cross-service calls flow through the broker, making it trivial to log and trace delegation chains.
* **Loose coupling.** Services depend on the broker's stable API, not on internal RBAC structures or auth server protocols.

## Architecture Walkthrough

Here's how a complete request flows through the system:

<pre class="mermaid">
sequenceDiagram
    participant User
    participant Gateway
    participant ServiceA
    participant Broker as Delegation Broker
    participant AuthServer as Auth Server
    participant ServiceC as Service C (RBAC Owner)

    User->>Gateway: Request with access token
    Gateway->>Gateway: Validate token
    Gateway->>ServiceA: Forward request + token

    ServiceA->>ServiceA: Process logic
    ServiceA->>Broker: Request delegation to Service C<br/>(user token, target: service-c)

    Broker->>Broker: Validate ServiceA is authorized<br/>to delegate for this user
    Broker->>AuthServer: Exchange token (OBO)<br/>audience: service-c
    AuthServer-->>Broker: Service C scoped token

    Broker->>ServiceC: Call API with scoped token
    ServiceC->>ServiceC: Enforce RBAC rules
    ServiceC-->>Broker: Response

    Broker-->>ServiceA: Response
    ServiceA-->>Gateway: Response
    Gateway-->>User: Final response
</pre>

**Step-by-step:**

1. **User authenticates at gateway.** The gateway validates the user's token and forwards it to Service A.

2. **Service A processes the request.** When it needs data from Service C, instead of calling directly, it calls the Delegation Broker with:
   * The user's access token
   * Target service identifier (`service-c`)
   * The API endpoint and parameters

3. **Broker validates the delegation context.** It checks:
   * Is Service A allowed to act on behalf of this user?
   * Is the requested target service registered?
   * Is the user token valid and not expired?

4. **Broker performs OBO token exchange.** It calls the authorization server using the token exchange grant type, requesting a token with `audience=service-c`.

5. **Broker calls Service C.** Using the new scoped token, it makes the API call on behalf of Service A.

6. **Service C enforces authorization.** This is critical—Service C still validates the token and applies all RBAC rules. The broker doesn't make authorization decisions; it only propagates identity.

7. **Response flows back.** Service C returns data to the broker, which forwards it to Service A, and finally to the user through the gateway.

## Trade-offs and Design Considerations

No pattern is perfect. Here's what you're trading:

**Latency vs. Correctness**
* The broker adds an extra network hop (typically 5-20ms). For read-heavy workloads hitting cached data, this matters. For operations where correctness trumps speed (financial transactions, access control changes), the trade is worth it.
* Mitigation: Colocate the broker in the same data center/region. Use HTTP/2 for connection reuse. For extremely latency-sensitive paths, allow direct service-to-service calls with proper OBO implementation.

**Centralization vs. Team Autonomy**
* Teams lose direct control over how their services call downstream dependencies. Some see this as bureaucracy.
* Reality check: Identity propagation is cross-cutting infrastructure, not business logic. Centralizing it is the same as centralizing logging or metrics collection—necessary for consistency.

**Operational Complexity vs. Long-term Consistency**
* You now have another service to deploy, monitor, and scale. Initial setup takes longer than "just call the API directly."
* Long-term payoff: When your auth provider changes, or you adopt a new protocol, updates happen in one place instead of across 50 services. When regulations require audit trails, you have them automatically.

**When the broker becomes a bottleneck:**
* The broker is stateless and horizontally scalable. Add instances as traffic grows.
* Use circuit breakers and fallback strategies. If the broker is down, services can fall back to direct OBO (with proper monitoring to ensure it's temporary).

## When to Use Each Approach

Use this decision framework:

| Your Situation | Recommended Pattern | Why |
|----------------|---------------------|-----|
| **3-5 services, stable team, low auth complexity** | Each service implements OBO | Overhead of a broker isn't justified. Keep it simple. |
| **Gateway needs to enforce coarse-grained roles (e.g., "is_admin")** | Gateway token enrichment | Adding `role: admin` to a JWT is fine. Don't overload it with fine-grained permissions. |
| **10+ services, dynamic permissions, compliance requirements** | Delegation Broker | You need centralized control, audit trails, and consistent enforcement. |
| **Latency-critical paths with rarely changing permissions** | Hybrid: Direct OBO for critical paths, broker for others | Optimize the 5% that matters, standardize the 95%. |

**Red flags that you need the broker:**
* Different services are implementing slightly different versions of OBO logic
* Your audit logs can't answer "what permissions did this user have when they made this request?"
* Teams are caching permissions locally because fetching them is too slow
* You're finding authorization bugs in services that don't own authorization

## Key Takeaways

Authorization should live in the system that owns it. Identity propagation is plumbing; it should be invisible and reliable, like DNS or TLS. Trying to solve delegation by copying permissions or duplicating logic across services creates technical debt that compounds with every new service added.

The Delegation Broker pattern works because it separates concerns: the broker handles identity mechanics, authorization services enforce business rules, and application services focus on domain logic. In large distributed systems, this separation is the difference between manageable complexity and unmaintainable sprawl.

## Closing Thoughts

Enterprise systems don't fail because of missing features—they fail because the foundational patterns can't scale. Access delegation is one of those foundational problems. Solve it incorrectly at the start, and you'll spend years fighting inconsistent security boundaries, debugging phantom permission issues, and coordinating deployments just to change an auth flow. Solve it correctly, and it becomes invisible infrastructure that just works.

## Questions

1. How does your current system handle token propagation between services? What problems have you encountered with permission staleness or inconsistent enforcement?

2. If you were to implement a Delegation Broker, what would be the biggest operational challenge in your infrastructure—latency requirements, team adoption, or something else?

<!--
Subtopic selection rationale:
- "Why Delegation Is Hard" establishes the core constraint (audience-specific tokens) that shapes all solutions
- "Common Approaches" covers existing patterns most teams try first, with honest critique of their failure modes
- "Delegation Broker Pattern" introduces the recommended solution with clear responsibilities
- "Architecture Walkthrough" provides concrete implementation details with sequence diagram
- "Trade-offs" gives pragmatic decision-making guidance rather than claiming one-size-fits-all
Selected these 5 to partition the problem space: constraints -> failed attempts -> better solution -> implementation -> decision framework.
-->
