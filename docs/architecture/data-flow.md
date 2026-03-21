# Data Flow

## Product Registration Flow

```
Manufacturer
    │
    ├─ 1. Fill form (name, lot, origin, docs)
    │
    ▼
Frontend
    │
    ├─ 2. Upload docs to IPFS → get hash
    │
    ├─ 3. Call API: POST /api/products/register
    │
    ▼
Backend API
    │
    ├─ 4. Validate input
    │
    ├─ 5. Call contract.registerProduct(...)
    │
    ▼
Smart Contract
    │
    ├─ 6. Verify MANUFACTURER_ROLE
    │
    ├─ 7. Create Product struct
    │
    ├─ 8. Store on-chain
    │
    ├─ 9. Emit ProductRegistered event
    │
    ▼
Returns product ID → User downloads QR code
```

## Verification Flow

```
User
    │
    ├─ 1. Scan QR code → extract product ID
    │
    ▼
Frontend
    │
    ├─ 2. Call API: GET /api/products/verify/:id
    │
    ▼
Backend API
    │
    ├─ 3. Query contract.verifyProduct(id)
    │
    ├─ 4. Fetch metadata from IPFS
    │
    ├─ 5. Analyze verification count
    │
    ├─ 6. Determine status (authentic/suspicious/not found)
    │
    ▼
Frontend displays result with custody history
```

## Custody Transfer Flow

```
Custodian
    │
    ├─ 1. Select product + new custodian address
    │
    ▼
Frontend
    │
    ├─ 2. Request wallet signature
    │
    ├─ 3. Call API: POST /api/products/transfer
    │
    ▼
Backend API
    │
    ├─ 4. Verify signature
    │
    ├─ 5. Call contract.transferCustody(...)
    │
    ▼
Smart Contract
    │
    ├─ 6. Verify caller is current custodian
    │
    ├─ 7. Append CustodyRecord to history
    │
    ├─ 8. Update current custodian
    │
    ├─ 9. Emit CustodyTransferred event
    │
    ▼
Returns updated custody chain → Display timeline
```
