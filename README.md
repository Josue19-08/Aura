# Aura

> Immutable product traceability on blockchain.

**Tagline:** "Every product has a story. Now it's unbreakable."

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.24-363636?logo=solidity)](https://soliditylang.org/)
[![Avalanche](https://img.shields.io/badge/Avalanche-E84142?logo=avalanche&logoColor=white)](https://www.avax.network/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Hardhat](https://img.shields.io/badge/Hardhat-2.19-FFF100?logo=hardhat&logoColor=black)](https://hardhat.org/)

---

## What is Aura?

Aura is a blockchain-based product traceability system built on Avalanche. Each product receives a unique, immutable digital identity at manufacture. Every transfer through the supply chain—from manufacturer to distributor to retailer—is permanently recorded on-chain. Anyone can verify product authenticity by scanning a QR code, with automatic fraud detection.

### Key Features

- ✅ **Immutable Records** — Product history cannot be altered or tampered with
- 🔍 **Public Verification** — Anyone can verify authenticity, no account required
- 🔄 **Complete Custody Chain** — Full transparency from manufacturer to consumer
- 🚨 **Fraud Detection** — Automatic alerts for copied QR codes and anomalies
- 📊 **Full Transparency** — See every step of a product's journey

---

## Quick Start

### Prerequisites

- Node.js v20+
- MetaMask or compatible wallet
- Avalanche Fuji testnet AVAX ([get from faucet](https://faucet.avax.network/))

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/aura.git
cd aura

# Install dependencies
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..

# Configure environment
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edit .env files with your values

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Fuji testnet
npx hardhat run scripts/deploy.js --network fuji

# Start backend
cd backend && npm run dev

# Start frontend (in another terminal)
cd frontend && npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

---

## Project Structure

```
aura/
├── contracts/              # Smart contracts
│   ├── ProductRegistry.sol
│   └── interfaces/
├── scripts/               # Deployment scripts
├── test/                  # Smart contract tests
├── backend/               # API server
│   └── src/
│       ├── routes/
│       ├── services/
│       ├── middleware/
│       └── utils/
├── frontend/              # React application
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── hooks/
│       └── utils/
└── docs/                  # Documentation
    ├── brand/
    ├── architecture/
    ├── product/
    ├── contracts/
    └── development/
```

---

## Tech Stack

### Blockchain
- **Solidity ^0.8.24** — Smart contracts
- **Hardhat** — Development environment
- **OpenZeppelin** — Security standards
- **Avalanche** — C-Chain (Fuji Testnet / Mainnet)

### Backend
- **Node.js + Express** — REST API
- **ethers.js v6** — Blockchain interaction
- **IPFS** — Decentralized metadata storage

### Frontend
- **React 18 + Vite** — Modern UI framework
- **TailwindCSS** — Utility-first styling
- **RainbowKit + wagmi** — Wallet connection
- **Framer Motion** — Smooth animations
- **React Router** — Navigation

---

## Deployed Contracts

### Fuji Testnet

| Contract | Address | Explorer |
|----------|---------|----------|
| ProductRegistry | [0x8d4f9119E2b74d7A299AC340f4F7c5DBE9539E14](https://testnet.snowtrace.io/address/0x8d4f9119E2b74d7A299AC340f4F7c5DBE9539E14) | [View on Snowtrace](https://testnet.snowtrace.io/address/0x8d4f9119E2b74d7A299AC340f4F7c5DBE9539E14) |

### C-Chain Mainnet

| Contract | Address | Explorer |
|----------|---------|----------|
| ProductRegistry | TBD | [View on Snowtrace](https://snowtrace.io) |

---

## Documentation

Comprehensive documentation available in [`/docs`](/docs):

### For Contributors
- **[Contributing Guide](/docs/CONTRIBUTING.md)** — How to contribute to Aura
- **[Design System](/docs/brand/DESIGN_SYSTEM.md)** — Complete design documentation
- **[Quick Reference](/docs/brand/QUICK_REFERENCE.md)** — Fast lookup for common patterns
- **[Homepage Implementation](/docs/brand/homepage-implementation.md)** — Detailed UI implementation

### Technical Documentation
- **[Architecture](/docs/architecture/)** — System design and tech stack
- **[Product Specs](/docs/product/)** — Features and user flows
- **[Smart Contracts](/docs/contracts/)** — Contract documentation
- **[Development](/docs/development/)** — Setup guides and roadmap
- **[Testing Guide](/docs/development/testing.md)** — CI matrix, Playwright coverage, and manual QA checklist

---

## Brand

### Colors
- **Void** `#0A0A0F` — Main background
- **Signal** `#00E5CC` — Primary accent, verification success
- **Caution** `#FF6B35` — Alerts, counterfeit warnings

### Typography
- **Space Grotesk** — Display/Hero text
- **IBM Plex Mono** — Technical data (hashes, IDs)
- **DM Sans** — Interface/Body text

---

## Testing

```bash
# Run smart contract tests
npx hardhat test

# Run tests with gas reporting
REPORT_GAS=true npx hardhat test

# Run tests with coverage
npx hardhat coverage

# Run backend tests
cd backend && npm test

# Run frontend checks
cd frontend && npm run lint
cd frontend && npm run build

# Run cross-browser and mobile E2E
cd frontend && npm run test:e2e
```

---

## Deployment

### Testnet (Fuji)

```bash
# Deploy contracts
npx hardhat run scripts/deploy.js --network fuji

# Verify on Snowtrace
npx hardhat verify --network fuji <CONTRACT_ADDRESS>

# Grant roles
npx hardhat run scripts/grantRole.js --network fuji <WALLET_ADDRESS>
```

### Production (C-Chain)

```bash
# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mainnet

# Verify
npx hardhat verify --network mainnet <CONTRACT_ADDRESS>
```

---

## Contributing

Contributions are welcome! **Please read our [Contributing Guide](/docs/CONTRIBUTING.md) and [Design System](/docs/brand/DESIGN_SYSTEM.md) before submitting PRs.**

### Quick Start for Contributors

1. Fork the repository
2. Read the [Design System](/docs/brand/DESIGN_SYSTEM.md) documentation
3. Create your feature branch (`git checkout -b feature/amazing-feature`)
4. Follow our code style and design guidelines
5. Commit your changes (`git commit -m 'feat(scope): description'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request with screenshots (for UI changes)

### Important Guidelines

- ✅ Follow the [Design System](/docs/brand/DESIGN_SYSTEM.md)
- ✅ Use conventional commit messages
- ✅ NO AI attribution in commits (no Co-Authored-By)
- ✅ Test on Chrome, Firefox, Safari
- ✅ Ensure accessibility (WCAG AAA)
- ✅ Check [Quick Reference](/docs/brand/QUICK_REFERENCE.md) for patterns

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Hackathon

Built during **Aleph Hackathon 2026** — Avalanche Track

---

## Contact

- **Website:** [aura.app](https://aura.app) (TBD)
- **GitHub:** [@yourusername/aura](https://github.com/yourusername/aura)
- **Issues:** [GitHub Issues](https://github.com/yourusername/aura/issues)

---

<p align="center">Made for a transparent supply chain</p>
