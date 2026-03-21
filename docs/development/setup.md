# Setup Guide

## Prerequisites

### Required Software
- **Node.js** v20+ ([Download](https://nodejs.org/))
- **npm** v10+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Recommended
- **VS Code** with extensions:
  - Solidity (Juan Blanco)
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense

### Blockchain Prerequisites
- **MetaMask** browser extension
- **Avalanche Fuji testnet AVAX** from [faucet](https://faucet.avax.network/)

---

## Initial Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/aura.git
cd aura
```

### 2. Install Dependencies

```bash
# Root dependencies (Hardhat)
npm install

# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

#### Smart Contracts (.env in root)

```bash
cp .env.example .env
```

Edit `.env`:
```bash
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key_here  # From MetaMask
SNOWTRACE_API_KEY=your_snowtrace_api_key  # From snowtrace.io
```

⚠️ **Security:** Never commit `.env` to Git. It's in `.gitignore`.

#### Backend (.env in backend/)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```bash
PORT=5000
NODE_ENV=development
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
CONTRACT_ADDRESS=  # Will be filled after deployment
PRIVATE_KEY=your_private_key_here
IPFS_API_TOKEN=your_web3_storage_token  # From web3.storage
```

#### Frontend (.env in frontend/)

```bash
cd frontend
cp .env.example .env
```

Edit `frontend/.env`:
```bash
VITE_API_URL=http://localhost:5000
VITE_CONTRACT_ADDRESS=  # Will be filled after deployment
VITE_CHAIN_ID=43113  # Fuji testnet
```

---

## Smart Contract Setup

### 1. Compile Contracts

```bash
npx hardhat compile
```

Expected output:
```
Compiled 2 Solidity files successfully
```

### 2. Run Tests

```bash
npx hardhat test
```

All tests should pass ✅

### 3. Deploy to Fuji Testnet

```bash
npx hardhat run scripts/deploy.js --network fuji
```

Expected output:
```
Deploying ProductRegistry...
ProductRegistry deployed to: 0x...
Deploying RoleManager...
RoleManager deployed to: 0x...
```

**Save these addresses!** You'll need them for backend and frontend.

### 4. Verify Contracts (Optional)

```bash
npx hardhat verify --network fuji <CONTRACT_ADDRESS>
```

---

## Backend Setup

### 1. Update Contract Address

Edit `backend/.env` and add the deployed contract address:
```bash
CONTRACT_ADDRESS=0x...  # From deployment step
```

### 2. Get IPFS API Token

**Option A: web3.storage (Free)**
1. Go to [web3.storage](https://web3.storage/)
2. Sign up with email or GitHub
3. Create API token
4. Add to `backend/.env` as `IPFS_API_TOKEN`

**Option B: Pinata**
1. Go to [pinata.cloud](https://www.pinata.cloud/)
2. Sign up for free account
3. Generate API key
4. Add to `backend/.env`

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
Server listening on port 5000
Connected to Avalanche Fuji
```

### 4. Test API

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "blockchain": "connected",
  "ipfs": "connected"
}
```

---

## Frontend Setup

### 1. Update Contract Address

Edit `frontend/.env` and add the deployed contract address:
```bash
VITE_CONTRACT_ADDRESS=0x...  # From deployment step
```

### 2. Start Development Server

```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 3. Open in Browser

Navigate to `http://localhost:3000`

---

## MetaMask Configuration

### 1. Add Fuji Testnet

**Option A: Automatic (visit chainlist.org)**
1. Go to [chainlist.org](https://chainlist.org/)
2. Search "Avalanche Fuji"
3. Click "Add to MetaMask"

**Option B: Manual**
1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter details:
   - **Network Name:** Avalanche Fuji C-Chain
   - **RPC URL:** https://api.avax-test.network/ext/bc/C/rpc
   - **Chain ID:** 43113
   - **Currency Symbol:** AVAX
   - **Block Explorer:** https://testnet.snowtrace.io/

### 2. Get Test AVAX

1. Go to [Avalanche Faucet](https://faucet.avax.network/)
2. Select "Fuji (C-Chain)"
3. Enter your wallet address
4. Complete CAPTCHA
5. Wait ~30 seconds
6. Check MetaMask balance

---

## Grant Roles (First Time Setup)

After deploying contracts, you need to grant roles to your wallet.

### Option 1: Hardhat Console

```bash
npx hardhat console --network fuji
```

```javascript
const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
const registry = await ProductRegistry.attach("YOUR_CONTRACT_ADDRESS");

// Grant MANUFACTURER_ROLE to your address
const MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
await registry.grantRole(MANUFACTURER_ROLE, "YOUR_WALLET_ADDRESS");
```

### Option 2: Script

Create `scripts/grantRole.js`:

```javascript
async function main() {
  const [deployer] = await ethers.getSigners();
  const registry = await ethers.getContractAt("ProductRegistry", process.env.CONTRACT_ADDRESS);

  const MANUFACTURER_ROLE = await registry.MANUFACTURER_ROLE();
  await registry.grantRole(MANUFACTURER_ROLE, deployer.address);

  console.log("MANUFACTURER_ROLE granted to:", deployer.address);
}

main();
```

Run:
```bash
npx hardhat run scripts/grantRole.js --network fuji
```

---

## Verification Checklist

✅ **Smart Contracts**
- [ ] Contracts compile without errors
- [ ] All tests pass
- [ ] Deployed to Fuji testnet
- [ ] Addresses saved and verified on Snowtrace

✅ **Backend**
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Contract address set
- [ ] IPFS token configured
- [ ] Server starts without errors
- [ ] Health check endpoint responds

✅ **Frontend**
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] Contract address set
- [ ] Development server runs
- [ ] Can connect wallet
- [ ] Can interact with deployed contract

✅ **MetaMask**
- [ ] Fuji testnet added
- [ ] Test AVAX balance > 0
- [ ] Wallet can sign transactions

---

## Common Issues & Solutions

### Issue: `Error: insufficient funds`
**Solution:** Get test AVAX from faucet or check you're on Fuji network

### Issue: `Error: could not detect network`
**Solution:** Check AVALANCHE_RPC_URL in .env is correct

### Issue: `Module not found`
**Solution:** Run `npm install` in the specific directory (root/backend/frontend)

### Issue: IPFS upload fails
**Solution:** Verify IPFS_API_TOKEN is correct and account is active

### Issue: Contract call reverts
**Solution:** Check you have the required role (MANUFACTURER_ROLE, etc.)

### Issue: Frontend can't connect to backend
**Solution:** Ensure backend is running on port 5000 and VITE_API_URL is correct

---

## Next Steps

Once setup is complete:

1. **Test Product Registration**
   - Connect wallet on `/register`
   - Fill form with test data
   - Submit transaction
   - Check transaction on Snowtrace

2. **Test Verification**
   - Go to `/verify`
   - Enter product ID from registration
   - Verify result displays correctly

3. **Test Custody Transfer**
   - Go to `/transfer`
   - Select product
   - Enter recipient address
   - Confirm transfer

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Contract changes
npx hardhat test
npx hardhat run scripts/deploy.js --network fuji
```

### Making Contract Changes

1. Edit contract in `contracts/`
2. Run tests: `npx hardhat test`
3. If tests pass, deploy: `npx hardhat run scripts/deploy.js --network fuji`
4. Update contract addresses in backend/.env and frontend/.env
5. Restart backend and frontend servers

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add feature X"

# Push to remote
git push origin feature/your-feature-name
```
