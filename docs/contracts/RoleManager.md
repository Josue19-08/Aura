# RoleManager Contract

## Overview

RoleManager handles access control for the Aura system using OpenZeppelin's role-based access control (RBAC).

---

## Roles

### DEFAULT_ADMIN_ROLE
**Capabilities:**
- Grant and revoke all roles
- Manage other admins
- Emergency pause operations

**Assignment:** 
- Deployer receives this role automatically
- Should be transferred to multi-sig in production

---

### MANUFACTURER_ROLE
**Capabilities:**
- Register new products
- View own products
- Transfer custody of own products

**Who gets this:**
- Verified manufacturing companies
- Must be granted by admin after verification

---

### DISTRIBUTOR_ROLE
**Capabilities:**
- Receive custody from manufacturers
- Transfer custody to retailers
- View custody history

**Who gets this:**
- Logistics companies
- Distributors
- Importers

---

## Functions

### grantRole

**Access:** Admin only

```solidity
function grantRole(bytes32 role, address account) public onlyRole(DEFAULT_ADMIN_ROLE)
```

**Example:**
```javascript
const MANUFACTURER_ROLE = await contract.MANUFACTURER_ROLE();
await contract.grantRole(MANUFACTURER_ROLE, "0x742d35Cc...");
```

---

### revokeRole

**Access:** Admin only

```solidity
function revokeRole(bytes32 role, address account) public onlyRole(DEFAULT_ADMIN_ROLE)
```

**Use Case:** Remove access from compromised or non-compliant accounts

---

### hasRole

**Access:** Public view

```solidity
function hasRole(bytes32 role, address account) public view returns (bool)
```

**Example:**
```javascript
const hasPermission = await contract.hasRole(MANUFACTURER_ROLE, userAddress);
```

---

## Role Management Best Practices

### Production Setup
1. Deploy contracts from deployer wallet
2. Grant roles to verified entities
3. Transfer admin role to multi-sig
4. Renounce deployer admin role

### Security
- Never grant MANUFACTURER_ROLE without verification
- Use multi-sig for ADMIN_ROLE in production
- Regularly audit role holders
- Revoke roles from inactive or compromised accounts

---

## Integration

```javascript
// Check if user can register products
const canRegister = await contract.hasRole(
  await contract.MANUFACTURER_ROLE(),
  userAddress
);

if (!canRegister) {
  throw new Error("User does not have MANUFACTURER_ROLE");
}
```
