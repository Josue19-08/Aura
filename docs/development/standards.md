# Coding Standards

## General Principles

1. **Clarity over cleverness** — Code should be easy to understand
2. **Consistency** — Follow established patterns in the codebase
3. **Security first** — Never compromise security for convenience
4. **Test coverage** — All critical paths should have tests

---

## Solidity Standards

### Naming Conventions

```solidity
// Contracts: PascalCase
contract ProductRegistry { }

// Functions: camelCase
function registerProduct() { }

// Variables: camelCase
uint256 productCount;

// Constants: SCREAMING_SNAKE_CASE
uint256 public constant MAX_PRODUCTS = 10000;

// Events: PascalCase
event ProductRegistered();

// Modifiers: camelCase
modifier onlyManufacturer() { }
```

### Function Ordering

1. Constructor
2. Receive/Fallback functions
3. External functions
4. Public functions
5. Internal functions
6. Private functions
7. View/Pure functions

### Comments

```solidity
/**
 * @notice Register a new product on-chain
 * @param lotId Manufacturing batch identifier
 * @param productName Product name
 * @return productId Unique product identifier
 */
function registerProduct(
    string memory lotId,
    string memory productName
) external returns (uint256 productId) {
    // Implementation
}
```

### Security Practices

- Always use latest stable Solidity version
- Import from OpenZeppelin when possible
- Use `ReentrancyGuard` on state-changing functions
- Validate all inputs
- Emit events for all state changes
- Use `require` for validation, `revert` with custom errors for gas optimization

---

## JavaScript/TypeScript Standards

### File Structure

```javascript
// 1. Imports
import { ethers } from 'ethers';
import { productService } from './services/product';

// 2. Constants
const DEFAULT_TIMEOUT = 5000;

// 3. Main code
class ProductService {
  // ...
}

// 4. Exports
export { ProductService };
```

### Naming Conventions

```javascript
// Functions: camelCase
function getProductById() { }

// Classes: PascalCase
class ProductService { }

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;

// Variables: camelCase
let productCount = 0;

// Private properties: prefix with _
class Service {
  _privateMethod() { }
}
```

### Async/Await

Prefer async/await over promises:

```javascript
// ✅ Good
async function getProduct(id) {
  try {
    const product = await contract.getProduct(id);
    return product;
  } catch (error) {
    console.error('Failed to get product:', error);
    throw error;
  }
}

// ❌ Avoid
function getProduct(id) {
  return contract.getProduct(id)
    .then(product => product)
    .catch(error => {
      console.error(error);
      throw error;
    });
}
```

### Error Handling

Always handle errors explicitly:

```javascript
// ✅ Good
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  logger.error('Operation failed:', error);
  throw new Error('Failed to complete operation');
}

// ❌ Bad - swallowing errors
try {
  await riskyOperation();
} catch (error) {
  // Silent failure
}
```

---

## React Standards

### Component Structure

```jsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useContract } from '@/hooks/useContract';

// 2. Component
export function ProductCard({ productId }) {
  // 3. Hooks
  const [product, setProduct] = useState(null);
  const contract = useContract();

  // 4. Effects
  useEffect(() => {
    loadProduct();
  }, [productId]);

  // 5. Functions
  async function loadProduct() {
    const data = await contract.getProduct(productId);
    setProduct(data);
  }

  // 6. Render
  if (!product) return <div>Loading...</div>;

  return (
    <div className="product-card">
      {/* ... */}
    </div>
  );
}
```

### Naming

```jsx
// Components: PascalCase
function ProductCard() { }

// Props: camelCase
function ProductCard({ productId, onSelect }) { }

// Event handlers: handleEventName
function handleClick() { }
function handleSubmit() { }

// Boolean props: is/has/can prefix
<Button isLoading disabled />
<Modal hasCloseButton />
```

### Hooks

```jsx
// Custom hooks: use prefix
function useProduct(id) {
  const [product, setProduct] = useState(null);
  // ...
  return { product, loading, error };
}

// Usage
const { product, loading, error } = useProduct(productId);
```

---

## API Standards

### Endpoint Naming

```
GET    /api/products           # List all products
GET    /api/products/:id       # Get specific product
POST   /api/products           # Create product
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product

# Use nouns, not verbs
✅ GET /api/products/:id/verify
❌ GET /api/verifyProduct/:id

# Use kebab-case for multi-word endpoints
✅ /api/custody-history
❌ /api/custodyHistory
```

### Response Format

```javascript
// Success
{
  "success": true,
  "data": {
    "product": { /* ... */ }
  }
}

// Error
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 123 not found"
  }
}

// List with pagination
{
  "success": true,
  "data": {
    "products": [ /* ... */ ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

### Status Codes

- `200` OK — Successful GET/PUT
- `201` Created — Successful POST
- `204` No Content — Successful DELETE
- `400` Bad Request — Invalid input
- `401` Unauthorized — Missing/invalid auth
- `403` Forbidden — No permission
- `404` Not Found — Resource doesn't exist
- `500` Internal Server Error — Server error

---

## Git Standards

### Commit Messages

```bash
# Format: <type>: <description>

# Types:
feat: Add product registration endpoint
fix: Correct verification count logic
docs: Update API documentation
style: Format code with prettier
refactor: Simplify custody transfer logic
test: Add tests for ProductRegistry
chore: Update dependencies

# ✅ Good commits
feat: Add IPFS metadata upload
fix: Prevent duplicate product registration
docs: Add deployment guide

# ❌ Bad commits
update
fixes
WIP
asdf
```

### Branch Naming

```bash
# Format: <type>/<description>

feature/user-authentication
bugfix/verification-counter
hotfix/security-patch
docs/api-reference
chore/update-dependencies
```

---

## Testing Standards

### Test Structure

```javascript
describe('ProductRegistry', () => {
  describe('registerProduct', () => {
    it('should register a product with valid data', async () => {
      // Arrange
      const lotId = 'LOT-001';
      const productName = 'Test Product';

      // Act
      const tx = await registry.registerProduct(lotId, productName, ...);
      const receipt = await tx.wait();

      // Assert
      expect(receipt.status).to.equal(1);
      const product = await registry.getProduct(1);
      expect(product.lotId).to.equal(lotId);
    });

    it('should revert if caller lacks MANUFACTURER_ROLE', async () => {
      await expect(
        registry.connect(unauthorized).registerProduct(...)
      ).to.be.revertedWith('AccessControl');
    });
  });
});
```

### Test Naming

- Use descriptive names: "should X when Y"
- One assertion per test when possible
- Group related tests with `describe`

---

## Documentation Standards

### README Files

Every major directory should have a README:

```markdown
# Module Name

Brief description of what this module does.

## Usage

Code example showing how to use it.

## API Reference

Link to detailed docs if applicable.
```

### Code Comments

```javascript
// ✅ Good - explains WHY
// Use exponential backoff to avoid rate limiting
await retry(apiCall, { backoff: 'exponential' });

// ❌ Bad - explains WHAT (code already shows this)
// Call apiCall with retry
await retry(apiCall);

// ✅ Good - documents complex logic
/**
 * Calculate verification anomaly score based on:
 * - Verification frequency (how often)
 * - Time distribution (when)
 * - Geographic spread (where)
 */
function calculateAnomalyScore(product) { }
```

---

## Performance Standards

### Smart Contracts

- Minimize storage reads/writes
- Use events instead of storing redundant data
- Batch operations when possible
- Use `memory` for function parameters
- Use `calldata` for external function arrays

### Frontend

- Lazy load components
- Memoize expensive computations
- Debounce user input
- Use pagination for large lists
- Optimize images (WebP, proper sizing)

### Backend

- Cache frequently accessed data
- Use connection pooling
- Index database queries
- Implement rate limiting
- Compress responses (gzip)

---

## Security Checklist

### Smart Contracts
- [ ] No reentrancy vulnerabilities
- [ ] Integer overflow/underflow protected (Solidity 0.8+)
- [ ] Access control on all write functions
- [ ] Input validation on all parameters
- [ ] Events emitted for all state changes

### Backend
- [ ] Environment variables for secrets
- [ ] Input sanitization
- [ ] Rate limiting on public endpoints
- [ ] HTTPS only in production
- [ ] CORS properly configured

### Frontend
- [ ] No hardcoded secrets
- [ ] XSS prevention (React handles most)
- [ ] Validate user input
- [ ] Secure wallet connection
- [ ] Show transaction details before signing
