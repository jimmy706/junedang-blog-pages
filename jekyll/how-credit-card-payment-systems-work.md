---
title: "How Credit Card Payment Systems Work"
description: "A deep technical exploration of the credit card payment ecosystem, from authorization to settlement, explaining the architecture behind billions of daily transactions."
tags: [payments, fintech, system-design, architecture, finance]
date: 2026-03-09
---

You tap your card at a coffee shop. Two seconds later, the terminal beeps and prints a receipt. Behind those two seconds lies one of the most intricate, resilient, and economically significant distributed systems ever built. A transaction that feels instant actually involves a dozen parties, crosses multiple networks, triggers fraud checks, updates ledgers in different time zones, and settles days later through a clearing infrastructure most people never see.

Credit card payments are not simple money transfers. They are a choreographed dance of authorization, risk assessment, message routing, ledger reconciliation, and credit extension—all happening at massive scale with strict latency and consistency requirements. This article explains how that system actually works, from the moment a card is presented to the final settlement and billing cycle. We will cover the technical architecture, the business model, the security mechanisms, and the edge cases that make payments engineering one of the hardest problems in distributed systems.

## Why Credit Cards Are Not Just Bank Transfers

Before diving into the mechanics, we need to understand what makes credit card payments fundamentally different from simpler payment methods.

**Cash** is immediate settlement. You hand over physical currency, the merchant receives it, and the transaction is final. There is no credit, no intermediary, no network.

**Debit cards** pull money directly from your bank account. The transaction still involves a network and authorization, but there is no credit extension. If you lack sufficient funds, the transaction fails immediately.

**Credit cards** introduce a critical distinction: the issuer extends you short-term unsecured credit at the point of sale. You are borrowing money from the card issuer to pay the merchant. The merchant gets paid by the acquirer (not by you), and you repay the issuer later, often weeks after the purchase. This creates a complex web of financial relationships, risk management, and delayed settlement that does not exist with cash or debit.

This credit model is why authorization and settlement are separate steps. Authorization is a promise that the issuer will pay. Settlement is the actual movement of money. Between them lies clearing, reconciliation, interchange fees, fraud scoring, and chargeback risk. Understanding this separation is the key to understanding the entire system.

## The Main Players in the Payment Ecosystem

A credit card transaction involves many parties, each with specific roles, incentives, and information boundaries. Here is the complete cast:

### Cardholder

The person making the purchase. They hold a physical or virtual card issued by a bank. The cardholder sees the simplest view: swipe, tap, or enter card details, then wait for approval or decline. They are usually unaware of the complexity behind the scenes.

**What they know:** Their available credit, their statement balance, their billing cycle.

**What they do not know:** The real-time risk score assigned to their transaction, the exact interchange fee the merchant pays, or the full routing path their authorization request takes.

**How they make money:** They do not. Premium cardholders may receive rewards (cashback, points, miles), which are funded by interchange fees and interest payments from revolving balances.

### Merchant

The business selling goods or services. The merchant wants to accept card payments to maximize sales, but they pay fees for the privilege.

**What they do:** Present the payment terminal or checkout page, capture card data (or tokenized credentials), submit an authorization request, and later capture the funds.

**What they know:** The approval or decline status, the approximate settlement time (usually T+1 to T+3 days), and their effective merchant discount rate (MDR).

**What they do not know:** The cardholder's actual credit limit, the specific reason for a decline (fraud vs. insufficient funds), or the cardholder's identity beyond the name on the card.

**How they make money:** By selling products. They lose money on payment fees, which typically range from 1.5% to 3.5% of the transaction amount, depending on card type, industry, and risk profile.

### Point of Sale Terminal / Payment Gateway

The hardware or software interface that captures payment credentials.

**In-store:** A physical terminal with card readers (chip, magnetic stripe, contactless NFC).

**Online:** A payment gateway (Stripe, Adyen, Braintree) that provides a checkout form, encrypts card data, and forwards authorization requests to the acquirer.

**What it does:** Reads card data, encrypts it, formats it into a payment message (often ISO 8583 format), and sends it upstream. Modern terminals tokenize card data immediately to avoid storing raw PANs (Primary Account Numbers).

**What it knows:** Card number, expiry, CVV (briefly, before encryption), merchant ID, transaction amount, terminal ID, timestamp, merchant category code (MCC).

**What it does not know:** The cardholder's credit limit, their transaction history, or whether the card is about to be declined.

### Payment Processor

A technology company that aggregates payment requests from merchants and routes them to acquirers or directly to card networks. Examples: Stripe, Square, Adyen, Fiserv.

**What it does:** Provides APIs for merchants, handles tokenization, manages PCI compliance, batches transactions, provides reporting dashboards, and handles retries, reconciliation, and exception handling.

**What it knows:** Merchant transaction volume, approval rates, decline reasons, batch settlement data.

**What it does not know:** The cardholder's full financial profile or internal issuer policies.

**How it makes money:** Per-transaction fees, monthly platform fees, and sometimes a share of the interchange.

### Acquirer (Acquiring Bank)

The financial institution that has a relationship with the merchant. The acquirer is responsible for onboarding merchants, assessing their risk, and ultimately funding them after settlement.

**What it does:** Underwrites the merchant (evaluates fraud and chargeback risk), forwards authorization requests to the card network, receives settlement funds from the network, and deposits them into the merchant's account (minus fees).

**What it knows:** Merchant transaction history, chargeback rates, approval rates, and settlement windows.

**What it does not know:** The cardholder's identity or spending behavior across other merchants.

**How it makes money:** Fees charged to merchants and a portion of the interchange.

### Card Network / Scheme

The infrastructure that routes authorization requests and clearing messages between acquirers and issuers. Examples: Visa, Mastercard, American Express (which also acts as issuer), Discover, UnionPay.

**What it does:** Maintains the global switching network, defines message formats and protocols, enforces compliance rules, manages tokenization services (Visa Token Service, Mastercard Digital Enablement Service), and sets interchange fee schedules.

**What it knows:** Every transaction that flows through its network, aggregate spending patterns, fraud trends, and merchant/issuer performance metrics.

**What it does not know:** The full balance sheet of the cardholder or the exact fraud rules used by individual issuers.

**How it makes money:** Per-transaction network fees (scheme fees), assessment fees, and licensing fees paid by issuers and acquirers.

### Issuer (Issuing Bank)

The financial institution that issued the card to the cardholder. The issuer is the entity extending credit and bearing the primary fraud risk.

**What it does:** Evaluates authorization requests in real time, checks the cardholder's credit limit, assesses fraud risk, approves or declines, and later posts the transaction to the cardholder's account during settlement. The issuer also manages the billing cycle and collects repayments.

**What it knows:** The cardholder's full transaction history (across all merchants), credit limit, payment history, risk score, current balance, and often real-time location data (for fraud detection).

**What it does not know:** Exactly how much the merchant is paying in fees or the exact terms of the merchant's acquiring contract.

**How it makes money:** Interchange fees (the largest revenue source), interest on revolving balances, annual fees, late fees, foreign transaction fees, and cash advance fees.

### Token Service Provider

A system that replaces the real card number (PAN) with a temporary token that is meaningless outside a specific context. This is typically operated by the card networks (Visa Token Service, Mastercard MDES) or third-party providers like Apple Pay, Google Pay.

**What it does:** Generates tokens tied to specific devices or merchants, stores the mapping between token and PAN, and provisions tokens to wallets and terminals.

**What it knows:** Which tokens map to which PANs and the context in which each token is valid (merchant, device, transaction type).

**What it does not know:** The cardholder's credit limit or transaction history.

**How it makes money:** Per-token fees, reduced fraud losses.

### Fraud and Risk Systems

Separate or integrated services that score every transaction for fraud risk. These may be operated by the issuer, the acquirer, the processor, or third-party specialists (Kount, Sift, Feedzai).

**What they do:** Analyze transaction patterns, device fingerprints, location data, velocity checks (how many transactions in the last hour?), historical fraud patterns, and behavioral biometrics. Output a risk score that influences authorization decisions.

**What they know:** Everything about the transaction context: IP address, device ID, shipping address, billing address, time of day, merchant category, transaction amount relative to history.

**What they do not know:** The cardholder's internal motivations or whether a high-risk transaction is actually legitimate.

### Settlement and Clearing Infrastructure

The back-office systems that reconcile authorization messages, calculate net positions, and trigger actual funds movement between banks. This happens in batch processes, typically once per day.

**What it does:** Aggregates all approved transactions, calculates interchange fees, generates clearing files, and instructs banks to move funds via ACH, wire, or other settlement mechanisms.

**What it knows:** The full ledger of who owes whom, down to the cent.

**What it does not know:** Real-time authorization data (clearing is asynchronous and delayed).

## The Complete Transaction Lifecycle

Let's walk through a single transaction from start to finish. We will use a concrete example: a customer buys a $100 item at a physical store using a Visa credit card issued by Chase.

### Step 1: Card Presented

The customer taps their card on a contactless terminal. The terminal reads the card's EMV chip or NFC antenna. The card transmits:

- Primary Account Number (PAN)
- Expiry date
- Cardholder name
- EMV cryptogram (a one-time code proving the card is genuine and present)

The terminal immediately tokenizes the PAN if the network supports it. The raw PAN never leaves the terminal in plaintext in modern systems.

### Step 2: Authorization Request Created

The terminal constructs an authorization message (ISO 8583 format) containing:

- Merchant ID
- Terminal ID
- Transaction amount ($100.00)
- Currency code (USD)
- Merchant Category Code (MCC, e.g., 5411 for grocery stores)
- Timestamp
- Tokenized card credentials
- EMV data (cryptogram, application transaction counter)
- Card entry mode (contactless, chip, swipe, manual entry)

The message is encrypted and sent to the payment processor or acquirer.

### Step 3: Routing Through Processor and Acquirer

The acquirer receives the message, adds its own identifiers (acquirer BIN, acquiring institution code), and forwards it to the card network (Visa).

Visa's switching infrastructure performs a lookup: which issuer owns this PAN or token? The network routes the message to Chase.

**Latency budget so far:** ~50-150 milliseconds.

### Step 4: Issuer Authorization Decision

Chase receives the authorization request. Here is what happens in the next ~100-200 milliseconds:

1. **Card validation:** Is the card active? Not reported stolen? Not expired?
2. **Balance check:** Is there available credit? Current balance + $100 ≤ credit limit?
3. **Fraud scoring:** The transaction is scored by a real-time risk engine. Inputs include:
   - Is the merchant location consistent with recent cardholder behavior?
   - Is this a high-risk MCC?
   - Has the card been used multiple times in the last hour (velocity check)?
   - Does the amount fit historical spending patterns?
   - Is the card physically present (chip/NFC) or card-not-present (online)?
4. **Regulatory checks:** Any sanctions, AML flags, or geographic restrictions?
5. **Business rules:** Does the cardholder have a hold or restriction on their account?

If all checks pass, Chase approves the transaction and reserves $100 of the cardholder's available credit. This reservation is called an **authorization hold**.

Chase responds with an approval code (a unique alphanumeric identifier, e.g., "AB1234") and returns it to Visa.

### Step 5: Approval Returned to Merchant

Visa forwards the approval to the acquirer, which forwards it to the processor, which forwards it to the terminal.

The terminal beeps, displays "Approved," and prints a receipt.

**Total elapsed time:** 1-3 seconds.

### Step 6: What Just Happened?

The customer thinks they paid $100. The merchant thinks they made a sale. But here is the reality:

- **No money has moved yet.**
- The issuer placed an authorization hold on the cardholder's credit line.
- The merchant has a promise that they will be paid, but they have not received funds.
- The transaction is in an **authorized but not captured** state.

### Step 7: Capture

At the end of the business day, the merchant's system sends a **capture** request for all authorized transactions. This tells the acquirer: "I fulfilled the order, now give me the money."

For card-present transactions, capture usually happens automatically within minutes to hours. For card-not-present transactions (online), the merchant may delay capture until the item ships.

Capture converts an authorization into a **cleared transaction** that will proceed to settlement.

### Step 8: Clearing

Once per day (typically at midnight in the merchant's time zone), the acquirer batches all captured transactions and submits them to the card network as a **clearing file**.

The clearing file contains:

- All transaction details from the authorization
- Capture timestamps
- Any adjustments (tips added at restaurants, final fuel amounts at gas stations)

Visa receives the clearing file, validates it against the original authorizations, calculates interchange fees, and forwards the file to Chase (the issuer).

### Step 9: Settlement

Settlement is the actual movement of money between banks.

Here is the flow:

1. Visa calculates the net position: the acquirer owes Chase $100 (minus fees).
2. Interchange fee (let's say 2.0% = $2.00) goes to Chase.
3. Visa's network fee (let's say 0.1% = $0.10) goes to Visa.
4. The acquirer's fee (let's say 0.4% = $0.40) stays with the acquirer.
5. The merchant receives $100 - $2.00 - $0.10 - $0.40 = $97.50.

Visa instructs the banks: Chase (issuer) pays the acquirer $100. The acquirer then deposits $97.50 into the merchant's account.

This happens via **bank settlement networks** (ACH, wire, or Visa's own settlement system). The merchant typically sees the funds T+1 to T+3 days after the transaction date.

### Step 10: Posting to Cardholder Account

Chase posts the $100 charge to the cardholder's account, converting the authorization hold into a **posted transaction**. The cardholder sees it on their statement as a finalized charge.

If the merchant never captures the transaction, the authorization hold expires after 5-7 days and the reserved credit is released.

### Step 11: Billing Cycle and Repayment

At the end of the billing cycle (typically monthly), Chase sends the cardholder a statement showing all posted transactions, including this $100 charge.

The cardholder has a grace period (usually 21-25 days) to pay the balance in full without incurring interest. If they pay the full balance, no interest is charged. If they pay only the minimum payment or a partial amount, interest accrues on the remaining balance at the APR specified in the card agreement (often 15-25% annually).

This is how the issuer makes money on revolving credit.

## Authorization in Deep Detail

Authorization is the most latency-sensitive part of the system. The customer is standing at the terminal or staring at a loading spinner. The issuer has ~200 milliseconds to make a decision.

### Authorization Request Fields

A full authorization request contains dozens of fields. Here are the most important:

| Field | Example | Purpose |
|---|---|---|
| PAN or Token | 4532-XXXX-XXXX-1234 | Identifies the card |
| Amount | 100.00 | Transaction value |
| Currency | USD | Denomination |
| MCC | 5411 | Merchant category (grocery) |
| Merchant Name | "Joe's Market" | Human-readable identifier |
| Terminal ID | TID-99887 | Specific device |
| Merchant ID | MID-ABC123 | Acquirer-assigned identifier |
| Timestamp | 2026-03-09T14:32:10Z | When the transaction occurred |
| Card Entry Mode | 05 (chip) | How the card was read |
| EMV Cryptogram | AES-encrypted blob | Proof of chip presence |
| CVV | 123 (for CNP) | Card verification value |
| Postal Code | 94103 (for CNP) | Address verification |

### Issuer Decision Logic

The issuer's authorization system is a real-time decision engine. Here is a simplified decision tree:

<pre class="mermaid">
flowchart TD
    A[Authorization Request] --> B{Card Active?}
    B -->|No| DECLINE1[Decline: Card Inactive]
    B -->|Yes| C{Sufficient Credit?}
    C -->|No| DECLINE2[Decline: Insufficient Funds]
    C -->|Yes| D{Fraud Score}
    D -->|High Risk| E{3D Secure Passed?}
    E -->|No| DECLINE3[Decline: Suspected Fraud]
    E -->|Yes| APPROVE[Approve + Hold Amount]
    D -->|Low Risk| APPROVE
</pre>

The fraud score is computed by a separate system that may use machine learning models trained on millions of historical transactions. Features include:

- **Transaction amount relative to history:** A $5,000 purchase on a card that normally spends $50-$200 is suspicious.
- **Geographic distance:** A purchase in New York followed by one in London 30 minutes later is impossible without cloning.
- **Velocity checks:** More than 5 transactions in an hour, or more than 10 in a day, may indicate compromise.
- **Merchant category:** Online gambling, cryptocurrency, or high-risk merchants get higher scrutiny.
- **Device fingerprint:** For online transactions, the browser, IP address, and device ID are compared to known profiles.

### Partial Approvals

Some issuers support **partial approvals**: if you request $100 but only have $60 of available credit, the issuer approves $60 and tells the terminal to request the remaining $40 via another payment method. This is common at gas stations and prepaid cards.

### Auth-Only vs. Auth-Capture

**Auth-only:** The merchant checks if the card can pay but does not yet charge it. Used for pre-authorization at hotels (they hold $200 but only charge your actual stay amount later) or at gas pumps (hold $100, settle the actual pump amount later).

**Auth-capture:** The merchant authorizes and captures immediately. Used for most retail transactions.

### Incremental Authorization

Restaurants use this: the initial authorization is for the meal cost ($50), but the customer adds a $10 tip. The terminal sends an **incremental auth** for the tip, updating the total hold to $60.

### Reversals

If the merchant accidentally double-charges or the customer cancels immediately, the merchant can send a **reversal**. This releases the authorization hold before settlement. Reversals must happen quickly (within minutes to hours) and are technically distinct from refunds.

## Clearing and Settlement in Detail

Clearing and settlement are asynchronous batch processes that happen after authorization. They exist because money does not actually move during authorization—only promises are exchanged.

### Why Authorization and Settlement Are Separate

1. **Latency:** Real-time authorization must be fast (<2 seconds). Bank-to-bank funds transfer is slow (hours to days).
2. **Adjustments:** The final amount may differ from the authorization amount (tips, gas pump final totals, hotel incidental charges).
3. **Batching efficiency:** It is cheaper to move money once per day in bulk than per transaction.
4. **Risk and fraud:** The issuer needs time to finalize fraud checks and detect chargebacks before irreversibly transferring funds.

### Clearing Process

Every evening, acquirers submit **clearing files** to card networks. These files contain:

- Original authorization codes
- Final transaction amounts (including any adjustments)
- Merchant IDs
- Terminal IDs
- Timestamps

The card network validates each entry against the authorization log. If the clearing amount differs significantly from the auth amount, the network may flag it for review or reject it.

The network calculates:

- **Interchange fees** (paid by acquirer to issuer, set by the card network, typically 1.5%-2.5%)
- **Scheme fees** (paid by both acquirer and issuer to the network, typically 0.1%-0.15%)

The network generates **settlement instructions**: how much the acquirer owes the issuer (or vice versa, if there are refunds or disputes).

### Settlement Timing

**T+1 to T+3:** Most merchants receive funds 1-3 business days after the transaction date. High-risk merchants or new accounts may wait longer. Enterprise merchants with strong relationships may get T+0 or T+1.

**Net settlement:** Banks do not transfer funds for every single transaction. Instead, they calculate net positions: if Chase issued 1,000 transactions totaling $100,000 and acquired 800 transactions totaling $80,000, Chase's net position is +$20,000. Only the net amount moves between banks.

### Merchant Discount Rate (MDR)

The merchant does not receive the full transaction amount. They pay a **merchant discount rate**, which is the sum of:

- Interchange fee (~1.8% for a Visa credit card, higher for premium cards)
- Network fee (~0.1%)
- Acquirer/processor fee (~0.5%-1.0%)

**Total MDR:** ~2.4%-3.5% for credit cards, lower for debit cards (~0.5%-1.5%).

For our $100 transaction:

- Merchant receives: ~$97.50
- Issuer receives: ~$1.80
- Network receives: ~$0.10
- Acquirer/processor receives: ~$0.60

### Reconciliation

Merchants, acquirers, and issuers all maintain independent ledgers. **Reconciliation** is the process of comparing these ledgers to ensure consistency. Discrepancies arise from:

- Declined transactions that were logged but not cleared
- Chargebacks
- Refunds
- Adjustments (tips, final fuel amounts)
- Network errors

Reconciliation runs nightly and flags exceptions for manual review. Large merchants have dedicated finance teams that reconcile payment data against their own order databases.

## The Credit Model

Credit cards are called "credit" cards because the issuer extends **unsecured short-term credit** to the cardholder at the point of sale. This is the defining feature that separates credit cards from debit cards.

### How the Credit System Works

When you use a credit card:

1. **The issuer pays the merchant** (via the acquirer and network).
2. **You owe the issuer**, not the merchant.
3. The issuer gives you a **grace period** (typically 21-25 days after the statement closing date) to repay without interest.
4. If you pay the full balance, you pay zero interest. This is called **transacting** behavior.
5. If you pay less than the full balance, the remaining amount becomes a **revolving balance**, and interest accrues daily at the APR specified in your card agreement.

### Billing Cycle

A typical billing cycle:

- **March 1-31:** Billing cycle. All purchases post to your account.
- **March 31:** Statement closes. Balance = $1,000.
- **April 1-25:** Grace period. No interest accrues yet.
- **April 25:** Payment due date. Minimum payment = $25 (typically 1-3% of balance).
- If you pay $1,000: no interest, balance = $0.
- If you pay $25: revolving balance = $975. Interest starts accruing daily.

### Interest Calculation

Interest is calculated using the **average daily balance** method:

```
Daily interest rate = APR / 365
Daily balance = outstanding balance after each transaction posts
Interest for the month = Σ(daily balance × daily interest rate)
```

Example: APR = 18%, balance = $1,000 for the entire month.

```
Daily rate = 18% / 365 = 0.0493%
Monthly interest = $1,000 × 0.000493 × 30 = $14.79
```

This compounds. If you only pay the minimum, your balance grows exponentially.

### Why Issuers Profit from Revolvers

Cardholders who carry a balance month-to-month are called **revolvers**. They generate the majority of issuer profit through interest charges. Cardholders who pay in full each month are called **transactors**. They generate profit only through interchange fees.

Issuers design rewards programs to attract high-spending transactors while hoping a percentage become revolvers.

### Minimum Payment and Debt Trap

The minimum payment is typically 1-3% of the balance. Paying only the minimum keeps the account current (no late fees) but barely touches the principal. A $1,000 balance at 18% APR with $25 minimum payments takes **5+ years** to pay off and costs over $600 in interest.

This is intentional. Credit card debt is profitable for issuers but financially destructive for consumers who do not understand the math.

### Grace Period Exceptions

The grace period only applies if you paid the previous month's balance in full. If you carry a balance from the prior month, **new purchases start accruing interest immediately**. This is a common trap.

### Late Fees and Penalties

Miss a payment? Expect:

- Late fee: $25-$40
- Penalty APR: Your rate may jump to 29.99%
- Credit score damage: 30-60 day delinquencies are reported to credit bureaus

## Technical Infrastructure

Payment systems are distributed systems running at global scale with strict performance, availability, and consistency requirements. Here is how they are architected.

### Authorization Path (Synchronous, Low-Latency)

Authorization is a synchronous request-response flow with a strict latency budget:

<pre class="mermaid">
flowchart LR
    Terminal[Terminal] -->|ISO 8583| Processor[Processor]
    Processor -->|TLS/HTTP| Acquirer[Acquirer]
    Acquirer -->|Private Network| Network[Card Network]
    Network -->|Private Network| Issuer[Issuer Auth System]
    Issuer -->|Approve/Decline| Network
    Network --> Acquirer
    Acquirer --> Processor
    Processor --> Terminal
</pre>

**Latency budget:**

- Terminal → Processor: 20-50ms
- Processor → Acquirer: 10-30ms
- Acquirer → Network: 30-70ms
- Network → Issuer: 50-100ms
- Issuer decision: 100-200ms
- Return path: 110-250ms

**Total:** 320-700ms

Authorization systems use:

- **High-performance message queues** (Kafka, RabbitMQ) for internal routing
- **In-memory caches** (Redis) for fraud rules, card status, and BIN lookups
- **Load balancers** and **auto-scaling** to handle peak traffic (Black Friday, holiday shopping)
- **Circuit breakers** to isolate failing upstream services
- **Idempotency keys** to prevent duplicate charges if the network retries

### Clearing and Settlement Path (Asynchronous, Batch-Oriented)

Clearing and settlement are batch jobs that run off the critical path.

<pre class="mermaid">
flowchart TB
    A[Acquirer Batch Job] -->|Clearing File| B[Network Clearing System]
    B -->|Clearing Messages| C[Issuer Ledger System]
    C -->|Settlement Instruction| D[ACH / Wire / Internal Network]
    D --> E[Bank Accounts Updated]
</pre>

Clearing files are processed nightly. Settlement happens T+1 to T+3. These systems use:

- **Batch processing frameworks** (Hadoop, Spark) for large-scale reconciliation
- **Database transactions** with strong consistency guarantees (PostgreSQL, Oracle) for ledger updates
- **Distributed locks** to prevent double settlement
- **Audit logs** and **immutable event streams** for regulatory compliance

### Failure Modes and Resilience

Payments must be resilient to:

- **Network partitions:** Authorization times out. The terminal retries. The issuer must detect duplicates using the authorization code or a transaction ID.
- **Issuer downtime:** If the issuer is unreachable, the network may apply **stand-in processing**: use historical approval patterns to make a decision on behalf of the issuer. The issuer reconciles later.
- **Double charges:** If the terminal does not receive a response, it may retry. The issuer must deduplicate using idempotency keys or transaction IDs.
- **Partial captures:** The merchant authorizes $100 but only captures $80. The remaining $20 hold must be released.
- **Chargebacks:** The cardholder disputes the charge. The issuer reverses the settlement and debits the acquirer, who debits the merchant. The merchant can contest, but often loses.

### Idempotency and Retry Safety

Every authorization request includes a unique identifier (transaction ID, authorization code). If the network retries, the issuer recognizes the duplicate and returns the same response. This prevents double-charging.

Idempotency is critical because networks are unreliable. A lost response does not mean the transaction failed—it may have succeeded but the response was dropped. Retries must be safe.

### Ledger Correctness

Issuer and acquirer ledgers must be:

- **Consistent:** Every authorization has a corresponding clearing entry or reversal.
- **Auditable:** Every state change is logged immutably.
- **Reconcilable:** Nightly batch jobs detect discrepancies and flag them for manual review.

Double-entry bookkeeping is used: every debit has a corresponding credit.

### Observability and Debugging

Distributed payment systems use:

- **Distributed tracing** (Jaeger, Zipkin) to follow a transaction across services
- **Structured logging** with correlation IDs
- **Real-time dashboards** showing approval rates, decline reasons, and latency percentiles
- **Alerting** on anomalies (sudden drop in approval rate, spike in fraud declines)

Debugging a failed transaction requires stitching together logs from terminal, processor, acquirer, network, and issuer—often across organizational boundaries. This is why trace IDs and correlation IDs are essential.

## Online Payments vs. In-Store Payments

Card-present (in-store) and card-not-present (online) transactions have different fraud profiles, security mechanisms, and authorization flows.

### Card-Present (CP)

**How it works:**

- Physical card and cardholder are present.
- Card is read via **EMV chip** (preferred), **contactless NFC** (Apple Pay, Google Pay), or **magnetic stripe** (legacy, being phased out).
- The chip generates a **dynamic cryptogram** that is unique to this transaction and cannot be reused. This prevents cloning.

**Fraud risk:** Low. The chip proves the physical card is present. The merchant is not liable for fraud (liability shifts to the issuer).

**CVV usage:** Not required for chip or contactless transactions. The cryptogram replaces it.

**Authorization flow:** Terminal → Acquirer → Network → Issuer → Response in 1-3 seconds.

### Card-Not-Present (CNP)

**How it works:**

- Customer enters card number, expiry, and CVV on a website or app.
- No physical card, no chip, no cryptogram.
- The payment gateway tokenizes the card data and forwards it to the acquirer.

**Fraud risk:** High. Anyone with the card details can make a purchase. The merchant is liable for fraud.

**Security mechanisms:**

- **CVV check:** The CVV (3-digit code on the back) is not stored on the magnetic stripe or chip. It proves possession of the physical card.
- **Address Verification Service (AVS):** The issuer checks if the billing postal code matches the address on file.
- **3-D Secure (3DS):** An additional authentication step (Visa Secure, Mastercard Identity Check). The cardholder is redirected to their bank's page to enter a password or receive a one-time code. This shifts liability to the issuer.

**Authorization flow:** Gateway → Processor → Acquirer → Network → Issuer → 3DS check (if enabled) → Response in 2-5 seconds.

### EMV Chip

**EMV (Europay, Mastercard, Visa)** is a global standard for chip cards. The chip contains:

- A microprocessor
- Encrypted card data
- A private key used to generate cryptograms

When you insert or tap your card, the chip and terminal perform a **cryptographic handshake**. The chip generates a unique cryptogram for this transaction. The issuer validates the cryptogram to confirm the card is genuine and present.

**Why chips matter:** Magnetic stripes store static data that can be cloned. Chips generate dynamic data that cannot be reused. This reduced card-present fraud by over 70% in markets that adopted EMV.

### Contactless / NFC

Contactless payments (Apple Pay, Google Pay, tap-to-pay cards) use **Near Field Communication (NFC)**. The phone or card transmits encrypted card data and a cryptogram to the terminal.

**Tokenization:** Apple Pay and Google Pay do not transmit your real card number. They use **tokens** issued by the card network. The token is device-specific and meaningless if intercepted.

**Security:** Equivalent to chip security. Dynamic cryptograms prevent replay attacks. Biometric authentication (Face ID, fingerprint) adds an extra layer.

### 3-D Secure (3DS)

**3-D Secure** is an additional authentication step for online purchases. When enabled:

1. The customer enters card details on the merchant's site.
2. The gateway redirects the customer to the issuer's authentication page.
3. The customer enters a password, one-time code (SMS or app), or uses biometric authentication.
4. The issuer confirms the customer's identity and returns an authentication token.
5. The authorization proceeds with the token included. If the transaction is later disputed, the issuer is liable (not the merchant).

**Versions:**

- **3DS 1.0:** Clunky redirect flow. High abandonment rates.
- **3DS 2.0:** Embedded iframe, biometric authentication, risk-based flow (low-risk transactions skip authentication). Much smoother UX.

### Fraud Profile Comparison

| Factor | Card-Present | Card-Not-Present |
|---|---|---|
| Physical card required? | Yes | No |
| Cryptogram generated? | Yes (chip/NFC) | No |
| CVV required? | No (chip/NFC) | Yes |
| Fraud risk | Low | High |
| Merchant liability | No (issuer liable) | Yes (unless 3DS used) |
| Approval rate | ~95-98% | ~85-92% |

## Security Mechanisms

Payment systems are high-value targets for fraud. Security is layered and defense-in-depth.

### PAN (Primary Account Number)

The 16-digit card number. The first 6 digits are the **BIN (Bank Identification Number)**, which identifies the issuer. The last digit is a **checksum** (Luhn algorithm) to detect typos.

The PAN is the most sensitive piece of data. Modern systems avoid storing or transmitting it.

### Tokenization

**Tokenization** replaces the PAN with a token that is meaningless outside a specific context. The token looks like a real card number but is randomly generated and maps to the real PAN only in the token service provider's vault.

**Example:** Real PAN = 4532-1234-5678-9010. Token = 4532-9999-8888-7777. The token is used for authorization. The network's token service translates it back to the real PAN before routing to the issuer.

**Benefits:**

- If the merchant's database is breached, the tokens are useless.
- Tokens can be restricted to a specific merchant, device, or transaction type.
- Tokens can be rotated or revoked without canceling the card.

### Encryption

Card data is encrypted **at rest** (in databases) and **in transit** (TLS/SSL for network transmission). Modern terminals encrypt the PAN immediately after reading it. The acquirer never sees the plaintext PAN.

### PCI DSS (Payment Card Industry Data Security Standard)

**PCI DSS** is a set of security standards for any entity that stores, processes, or transmits card data. Compliance is mandatory for merchants and processors.

**Key requirements:**

- Encrypt cardholder data in transit and at rest.
- Do not store CVV after authorization.
- Restrict access to card data to authorized personnel only.
- Regularly test security systems (penetration testing, vulnerability scans).
- Maintain audit logs of all access to card data.

Merchants that handle card data directly must undergo annual PCI audits. Using a payment gateway (Stripe, Adyen) offloads PCI compliance to the gateway.

### EMV Cryptograms

The EMV chip generates a **dynamic cryptogram** for each transaction. The cryptogram is encrypted using the chip's private key and can only be validated by the issuer using the corresponding public key.

**Static vs. dynamic data:**

- **Magnetic stripe:** Static data. Cloning is trivial.
- **EMV chip:** Dynamic cryptogram. Cloning requires breaking cryptography, which is infeasible.

### CVV / CVC (Card Verification Value)

The 3-digit code on the back of the card (or 4 digits on the front for Amex). The CVV is not stored on the magnetic stripe or chip and must not be stored by merchants after authorization.

**Purpose:** Proves possession of the physical card for card-not-present transactions.

### AVS (Address Verification Service)

The issuer checks if the billing postal code provided by the customer matches the address on file. Used for online transactions to reduce fraud.

**Response codes:**

- **Y:** Address and ZIP match.
- **Z:** ZIP matches, address does not.
- **N:** Neither matches.
- **U:** AVS unavailable.

Merchants can decline transactions with AVS mismatches.

### 3-D Secure / Strong Customer Authentication

3-D Secure adds a second factor (password, OTP, biometric) to online purchases. In Europe, **Strong Customer Authentication (SCA)** is legally required for most online transactions under PSD2 regulations.

### Fraud Scoring

Real-time fraud detection uses machine learning models to assign a risk score (0-100) to each transaction. High-risk transactions may be declined automatically or flagged for manual review.

**Features used:**

- Transaction amount relative to history
- Merchant category (high-risk: gambling, crypto)
- Geographic location (is the cardholder traveling?)
- Device fingerprint (browser, IP, OS)
- Velocity checks (how many transactions in the last hour?)
- Time of day (purchases at 3 AM are unusual)

### Velocity Checks

Issuers track the number and frequency of transactions:

- More than 5 transactions in 10 minutes? Suspicious.
- More than $5,000 in one day on a card that normally spends $200? Suspicious.
- 3 declined transactions followed by an approval? Possible card testing.

## Failure and Edge Cases

Real-world payment systems deal with messy edge cases that idealized models ignore.

### Declines and Decline Reasons

Not all declines are the same. The issuer returns a **decline reason code** (ISO 8583 response code):

- **51:** Insufficient funds / exceeds credit limit
- **05:** Do not honor (generic decline, often fraud-related)
- **54:** Expired card
- **57:** Transaction not permitted to cardholder (card not activated for online use, or international transactions blocked)
- **61:** Exceeds withdrawal limit
- **63:** Security violation (failed CVV or AVS check)
- **96:** System malfunction (network or issuer error)

Merchants see a generic decline message. They do not see the specific reason (privacy/security concern).

### Network Timeouts

If the issuer does not respond within the timeout window (typically 10-30 seconds), the network returns a timeout response to the acquirer. The merchant sees "Declined - Please retry."

The terminal may retry automatically. The issuer must deduplicate if the first request actually succeeded.

### Duplicate Charges

If the network times out and the terminal retries, the issuer may receive two identical authorization requests. The issuer must detect this using the transaction ID or authorization code and return the same response for both.

Failure to deduplicate results in double-charging the customer.

### Reversals

A **reversal** cancels an authorization before settlement. Used for:

- Merchant error (accidentally charged twice)
- Customer cancels immediately
- Pre-authorization amount adjustment (gas station holds $100, you pump $40, reversal releases $60)

Reversals must happen quickly (within minutes to hours). After settlement, you must issue a **refund** instead.

### Refunds

A **refund** is a new transaction that credits the cardholder's account. It appears on the next statement as a negative charge. Refunds take 5-10 business days to post.

**Why so slow?** The refund goes through the same clearing and settlement process as a purchase. It is not instant because it involves inter-bank funds movement.

### Chargebacks

A **chargeback** is a cardholder dispute. The cardholder contacts the issuer and claims:

- Fraud: "I did not make this purchase."
- Product not received: "The merchant never shipped the item."
- Product not as described: "I ordered a laptop, received a brick."

The issuer reverses the charge and debits the acquirer, who debits the merchant. The merchant can contest the chargeback by providing proof of delivery, tracking numbers, or transaction logs. The issuer reviews the evidence and makes a final decision.

**Merchant impact:** Chargebacks are expensive. Each one costs $15-$100 in fees. High chargeback rates (>1%) can result in the merchant losing their acquiring account.

**Friendly fraud:** Some cardholders abuse chargebacks to get free products. "I didn't authorize this" when they actually did. Merchants lose.

### Offline Terminal Behavior

In rare cases (cruise ships, airplanes, remote areas), terminals operate offline. They store authorized transactions locally and submit them in batch when reconnected.

**Risk:** The issuer cannot validate the transaction in real time. The merchant assumes the risk. Offline transactions are typically limited to low amounts ($50-$100).

### Pre-Authorization at Hotels and Gas Stations

**Hotels:** Place a hold for the room rate + estimated incidentals ($200-$500). When you check out, they capture the actual amount and release the rest.

**Gas stations:** Place a hold ($75-$125). When you finish pumping, they adjust the authorization to the actual fuel cost.

### Tips Adjustment at Restaurants

You pay a $50 meal with your card. The terminal authorizes $50. You write a $10 tip on the receipt. The merchant later sends an **incremental authorization** for $10 or adjusts the capture to $60.

### International Transactions

When you use a US card in Europe:

1. The merchant charges in EUR.
2. The card network converts EUR → USD using the **network exchange rate** (Visa or Mastercard sets this daily).
3. The issuer posts the USD amount to your account.
4. The issuer adds a **foreign transaction fee** (1-3% of the transaction amount).

**Dynamic currency conversion (DCC):** Some merchants offer to charge your card in USD instead of EUR. This is usually a worse exchange rate. Always decline DCC and pay in the local currency.

### Cross-Border Fees

International transactions incur higher interchange fees (~3% vs. ~2% domestic). Acquirers also pay cross-border fees to the network. These costs are passed to the merchant.

## Economics of the System

Payment systems are complex because they are economic systems with multiple parties, each extracting value.

### Where the Money Flows

For a $100 transaction:

- **Customer pays:** $100 (and potentially interest if they revolve the balance)
- **Merchant receives:** ~$97.00 (after 3% MDR)
- **Interchange (to issuer):** ~$1.80
- **Network fee (to Visa/Mastercard):** ~$0.10
- **Acquirer/processor fee:** ~$1.10

### Merchant Discount Rate (MDR)

The merchant's cost to accept cards. Varies by:

- **Card type:** Debit < credit < premium credit (rewards cards cost merchants more).
- **Transaction type:** Card-present < card-not-present (higher fraud risk → higher fees).
- **Merchant category:** Low-risk (grocery) < high-risk (travel, gambling).
- **Volume:** High-volume merchants negotiate lower rates.

**Typical MDR:**

- Debit card: 0.5%-1.5%
- Credit card: 2.0%-3.0%
- Premium rewards card: 2.5%-3.5%

### Interchange Fees

The largest component of MDR. Set by the card networks and paid by the acquirer to the issuer. Designed to incentivize issuers to issue more cards.

**Interchange schedule:** Card networks publish detailed interchange fee tables with hundreds of categories based on card type, merchant type, and transaction characteristics.

**Example (simplified):**

- Visa credit card, card-present, grocery store: 1.55% + $0.04
- Visa rewards card, card-not-present, e-commerce: 2.40% + $0.10

### Scheme Fees

Paid by both issuer and acquirer to the card network. Covers network infrastructure, fraud detection, tokenization services, and brand licensing.

**Typical scheme fees:** 0.09%-0.15% per transaction.

### Issuer Revenue Model

Issuers make money from:

1. **Interchange fees:** $1.80 per $100 transaction (1.8%).
2. **Interest on revolving balances:** 15-25% APR on unpaid balances.
3. **Annual fees:** $0-$500+ for premium cards.
4. **Late fees:** $25-$40 per missed payment.
5. **Foreign transaction fees:** 1-3% on international purchases.
6. **Cash advance fees:** 3-5% of the advance amount.
7. **Balance transfer fees:** 3-5% of the transferred amount.

**Revenue breakdown (approximate):**

- Interchange: 40-50%
- Interest: 40-50%
- Fees: 10-20%

### Acquirer Revenue Model

Acquirers make money from:

- **MDR:** The portion they keep after paying interchange and network fees (~0.5%-1.0%).
- **Monthly fees:** Platform fees, statement fees, PCI compliance fees.
- **Chargeback fees:** $15-$100 per chargeback.

### Why Rewards Exist

Issuers offer rewards (1-5% cashback, travel points) to attract high-spending cardholders. Rewards are funded by:

- Interchange fees from merchants
- Interest from revolvers
- Annual fees

Premium cards (Amex Platinum, Chase Sapphire Reserve) have high annual fees ($550-$700) and high interchange rates (3%+), which fund generous rewards (3-5 points per dollar).

**The game:** Issuers hope reward-seeking transactors eventually become revolvers. Even if they do not, high spending generates interchange revenue.

### Why Some Merchants Dislike Cards

Card acceptance costs merchants 2-3% of revenue. For low-margin businesses (gas stations, grocery stores with 1-2% margins), this is a significant hit. Some merchants:

- Pass fees to customers (gas stations charge more for credit than cash)
- Set minimum purchase amounts for cards ($10 minimum)
- Discourage card use (cash discounts)

But refusing cards means losing sales. Cards are now expected by consumers.

### Why Premium Cards Cost Merchants More

Premium rewards cards have higher interchange rates because:

- Wealthier cardholders spend more (high lifetime value to issuers)
- Rewards programs cost money (funded by higher interchange)
- Premium cards signal high credit quality (lower fraud risk, but higher costs)

Merchants cannot surcharge based on card type (Visa/Mastercard rules), so they eat the cost.

## Example Walkthrough: $100 Purchase at a Store

Let's walk through every step of a $100 purchase at a physical retail store using a Visa credit card.

### T=0: Customer taps card

- Card: Visa credit card issued by Chase
- Merchant: "Tech Store Inc."
- Transaction: $100.00
- Terminal: EMV contactless reader

### T=0 to T=200ms: Authorization request

1. Terminal reads NFC transmission from card.
2. Card's chip generates a dynamic cryptogram.
3. Terminal tokenizes PAN (does not send raw card number).
4. Terminal constructs ISO 8583 authorization request:
   - Merchant ID: "TECH123"
   - Terminal ID: "TERM456"
   - Amount: $100.00
   - Currency: USD
   - MCC: 5732 (electronics)
   - Timestamp: 2026-03-09 14:32:10 UTC
   - Token: 4532-XXXX-XXXX-9999
   - Cryptogram: [encrypted blob]
5. Terminal sends encrypted message to payment processor.

### T=200ms to T=400ms: Routing to issuer

6. Processor forwards to acquirer (Bank of America).
7. Acquirer adds its BIN and forwards to Visa network.
8. Visa looks up token → determines issuer is Chase.
9. Visa routes message to Chase authorization system.

### T=400ms to T=600ms: Issuer authorization

10. Chase receives request.
11. Chase validates:
    - Card is active (not canceled or reported stolen).
    - Cardholder has $5,000 credit limit, current balance $1,200 → available credit = $3,800 ✓
    - EMV cryptogram validates ✓ (proves physical card is present)
12. Chase runs fraud check:
    - Merchant location: California (cardholder lives in California ✓)
    - Merchant category: electronics (normal for this cardholder ✓)
    - Transaction amount: $100 (within normal range ✓)
    - Recent velocity: 2 transactions today (normal ✓)
    - Device: chip present, low fraud risk ✓
    - **Fraud score: 5/100 (very low risk)**
13. Chase approves transaction.
14. Chase places $100 authorization hold on account (available credit reduced to $3,700).
15. Chase generates approval code: "AB1234".
16. Chase returns approval response to Visa.

### T=600ms to T=800ms: Approval returned

17. Visa forwards approval to acquirer.
18. Acquirer forwards to processor.
19. Processor forwards to terminal.
20. Terminal beeps, displays "Approved," prints receipt.

**Total time: ~800ms.**

### T=30 minutes: Capture

21. Merchant's batch system sends capture request for all authorized transactions.
22. Authorization is converted to a captured transaction.
23. Merchant's system marks the order as ready to fulfill.

### T=1 day (midnight): Clearing

24. Acquirer batches all captured transactions and submits clearing file to Visa.
25. Clearing file includes:
    - Authorization code: AB1234
    - Merchant ID: TECH123
    - Amount: $100.00
    - Timestamp: 2026-03-09 14:32:10 UTC
26. Visa validates the clearing entry against the authorization log (matches ✓).
27. Visa calculates fees:
    - Interchange (to Chase): $1.80
    - Network fee (to Visa): $0.10
    - Acquirer keeps: $0.60
    - Merchant receives: $97.50
28. Visa forwards clearing message to Chase.

### T=2 days: Settlement

29. Visa generates settlement instruction:
    - Chase (issuer) owes acquirer $100.00.
    - Acquirer owes Chase $1.80 (interchange).
    - Acquirer owes Visa $0.10 (network fee).
    - Net: Chase pays acquirer $98.10.
30. Visa instructs banks to move funds via ACH.
31. Funds are transferred between banks.
32. Acquirer deposits $97.50 into merchant's bank account (T+2 settlement).

### T=2 days: Posting to cardholder account

33. Chase posts the $100 transaction to cardholder's account.
34. Cardholder sees the charge on their online banking app:
    - **Tech Store Inc. - $100.00 - Mar 9**
35. Available credit drops to $3,700.
36. Statement balance increases to $1,300.

### T=30 days: Statement closes

37. Statement period ends March 31.
38. Statement shows:
    - Previous balance: $1,200
    - New charges: $100
    - Total balance: $1,300
    - Minimum payment: $39 (3% of balance)
    - Payment due: April 25

### T=55 days: Cardholder pays

39. Cardholder pays $1,300 (full balance) on April 20.
40. No interest charged (paid within grace period).
41. Balance returns to $0.
42. Available credit: $5,000.

### Who Made Money?

- **Merchant:** $100 sale, paid $2.50 in fees → **$97.50 profit** (minus cost of goods).
- **Chase (issuer):** $1.80 interchange → **$1.80 profit** (plus $0 interest since cardholder paid in full).
- **Visa:** $0.10 network fee → **$0.10 profit**.
- **Acquirer:** $0.60 from MDR → **$0.60 profit**.
- **Cardholder:** Paid $100, received the product. If using a rewards card, may have earned $1-$2 in cashback → **net cost $98-$99**.

## System Design Perspective for Engineers

If you were designing a payment system from scratch, here are the key engineering considerations:

### Latency-Sensitive Authorization Path

**Requirement:** Authorization must complete in <2 seconds (ideally <1 second).

**Architecture:**

- **Synchronous request-response** from terminal to issuer.
- **In-memory caches** for card status, BIN lookups, fraud rules.
- **Load balancing** across multiple authorization servers.
- **Circuit breakers** to fail fast if an upstream service is down.
- **Retry logic** with exponential backoff, but be careful of double-charges.
- **Distributed tracing** to measure latency at each hop.

**Consistency:** Strong consistency is not required. If a cardholder's credit limit was updated 5 seconds ago, it is acceptable for the authorization system to see the old value briefly (eventual consistency).

### Ledger and Settlement Path

**Requirement:** Ledgers must be **strongly consistent** and **auditable**. Every dollar must be accounted for.

**Architecture:**

- **Relational database** (PostgreSQL, Oracle) with ACID transactions.
- **Double-entry bookkeeping:** Every debit has a corresponding credit.
- **Immutable event log:** All state changes are appended to an event stream (Kafka).
- **Batch reconciliation jobs** that run nightly to detect discrepancies.
- **Distributed locks** to prevent concurrent modification of the same ledger entry.

**Consistency:** Strong consistency. Settlement is not real-time, so we can afford higher latency to guarantee correctness.

### Idempotency and Retries

**Problem:** Networks are unreliable. A timeout does not mean the transaction failed.

**Solution:**

- Every authorization request includes a **transaction ID** or **idempotency key**.
- If the same transaction ID arrives twice, return the cached response from the first attempt.
- Store the response in a cache (Redis) with a TTL of 24 hours.

```python
def authorize(transaction_id, amount, card_token):
    # Check if we have already processed this transaction
    cached_response = redis.get(f"auth:{transaction_id}")
    if cached_response:
        return cached_response  # Idempotent response

    # Process the transaction
    response = check_balance_and_fraud(card_token, amount)

    # Cache the response
    redis.setex(f"auth:{transaction_id}", 86400, response)
    return response
```

### High Availability

**Requirement:** Authorization systems must have 99.99%+ uptime. Downtime = lost revenue for merchants and bad customer experience.

**Architecture:**

- **Multi-region deployment** with automatic failover.
- **Active-active** across data centers if possible (authorization systems are mostly stateless except for caches).
- **Health checks** and **auto-scaling** to handle traffic spikes.
- **Stand-in processing:** If the issuer is unreachable, the network can approve low-risk transactions using historical patterns.

### Fraud Detection

**Requirement:** Score every transaction for fraud in <200ms.

**Architecture:**

- **Real-time feature extraction:** IP address, device fingerprint, location, velocity.
- **Pre-trained ML models** (logistic regression, gradient boosting, neural networks) served from low-latency inference systems.
- **Feature store** (Redis, DynamoDB) for fast lookups of cardholder history.
- **Rule engine** for deterministic policies ("always decline transactions from blacklisted countries").

### Reconciliation and Audit

**Requirement:** Every transaction must be reconcilable. Detect discrepancies between authorization, clearing, and settlement.

**Architecture:**

- **Event sourcing:** Store every state change (authorized, captured, cleared, settled) as an immutable event.
- **Nightly batch jobs** that compare:
  - Authorizations vs. captures (detect missing captures)
  - Captures vs. clearing (detect mismatches)
  - Clearing vs. settlement (detect accounting errors)
- **Alert on exceptions** for manual review.

### Security Boundaries

**Requirement:** Card data must not leak.

**Architecture:**

- **Tokenization:** Replace PAN with a token at the earliest possible point (terminal or gateway).
- **Encryption at rest and in transit:** All card data encrypted with strong keys (AES-256).
- **Secrets management:** Use a vault (HashiCorp Vault, AWS Secrets Manager) to store keys and credentials.
- **PCI DSS compliance:** Regular audits, penetration testing, and vulnerability scans.
- **Least privilege:** Services only access the data they need. Acquirers never see CVV. Merchants never see the full PAN.

### Observability

**Requirement:** Understand the state of the system in real time. Debug failures across organizational boundaries.

**Architecture:**

- **Distributed tracing:** Every request has a trace ID that follows it across services (terminal → processor → acquirer → network → issuer).
- **Structured logging:** Log every authorization decision, decline reason, and latency measurement.
- **Metrics and dashboards:** Approval rate, decline rate by reason, P50/P95/P99 latency, fraud score distribution.
- **Alerting:** Spike in declines, drop in approval rate, latency regression.

### API Design Example

If you were building an authorization API:

```
POST /v1/authorize
Content-Type: application/json
Idempotency-Key: txn-abc123

{
  "amount": 10000,  // cents
  "currency": "USD",
  "card_token": "tok_4532XXXX9999",
  "merchant_id": "merchant_12345",
  "terminal_id": "terminal_67890",
  "mcc": "5732",
  "timestamp": "2026-03-09T14:32:10Z",
  "cryptogram": "AES_ENCRYPTED_BLOB",
  "card_entry_mode": "contactless"
}

Response (200 OK):
{
  "authorization_code": "AB1234",
  "status": "approved",
  "available_credit": 370000,  // cents
  "fraud_score": 5,
  "timestamp": "2026-03-09T14:32:11Z"
}

Response (402 Payment Required):
{
  "status": "declined",
  "reason_code": "51",
  "reason_message": "Insufficient funds",
  "timestamp": "2026-03-09T14:32:11Z"
}
```

## Common Misconceptions

Let's correct some common misunderstandings about credit card payments:

### Misconception: "Approved means the merchant got paid instantly"

**Reality:** Approval means the issuer placed a hold on the cardholder's credit line. The merchant receives funds T+1 to T+3 days later, after clearing and settlement.

### Misconception: "The card network and the issuer are the same thing"

**Reality:** The network (Visa, Mastercard) routes messages. The issuer (Chase, Bank of America) makes the authorization decision and extends credit. They are separate entities with separate roles. (Exception: American Express acts as both network and issuer.)

### Misconception: "Credit card payments are just bank transfers"

**Reality:** Credit cards involve credit extension, risk assessment, interchange fees, authorization holds, clearing, settlement, and potential chargebacks. Bank transfers (ACH, wire) are simpler: money moves directly from one account to another with no credit involved.

### Misconception: "Chargebacks are the same as refunds"

**Reality:** A refund is initiated by the merchant and is a voluntary reversal. A chargeback is initiated by the cardholder and is a dispute. Chargebacks are adversarial and costly for merchants.

### Misconception: "Contactless payments are less secure"

**Reality:** Contactless payments use dynamic cryptograms, just like chip cards. They are equally secure and often more secure than magnetic stripe or card-not-present transactions.

### Misconception: "The CVV is stored on the card's chip"

**Reality:** The CVV is printed on the card and is not stored on the chip or magnetic stripe. This is why online merchants ask for it—it proves you have the physical card in hand. Merchants are not allowed to store the CVV after authorization.

### Misconception: "The merchant sees why the card was declined"

**Reality:** The merchant receives a generic decline response. The specific reason (fraud, insufficient funds, card stolen) is not disclosed to protect cardholder privacy.

### Misconception: "High-limit cards are always approved"

**Reality:** Authorization depends on available credit (limit minus current balance), not the limit itself. A $10,000 limit with a $9,900 balance will decline a $200 transaction.

### Misconception: "Authorization holds disappear immediately if a transaction is canceled"

**Reality:** Authorization holds typically expire after 5-7 days if not captured. Merchants can issue a reversal to release the hold sooner, but it is not instant. This is why cardholders sometimes see "pending" charges for days after a canceled order.

## Conclusion: Why This System Is One of the Most Important Invisible Infrastructures

Every day, billions of credit card transactions flow through this system. It is invisible to most people—just a tap, a beep, and a receipt. But behind that simplicity is a distributed system of staggering scale and complexity.

Credit card payments are hard because they require:

- **Sub-second latency** for authorization across multiple networks and geographic regions.
- **Strong consistency** for ledgers and settlement to ensure every dollar is accounted for.
- **Defense-in-depth security** to protect card data and prevent fraud.
- **Resilience to failure** because downtime costs millions.
- **Economic coordination** between multiple parties with competing incentives.
- **Regulatory compliance** across jurisdictions with different rules.

This is not a simple CRUD app. It is a real-time, distributed, strongly consistent, high-availability, low-latency, security-critical financial system. It is one of the hardest engineering problems in the world.

For software engineers, payment systems are a masterclass in distributed systems design. They show you how to build systems that are fast, correct, secure, and resilient under adversarial conditions. They force you to think about idempotency, eventual consistency, failure modes, observability, and economics.

For system architects, payment systems reveal the tradeoffs between latency and consistency, between security and usability, between centralization and federation. They demonstrate how to design APIs, message formats, and protocols that work at global scale across organizational boundaries.

For everyone else, payment systems are a reminder that the modern world runs on invisible infrastructure. The next time you tap your card for coffee, remember: you just participated in a choreographed dance involving a dozen companies, three networks, two banks, a fraud detection system, a clearing house, and a settlement process—all in under two seconds.

That is the magic and the engineering brilliance of credit card payment systems.

## Questions

1. **Why are authorization and settlement separate steps in credit card payments?** What would happen if they were combined into a single operation?

2. **How does the fraud detection system balance false positives (declining legitimate transactions) and false negatives (approving fraudulent transactions)?** What is the cost of each type of error?

<!-- Subtopic selection rationale: Chose "Main Players" (system components and relationships), "Transaction Lifecycle" (end-to-end flow from authorization to settlement), "Authorization in Detail" (latency-sensitive real-time path), "Clearing and Settlement" (async batch reconciliation), "Credit Model" (the business logic of credit extension), "Technical Infrastructure" (engineering architecture), "Online vs In-Store" (different threat models and security mechanisms), "Security Mechanisms" (defense in depth), "Failure and Edge Cases" (real-world complications), "Economics" (incentives and money flow), "Example Walkthrough" (concrete instantiation), "System Design" (engineering perspective), and "Common Misconceptions" (correcting mental models). These fifteen sections partition the problem space from first principles through implementation reality, balancing business and technical depth. -->
