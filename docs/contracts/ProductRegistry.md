# ProductRegistry Contract

## Overview

ProductRegistry is the core smart contract that manages product registration, custody tracking, and verification in the Aura system.

## Contract Address

| Network | Address | Explorer |
|---------|---------|----------|
| Fuji Testnet | TBD | [View on Snowtrace](https://testnet.snowtrace.io) |
| C-Chain Mainnet | TBD | [View on Snowtrace](https://snowtrace.io) |

---

## State Variables

### Product Structure

```solidity
struct Product {
    uint256 id;              // Unique product identifier
    string lotId;            // Manufacturing lot/batch ID
    string productName;      // Product name
    string origin;           // Manufacturing location
    string ipfsHash;         // IPFS hash for extended metadata
    address manufacturer;    // Manufacturer wallet address (immutable)
    uint256 createdAt;       // Registration timestamp
    uint256 verificationCount; // Number of times verified
    bool active;             // Product status (can be deactivated)
}
```

### Custody Record Structure

```solidity
struct CustodyRecord {
    address custodian;       // Wallet address of custodian
    uint256 timestamp;       // Transfer timestamp
    string locationNote;     // Location description
}
```

### Storage Mappings

```solidity
mapping(uint256 => Product) public products;
mapping(uint256 => CustodyRecord[]) public custodyHistory;
mapping(uint256 => address) public currentCustodian;
```

---

## Functions

### registerProduct

**Access:** MANUFACTURER_ROLE required

**Description:** Register a new product on-chain.

```solidity
function registerProduct(
    string memory lotId,
    string memory productName,
    string memory origin,
    string memory ipfsHash
) public onlyRole(MANUFACTURER_ROLE) returns (uint256)
```

**Parameters:**
- `lotId` — Manufacturing batch identifier
- `productName` — Product name/description
- `origin` — Manufacturing location
- `ipfsHash` — IPFS content hash for metadata

**Returns:** 
- `uint256` — Unique product ID

**Emits:**
- `ProductRegistered(uint256 productId, string lotId, address manufacturer, uint256 timestamp)`

**Example:**
```javascript
const tx = await contract.registerProduct(
  "LOT-2026-001",
  "Ibuprofeno 400mg",
  "Bogotá, Colombia",
  "QmX4f7..."
);
```

---

### transferCustody

**Access:** Current custodian only

**Description:** Transfer product custody to new address.

```solidity
function transferCustody(
    uint256 productId,
    address newCustodian,
    string memory locationNote
) public
```

**Parameters:**
- `productId` — Product to transfer
- `newCustodian` — Recipient wallet address
- `locationNote` — Location description (e.g., "Warehouse - Medellín")

**Emits:**
- `CustodyTransferred(uint256 productId, address from, address to, string location, uint256 timestamp)`

**Reverts:**
- If caller is not current custodian
- If product doesn't exist
- If newCustodian is zero address

**Example:**
```javascript
await contract.transferCustody(
  1,
  "0x8ba1f109...",
  "Distribution Center - Medellín"
);
```

---

### verifyProduct

**Access:** Public (anyone can call)

**Description:** Verify product authenticity and get complete history.

```solidity
function verifyProduct(uint256 productId) public returns (
    bool exists,
    Product memory product,
    CustodyRecord[] memory history,
    address currentCustodian
)
```

**Parameters:**
- `productId` — Product to verify

**Returns:**
- `exists` — Whether product is registered
- `product` — Product struct with all data
- `history` — Complete custody chain
- `currentCustodian` — Current holder address

**Side Effects:**
- Increments `verificationCount`
- Emits `ProductVerified` event

**Example:**
```javascript
const [exists, product, history, custodian] = await contract.verifyProduct(1);

if (exists) {
  console.log("Product:", product.productName);
  console.log("Verified", product.verificationCount, "times");
  console.log("Current custodian:", custodian);
}
```

---

### getProduct

**Access:** Public view (read-only)

**Description:** Get product data without incrementing verification counter.

```solidity
function getProduct(uint256 productId) public view returns (Product memory)
```

---

### getCustodyHistory

**Access:** Public view

**Description:** Get complete custody chain for a product.

```solidity
function getCustodyHistory(uint256 productId) public view returns (CustodyRecord[] memory)
```

---

## Events

### ProductRegistered

```solidity
event ProductRegistered(
    uint256 indexed productId,
    string lotId,
    address indexed manufacturer,
    uint256 timestamp
);
```

**Emitted when:** New product is registered

---

### CustodyTransferred

```solidity
event CustodyTransferred(
    uint256 indexed productId,
    address indexed fromCustodian,
    address indexed toCustodian,
    string location,
    uint256 timestamp
);
```

**Emitted when:** Custody is transferred

---

### ProductVerified

```solidity
event ProductVerified(
    uint256 indexed productId,
    address verifier,
    uint256 newCount,
    uint256 timestamp
);
```

**Emitted when:** Product is verified (counter incremented)

---

## Access Control

Uses OpenZeppelin's `AccessControl` for role management.

### Roles

```solidity
bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
bytes32 public constant ADMIN_ROLE = DEFAULT_ADMIN_ROLE;
```

### Role Functions

Inherited from `AccessControl`:
- `grantRole(bytes32 role, address account)` — Grant role (admin only)
- `revokeRole(bytes32 role, address account)` — Revoke role (admin only)
- `hasRole(bytes32 role, address account)` — Check if address has role

---

## Security Features

### Immutability
- Product data cannot be modified after registration
- Manufacturer address cannot be changed
- Custody history is append-only

### Validation
- Product ID must exist
- Only current custodian can transfer
- Cannot transfer to zero address
- Role checks enforced on all write operations

### Reentrancy Protection
Uses OpenZeppelin's `ReentrancyGuard` on all state-changing functions.

---

## Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| registerProduct | ~150,000 |
| transferCustody | ~80,000 |
| verifyProduct | ~60,000 |
| getProduct (view) | 0 (read-only) |

*Estimates on Avalanche C-Chain. Actual costs may vary.*

---

## Integration Examples

### Using ethers.js

```javascript
import { ethers } from 'ethers';

// Connect to contract
const provider = new ethers.JsonRpcProvider(RPC_URL);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Read product (no gas)
const product = await contract.getProduct(1);

// Verify product (costs gas)
const signer = await provider.getSigner();
const contractWithSigner = contract.connect(signer);
const tx = await contractWithSigner.verifyProduct(1);
await tx.wait();
```

### Event Listening

```javascript
// Listen for new products
contract.on("ProductRegistered", (productId, lotId, manufacturer, timestamp) => {
  console.log(`New product: ${productId} from ${manufacturer}`);
});

// Listen for custody transfers
contract.on("CustodyTransferred", (productId, from, to, location) => {
  console.log(`Product ${productId} transferred to ${to} at ${location}`);
});
```

---

## Upgradeability

**Current:** NOT upgradeable (immutable deployment)

**Rationale:** Immutability ensures trust and prevents malicious upgrades. If critical bugs are found, a new contract would be deployed and products migrated.

**Future Consideration:** Proxy pattern (UUPS or Transparent Proxy) could be implemented for production if needed, with multi-sig control.
