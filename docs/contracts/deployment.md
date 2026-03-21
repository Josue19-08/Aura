# Contract Deployment

## Networks

### Fuji Testnet
- **Chain ID:** 43113
- **RPC:** https://api.avax-test.network/ext/bc/C/rpc
- **Explorer:** https://testnet.snowtrace.io
- **Faucet:** https://faucet.avax.network

### C-Chain Mainnet
- **Chain ID:** 43114
- **RPC:** https://api.avax.network/ext/bc/C/rpc
- **Explorer:** https://snowtrace.io

---

## Deployment Process

### 1. Configure Environment

Edit `.env`:
```bash
AVALANCHE_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=your_private_key
SNOWTRACE_API_KEY=your_api_key
```

### 2. Compile Contracts

```bash
npx hardhat compile
```

### 3. Run Tests

```bash
npx hardhat test
```

### 4. Deploy to Fuji

```bash
npx hardhat run scripts/deploy.js --network fuji
```

**Expected Output:**
```
Deploying ProductRegistry...
ProductRegistry deployed to: 0x...
Deploying RoleManager...
RoleManager deployed to: 0x...
Deployment complete!
```

### 5. Verify on Snowtrace

```bash
npx hardhat verify --network fuji <CONTRACT_ADDRESS>
```

---

## Deployed Addresses

### Fuji Testnet

| Contract | Address | Verified |
|----------|---------|----------|
| ProductRegistry | TBD | ✅ / ⏳ |
| RoleManager | TBD | ✅ / ⏳ |

### C-Chain Mainnet

| Contract | Address | Verified |
|----------|---------|----------|
| ProductRegistry | TBD | ✅ / ⏳ |
| RoleManager | TBD | ✅ / ⏳ |

---

## Post-Deployment Steps

### 1. Grant Initial Roles

```bash
npx hardhat run scripts/grantRole.js --network fuji
```

### 2. Update Environment Files

**Backend (.env):**
```bash
CONTRACT_ADDRESS=0x...
```

**Frontend (.env):**
```bash
VITE_CONTRACT_ADDRESS=0x...
```

### 3. Test Integration

```bash
# Test registration
curl -X POST http://localhost:5000/api/products/register \
  -H "Content-Type: application/json" \
  -d '{...}'

# Test verification
curl http://localhost:5000/api/products/verify/1
```

---

## Deployment Checklist

- [ ] Contracts compile without errors
- [ ] All tests pass
- [ ] Environment variables configured
- [ ] Sufficient AVAX for deployment
- [ ] Deploy to testnet first
- [ ] Verify contracts on explorer
- [ ] Grant necessary roles
- [ ] Update backend/frontend configs
- [ ] Test end-to-end flow
- [ ] Document addresses
- [ ] (Production) Transfer admin to multi-sig

---

## Troubleshooting

### Deployment Fails
- Check AVAX balance
- Verify RPC URL is correct
- Ensure private key has no typos

### Verification Fails
- Ensure contract is deployed
- Check SNOWTRACE_API_KEY
- Verify constructor arguments match

### Role Grant Fails
- Ensure deployer has DEFAULT_ADMIN_ROLE
- Check target address is valid
- Verify sufficient gas
