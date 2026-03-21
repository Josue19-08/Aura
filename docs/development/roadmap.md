# Development Roadmap

## 2-Day Hackathon Schedule

### DAY 1 — Foundation (0-16h)

#### Block 1 (0-4h) — Smart Contracts
- [ ] Initialize Hardhat project
- [ ] Write ProductRegistry.sol
- [ ] Write RoleManager.sol
- [ ] Write unit tests
- [ ] Deploy to Fuji testnet
- [ ] Verify contracts on Snowtrace

**Deliverables:**
- Contracts compiled and tested
- Deployment addresses recorded
- Contract verified and readable on explorer

---

#### Block 2 (4-8h) — Backend API
- [ ] Initialize Express project
- [ ] Create contract service (ethers.js integration)
- [ ] Create IPFS service (web3.storage/Pinata)
- [ ] Implement endpoints:
  - POST /api/products/register
  - POST /api/products/transfer
  - GET /api/products/verify/:id
  - GET /api/products/:id/history
- [ ] Add error handling and validation
- [ ] Deploy to Railway

**Deliverables:**
- REST API functional and deployed
- All CRUD operations working
- API documentation (README or Postman collection)

---

#### Block 3 (8-14h) — Frontend Base
- [ ] Initialize React + Vite project
- [ ] Set up TailwindCSS with custom theme
- [ ] Integrate RainbowKit for wallet connection
- [ ] Build pages:
  - `/verify` — Public verification page
  - `/register` — Product registration (manufacturers)
- [ ] Create verification result component
- [ ] Connect to backend API
- [ ] Test end-to-end flow

**Deliverables:**
- Frontend deployed to Vercel
- Basic user flows working
- Responsive for mobile (verification page)

---

#### Block 4 (14-16h) — Buffer & Testing
- [ ] Fix critical bugs
- [ ] End-to-end smoke test
- [ ] Performance check
- [ ] Mobile testing

**Deliverables:**
- Stable MVP ready for Day 2 enhancements

---

### DAY 2 — Polish & Demo (16-36h)

#### Block 5 (16-22h) — Additional Features
- [ ] Build `/transfer` page (custody transfers)
- [ ] Add custody timeline visualization
- [ ] Implement verification counter alerts
- [ ] Create QR code generation
- [ ] Add IPFS metadata display
- [ ] Integrate Claude API for product descriptions (optional)

**Deliverables:**
- Complete feature set for demo
- All user roles can perform their tasks
- Anti-counterfeiting mechanisms active

---

#### Block 6 (22-28h) — UI/UX & Branding
- [ ] Apply brand colors and typography
- [ ] Add logo to header
- [ ] Create verification animations (Framer Motion)
- [ ] Improve mobile responsiveness
- [ ] Add loading states
- [ ] Polish error messages
- [ ] Create landing page (optional)

**Deliverables:**
- Visually polished interface
- Consistent branding throughout
- Smooth user experience

---

#### Block 7 (28-34h) — Demo Preparation
- [ ] Deploy to Avalanche C-Chain mainnet (or confirm Fuji)
- [ ] Register 3-4 demo products with complete histories
- [ ] Create demo scenario:
  1. Manufacturer registers "Ibuprofeno 400mg"
  2. Transfers to distributor
  3. Transfers to pharmacy
  4. Consumer verifies (authentic)
  5. Show suspicious product alert
- [ ] Record demo video (2 minutes)
- [ ] Write final README
- [ ] Create pitch slides
- [ ] Submit to DoraHacks

**Deliverables:**
- Demo-ready application
- Video walkthrough
- Pitch presentation
- Submission complete

---

#### Block 8 (34-36h) — Buffer
- [ ] Final bug fixes
- [ ] Prepare 3-minute pitch
- [ ] Practice demo
- [ ] Rest before presentation

---

## Development Phases

### Phase 1: Core Infrastructure ✅
- Smart contracts deployed
- Backend API functional
- Frontend connected

### Phase 2: User Features ✅
- Registration working
- Transfers working
- Verification working

### Phase 3: Anti-Counterfeiting 🔄
- Verification counter
- Anomaly detection
- Alerts system

### Phase 4: Polish & Demo 🔄
- UI/UX refined
- Branding applied
- Demo prepared

---

## Success Criteria

### Must Have (MVP)
- ✅ Product registration on blockchain
- ✅ Custody transfer tracking
- ✅ Public verification (no wallet)
- ✅ Basic fraud detection (counter)
- ✅ IPFS metadata storage
- ✅ Mobile-friendly verification

### Nice to Have
- ⭕ Batch registration
- ⭕ Advanced analytics dashboard
- ⭕ Email/SMS alerts for transfers
- ⭕ Multi-language support
- ⭕ QR code scanner in-app

### Post-Hackathon
- 🔮 The Graph integration for indexing
- 🔮 Mobile app (React Native)
- 🔮 Enterprise dashboard
- 🔮 API rate limiting & authentication
- 🔮 Multi-sig for admin operations

---

## Risk Mitigation

### Time Risks
- **Risk:** Features take longer than expected
- **Mitigation:** Prioritize core flow (register → transfer → verify), cut nice-to-haves

### Technical Risks
- **Risk:** Avalanche RPC issues
- **Mitigation:** Use Alchemy/Infura backup RPC, test early
- **Risk:** IPFS upload failures
- **Mitigation:** Implement retries, have local backup

### Deployment Risks
- **Risk:** Contracts have bugs in production
- **Mitigation:** Thorough testing, use testnet for demo if needed
- **Risk:** Frontend/backend deployment issues
- **Mitigation:** Deploy early, test often

---

## Daily Standups

### Day 1 Morning
- Review roadmap
- Assign initial tasks
- Set up development environment

### Day 1 Evening
- Demo progress to team
- Identify blockers
- Adjust schedule if needed

### Day 2 Morning
- Review Day 1 deliverables
- Plan Day 2 priorities
- Start UI polish

### Day 2 Evening
- Final testing
- Prepare demo
- Submit project
