# Smart Contracts

## Overview

Aura uses two main smart contracts deployed on Avalanche:

1. **ProductRegistry.sol** — Core product registration and verification
2. **RoleManager.sol** — Access control and permissions

## Contracts

### [ProductRegistry](./ProductRegistry.md)
Main contract handling product lifecycle, custody transfers, and verification.

### [RoleManager](./RoleManager.md)
Role-based access control for manufacturers, distributors, and admins.

### [Deployment](./deployment.md)
Deployment scripts, addresses, and verification procedures.

## Quick Reference

### Networks

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Fuji Testnet | 43113 | https://api.avax-test.network/ext/bc/C/rpc |
| C-Chain Mainnet | 43114 | https://api.avax.network/ext/bc/C/rpc |

### Roles

- `ADMIN_ROLE` — Can grant/revoke other roles
- `MANUFACTURER_ROLE` — Can register products
- `DISTRIBUTOR_ROLE` — Can transfer custody

### Key Functions

```solidity
// Register new product (MANUFACTURER only)
registerProduct(string lotId, string productName, string origin, string ipfsHash)

// Transfer custody (current custodian only)
transferCustody(uint256 productId, address newCustodian, string locationNote)

// Verify product (public, no restrictions)
verifyProduct(uint256 productId) returns (Product, CustodyRecord[])
```
