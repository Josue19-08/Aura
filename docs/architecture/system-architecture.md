# System Architecture

## Overview

Aura uses a three-tier architecture:

1. **Blockchain Layer** — Avalanche C-Chain
2. **Service Layer** — Node.js REST API
3. **Presentation Layer** — React Frontend

## High-Level Architecture

```
┌─────────────────────────────────────────┐
│        PRESENTATION LAYER               │
│                                         │
│  ┌───────────┐  ┌──────────────────┐  │
│  │  Verify   │  │  Register/       │  │
│  │  (Public) │  │  Transfer        │  │
│  │           │  │  (With Wallet)   │  │
│  └───────────┘  └──────────────────┘  │
└──────────────────┬──────────────────────┘
                   │ HTTPS/JSON
┌──────────────────▼──────────────────────┐
│         SERVICE LAYER                    │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Express REST API                  │ │
│  │  • Product Registration            │ │
│  │  • Custody Transfer                │ │
│  │  • Verification                    │ │
│  │  • IPFS Integration                │ │
│  └────────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │ JSON-RPC
┌──────────────────▼──────────────────────┐
│       BLOCKCHAIN LAYER                   │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  Avalanche C-Chain                 │ │
│  │                                    │ │
│  │  ┌──────────────┐  ┌────────────┐ │ │
│  │  │ProductRegistry│  │RoleManager │ │ │
│  │  └──────────────┘  └────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │  IPFS (Metadata Storage)           │ │
│  └────────────────────────────────────┘ │
└──────────────────────────────────────────┘
```

## Components

### Blockchain Layer
- **ProductRegistry.sol** — Product data, custody chain
- **RoleManager.sol** — Access control
- **IPFS** — Extended metadata storage

### Service Layer
- **Contract Service** — Blockchain interactions
- **IPFS Service** — Metadata upload/retrieval
- **Event Listener** — Monitor chain events

### Presentation Layer
- **Verify Page** — Public verification
- **Register Page** — Product registration
- **Transfer Page** — Custody transfers

## Data Flow

### Product Registration
1. User fills form → uploads to IPFS → receives hash
2. Frontend calls API with product data + IPFS hash
3. API calls contract.registerProduct()
4. Contract stores on-chain, emits event
5. Returns product ID to user

### Verification
1. User scans QR → extracts product ID
2. Frontend queries API
3. API reads contract + IPFS
4. Returns aggregated data
5. Frontend displays result with alerts

## Security

- Role-based access control on contracts
- API validates all inputs
- IPFS content addressing ensures integrity
- Public verification requires no authentication
