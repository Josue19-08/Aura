# Development

## Getting Started

### Prerequisites
- Node.js v20+
- MetaMask or compatible wallet
- Avalanche Fuji testnet AVAX (from faucet)

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/aura.git
cd aura

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your values

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Fuji testnet
npx hardhat run scripts/deploy.js --network fuji

# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev
```

## Documentation

### [Roadmap](./roadmap.md)
2-day hackathon development plan.

### [Repository Structure](./repository-structure.md)
Project organization and file structure.

### [Setup Guide](./setup.md)
Detailed setup instructions for development environment.
