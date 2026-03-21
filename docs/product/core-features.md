# Core Features

## For Manufacturers (MANUFACTURER_ROLE)

### Product Registration
**Purpose:** Create permanent on-chain record of new products

**Features:**
- Register product batches with lot ID, name, origin
- Upload metadata to IPFS (certificates, test results, images)
- Generate unique product identifiers
- Create QR codes for physical labeling

**Data Captured:**
- Product name and description
- Lot/batch number
- Manufacturing date and location
- Expiry date (if applicable)
- Manufacturer wallet address (immutable)
- IPFS hash linking to extended metadata

**Workflow:**
1. Connect wallet (must have MANUFACTURER_ROLE)
2. Fill registration form
3. Upload supporting documents
4. System uploads to IPFS, generates hash
5. Submit transaction to blockchain
6. Receive unique product ID
7. Generate QR code for labeling

---

## For Distributors/Intermediaries (DISTRIBUTOR_ROLE)

### Custody Transfer
**Purpose:** Record product movement through supply chain

**Features:**
- Receive custody of products from upstream
- Record transfer timestamp and location
- Transfer custody to downstream partners
- View complete custody history

**Data Captured:**
- Previous custodian address
- New custodian address
- Transfer timestamp (block.timestamp)
- Location note (city, warehouse, facility)

**Workflow:**
1. Connect wallet (must be current custodian)
2. Select product to transfer
3. Enter recipient wallet address
4. Add location note
5. Submit transaction
6. Custody updates on-chain

### Inventory Management
**Purpose:** Track products under custody

**Features:**
- View all products currently in custody
- Filter by lot, date, origin
- Export custody records
- Bulk transfer operations (future)

---

## For Verifiers (Public - No Role Required)

### Product Verification
**Purpose:** Confirm product authenticity and view history

**Features:**
- Scan QR code or enter product ID
- Instant verification result
- Complete custody timeline
- Fraud alerts (if detected)
- No wallet or account required

**Verification States:**

**✅ Authentic**
- Product exists in registry
- Normal verification count
- Complete custody chain
- All metadata accessible

**⚠️ Suspicious**
- Product exists BUT anomalies detected
- Verification count unusually high (possible copied QR)
- Missing custody records
- Unusual transfer patterns

**❌ Not Found**
- Product ID not in registry
- Likely counterfeit or incorrect ID
- Recommend contacting manufacturer

**Information Displayed:**
- Product name and lot ID
- Manufacturer information
- Manufacturing date and origin
- Complete custody chain with timestamps
- Current custodian
- Total verification count
- Metadata from IPFS (certificates, images)

**Workflow:**
1. User scans QR code on product
2. App extracts product ID
3. Query blockchain + IPFS
4. Display verification result
5. Show custody timeline
6. Alert if suspicious

---

## Anti-Counterfeiting Mechanisms

### Verification Counter
**How it works:**
- Each verification increments on-chain counter
- Normal products: verified 0-50 times over lifetime
- Suspicious: verified hundreds/thousands of times

**Detection Logic:**
```
if (verificationCount > 100) {
  alert: "Unusually high verification count"
  reason: "QR code may have been copied and distributed"
}
```

### Unique Identifier Generation
**How it works:**
- Each product ID is cryptographically unique
- Generated from: lot ID + unit number + timestamp + manufacturer address
- Cannot be predicted or replicated without manufacturer's private key

### Custody Chain Validation
**How it works:**
- Each transfer requires signature from current custodian
- Cannot skip steps in the chain
- Timestamps provide chronological proof
- Any gap or inconsistency flagged

### IPFS Content Addressing
**How it works:**
- Metadata hash stored on-chain
- If content changes, hash changes
- Immutable link between on-chain record and documents
- Tampering immediately detectable

---

## Dashboard Features (Manufacturer/Distributor)

### Analytics
- Total products registered
- Products currently in custody
- Recent transfers
- Verification trends

### Search & Filter
- Search by product ID, lot ID, or name
- Filter by date range
- Filter by current custodian
- Filter by verification count (find suspicious products)

### Export
- Export product data as CSV
- Generate compliance reports
- Download QR codes in batch

---

## Admin Features (ADMIN_ROLE)

### Role Management
**Purpose:** Grant/revoke access to manufacturers and distributors

**Features:**
- Grant MANUFACTURER_ROLE to verified companies
- Grant DISTRIBUTOR_ROLE to logistics partners
- Revoke roles if compliance violated
- View all role holders

**Security:**
- Only contract owner (deployer) has ADMIN_ROLE initially
- Multi-sig recommended for production

### Emergency Controls
**Purpose:** Pause system if critical bug discovered

**Features:**
- Pause all registration and transfers
- Verification remains available (read-only)
- Resume after issue resolved

**Important:** 
- Cannot alter existing records, only pause new ones
- Immutability preserved even in emergency
