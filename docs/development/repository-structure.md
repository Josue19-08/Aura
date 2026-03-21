# Repository Structure

```
aura/
├── contracts/                  # Smart contracts
│   ├── ProductRegistry.sol    # Main product registry
│   ├── RoleManager.sol        # Access control
│   └── interfaces/            # Contract interfaces
│
├── scripts/                   # Deployment & utility scripts
│   ├── deploy.js             # Deploy contracts to network
│   ├── verify.js             # Verify contracts on Snowtrace
│   └── seed.js               # Seed demo data
│
├── test/                      # Smart contract tests
│   ├── ProductRegistry.test.js
│   └── RoleManager.test.js
│
├── backend/                   # API server
│   ├── src/
│   │   ├── index.js          # Express app entry
│   │   ├── routes/
│   │   │   ├── products.js   # Product endpoints
│   │   │   └── health.js     # Health check
│   │   ├── services/
│   │   │   ├── contract.js   # Contract interactions
│   │   │   ├── ipfs.js       # IPFS operations
│   │   │   └── events.js     # Event listener
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   └── utils/
│   │       └── logger.js
│   ├── package.json
│   └── .env.example
│
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Verify.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Transfer.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── WalletConnect.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── VerificationResult.jsx
│   │   │   ├── CustodyTimeline.jsx
│   │   │   └── QRScanner.jsx
│   │   ├── hooks/
│   │   │   ├── useContract.js
│   │   │   └── useVerification.js
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   └── constants.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── logo.svg
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env.example
│
├── docs/                      # Documentation
│   ├── README.md
│   ├── brand/                 # Brand guidelines
│   ├── architecture/          # System architecture
│   ├── product/               # Product documentation
│   ├── contracts/             # Contract specs
│   └── development/           # Development guides
│
├── hardhat.config.js          # Hardhat configuration
├── package.json               # Root package.json
├── .env.example              # Environment variables template
├── .gitignore
└── README.md                  # Project overview
```

## Key Directories

### `/contracts`
Solidity smart contracts. Keep organized by functionality.

**Naming Convention:**
- PascalCase for contract files
- Match contract name to file name
- Use `I` prefix for interfaces (e.g., `IProductRegistry.sol`)

### `/scripts`
Deployment and automation scripts. Written in JavaScript/TypeScript.

**Common Scripts:**
- `deploy.js` — Deploy all contracts
- `verify.js` — Verify on block explorer
- `seed.js` — Add demo data for testing

### `/test`
Smart contract tests using Hardhat + Chai.

**Naming Convention:**
- Match contract name: `ProductRegistry.test.js`
- Group related tests with `describe` blocks
- Clear test names: "Should register product with valid data"

### `/backend`
Node.js/Express API server.

**Structure:**
- **routes/** — Express route handlers
- **services/** — Business logic, external integrations
- **middleware/** — Auth, validation, error handling
- **utils/** — Helper functions

### `/frontend`
React application built with Vite.

**Structure:**
- **pages/** — Top-level route components
- **components/** — Reusable UI components
- **hooks/** — Custom React hooks
- **utils/** — Helper functions, constants

### `/docs`
Comprehensive project documentation.

**Organization:**
- Brand guidelines and design system
- Architecture and technical docs
- Product specifications
- Development guides

---

## File Naming Conventions

### Smart Contracts
```
ProductRegistry.sol      ✅ PascalCase, descriptive
product_registry.sol     ❌ Don't use snake_case
registry.sol             ❌ Too generic
```

### JavaScript/TypeScript
```
productService.js        ✅ camelCase for files
product-service.js       ✅ kebab-case acceptable
ProductService.js        ⚠️  Only for React components
PRODUCT_SERVICE.js       ❌ Don't use SCREAMING_CASE
```

### React Components
```
VerificationResult.jsx   ✅ PascalCase, .jsx extension
verificationResult.js    ❌ Must be PascalCase
verification-result.jsx  ❌ Don't use kebab-case
```

### Tests
```
ProductRegistry.test.js  ✅ Match source file + .test
productRegistry.spec.js  ✅ .spec also acceptable
test-registry.js         ❌ Unclear what's being tested
```

### Documentation
```
system-architecture.md   ✅ kebab-case, descriptive
System Architecture.md   ❌ No spaces in filenames
arch.md                  ❌ Too abbreviated
```

---

## Environment Files

### `.env.example` (committed to repo)
Template showing required environment variables with dummy values.

```bash
# Blockchain
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# IPFS
IPFS_API_TOKEN=your_token_here

# API
PORT=5000
NODE_ENV=development
```

### `.env` (local, not committed)
Actual secrets and configuration. Add to `.gitignore`.

---

## Configuration Files

### `hardhat.config.js`
```javascript
module.exports = {
  solidity: "0.8.24",
  networks: {
    fuji: {
      url: process.env.AVALANCHE_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 43113
    }
  },
  etherscan: {
    apiKey: process.env.SNOWTRACE_API_KEY
  }
};
```

### `vite.config.js`
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
```

### `tailwind.config.js`
```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#0A0A0F',
        signal: '#00E5CC',
        caution: '#FF6B35',
        // ... rest of brand colors
      }
    }
  }
}
```

---

## Import Conventions

### Absolute vs Relative Imports

**Backend (Node.js):**
```javascript
// Prefer relative imports
import { contractService } from './services/contract.js';
import { logger } from '../utils/logger.js';
```

**Frontend (React):**
```javascript
// Use absolute imports (configured in vite.config.js)
import { VerificationResult } from '@/components/VerificationResult';
import { useContract } from '@/hooks/useContract';
```

### Import Ordering
```javascript
// 1. External dependencies
import React from 'react';
import { ethers } from 'ethers';

// 2. Internal modules
import { contractService } from './services/contract';
import { logger } from './utils/logger';

// 3. Components
import { Header } from './components/Header';

// 4. Styles
import './App.css';
```

---

## Code Organization Best Practices

### Single Responsibility
Each file should have one clear purpose.

```
✅ productService.js       — Handles all product-related business logic
❌ utils.js                — Too generic, split into specific utilities
```

### Consistent Structure
Follow same pattern across similar files.

**Example: All route files follow same structure**
```javascript
// 1. Imports
// 2. Route definitions
// 3. Export router
```

### Clear Dependencies
Make dependencies explicit in imports, avoid deep nesting.

```javascript
// ✅ Clear dependency
import { getProduct } from '../services/product';

// ❌ Too deep, hard to refactor
import { getProduct } from '../../../services/product';
```
