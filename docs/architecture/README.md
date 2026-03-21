# Architecture Overview

Aura is built as a decentralized traceability system with three main layers:

1. **Blockchain Layer** — Immutable product registry on Avalanche
2. **Service Layer** — API bridge between blockchain and applications
3. **Application Layer** — User-facing interfaces

---

## Architecture Documents

### [System Architecture](./system-architecture.md)
Complete system design, component interactions, and layers.

### [Data Flow](./data-flow.md)
How data moves through the system from registration to verification.

### [Tech Stack](./tech-stack.md)
Technologies, frameworks, and services used.

---

## High-Level Diagram

```
APPLICATION LAYER
├─ Verify Page (Public)
├─ Register Page (Manufacturers)
└─ Transfer Page (Distributors)
       │
       ▼
SERVICE LAYER (REST API)
├─ Contract Service
├─ IPFS Service
└─ Event Listener
       │
       ▼
BLOCKCHAIN LAYER
├─ ProductRegistry.sol
├─ RoleManager.sol
└─ IPFS Storage
```

---

## Key Design Decisions

### Why Avalanche?
- Low cost (<$0.01/tx)
- Fast finality (~2s)
- EVM compatible
- Latin America focus

### Why REST API?
- Public verification without wallet
- Easier mobile integration
- Better UX for non-crypto users
- Aggregate on-chain + off-chain data

### Why IPFS?
- Decentralized storage
- Content-addressed (immutable)
- Cost-efficient for documents
- Blockchain stores only hash

---

## Security Model

### On-Chain
- Role-based access control
- Immutable product records
- Event audit trail

### Off-Chain
- API input validation
- Rate limiting
- IPFS pinning for availability
