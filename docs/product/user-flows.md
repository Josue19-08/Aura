# User Flows

## Flow 1: Manufacturer Registers New Product Batch

**Actor:** Manufacturer (has MANUFACTURER_ROLE)

**Preconditions:**
- Wallet connected
- Has MANUFACTURER_ROLE granted by admin
- Products manufactured and ready for distribution

**Steps:**

1. Navigate to `/register`
2. Fill registration form:
   - Product name: "Ibuprofeno 400mg"
   - Lot ID: "2026-03-001"
   - Manufacturing date: 2026-03-15
   - Origin: "Bogotá, Colombia"
   - Expiry date: 2028-03-15
   - Upload certificates (PDF)
   - Upload product images
3. Click "Upload Metadata"
   - System uploads files to IPFS
   - Receives IPFS hash: "QmX4f7..."
4. Review summary
5. Click "Register Product"
   - MetaMask prompts for signature
   - Approve transaction
6. Wait for confirmation (~2 seconds)
7. Success screen shows:
   - Product ID: #1
   - Transaction hash
   - "Generate QR Code" button
8. Click "Generate QR Code"
   - Download QR code as PNG
   - Print and affix to product packaging

**Post conditions:**
- Product registered on blockchain
- Metadata stored on IPFS
- QR code ready for physical labeling

---

## Flow 2: Distributor Receives and Transfers Custody

**Actor:** Distributor (has DISTRIBUTOR_ROLE)

**Preconditions:**
- Wallet connected
- Has received products physically
- Manufacturer has transferred custody on-chain (or is current custodian)

**Steps:**

1. Navigate to `/transfer`
2. Enter product ID or scan QR code
3. System displays:
   - Product name: "Ibuprofeno 400mg"
   - Current custodian: 0x742d35Cc... (you)
   - Current location: "Factory - Bogotá"
4. Click "Transfer Custody"
5. Fill transfer form:
   - New custodian address: 0x8ba1f109...
   - Location: "Warehouse - Medellín"
6. Click "Confirm Transfer"
   - MetaMask prompts for signature
   - Approve transaction
7. Wait for confirmation
8. Success screen shows:
   - Updated custody chain
   - New custodian confirmed
   - Transaction hash

**Post conditions:**
- Custody transferred on blockchain
- New record added to custody history
- Distributor can now verify product

---

## Flow 3: Consumer Verifies Product at Pharmacy

**Actor:** Consumer (no wallet or account needed)

**Preconditions:**
- Physical product in hand with QR code

**Steps:**

1. Open verification page on mobile: `aura.app/verify`
2. Click "Scan QR Code"
3. Grant camera permission
4. Point camera at product QR code
5. System extracts product ID: #1
6. Loading animation (< 1 second)
7. Verification result displays:

**Result: ✅ Authentic**

```
✅ AUTHENTIC PRODUCT

Ibuprofeno 400mg
Lot: 2026-03-001

Manufacturer
Laboratorio XYZ
Bogotá, Colombia
Manufactured: Mar 15, 2026

Custody History
1. Mar 15, 2026 — Factory, Bogotá
   Manufacturer: 0x742d...
2. Mar 21, 2026 — Warehouse, Medellín
   Distributor: 0x8ba1...
3. Mar 22, 2026 — Farmacia Central, Medellín
   Retailer: 0x5c3f...

Verified 12 times
Expires: Mar 15, 2028

[View Certificates]
```

8. Click "View Certificates"
   - Opens IPFS metadata
   - Shows quality certificates, test results

**Post conditions:**
- Verification count incremented
- Consumer has confidence in product authenticity

---

## Flow 4: Pharmacist Detects Suspicious Product

**Actor:** Pharmacist

**Preconditions:**
- Received product from unknown supplier
- Product has QR code that looks legitimate

**Steps:**

1. Scan QR code at pharmacy
2. System queries blockchain
3. Verification result displays:

**Result: ⚠️ SUSPICIOUS**

```
⚠️ SUSPICIOUS PRODUCT

Ibuprofeno 400mg
Lot: 2026-03-001

WARNING
This product has been verified 247 times, which is
unusually high for a pharmaceutical product.

Possible causes:
• QR code has been copied and distributed
• Product may be counterfeit with cloned identifier

RECOMMENDATION
Contact manufacturer before dispensing:
Laboratorio XYZ: contact@labxyz.com

Custody History
[... normal history shows ...]

Verified 247 times ⚠️
```

4. Pharmacist contacts manufacturer
5. Manufacturer investigates:
   - Checks if QR code was compromised
   - Verifies physical product against records
6. Decision:
   - **If authentic:** Continue with sale, update customers
   - **If counterfeit:** Report to authorities, remove from inventory

**Post conditions:**
- Potential counterfeit detected
- Consumer protected from fake product
- Manufacturer alerted to possible fraud

---

## Flow 5: Regulator Audits Supply Chain

**Actor:** Health regulator / inspector

**Preconditions:**
- Investigating pharmaceutical supply chain
- Needs to verify product origin and handling

**Steps:**

1. Request product ID from pharmacy
2. Navigate to `/verify/[productId]`
3. View complete custody chain:

```
Ibuprofeno 400mg - Lot: 2026-03-001

Manufacturer
Laboratorio XYZ
Certified: ISO 9001, GMP
Bogotá, Colombia

Complete Custody Chain

Mar 15, 2026, 10:00 AM
├─ Registered by: 0x742d35Cc...
├─ Location: Factory - Bogotá
└─ IPFS: QmX4f7... [View Certificates]

Mar 21, 2026, 10:30 AM
├─ Transferred to: 0x8ba1f109...
├─ Location: Central Warehouse - Medellín
└─ 6 days in manufacturer custody

Mar 22, 2026, 2:15 PM
├─ Transferred to: 0x5c3f9a2e...
├─ Location: Farmacia Central - Medellín
└─ 1.5 days in distributor custody

Current Status
├─ Current custodian: Farmacia Central
├─ Days in supply chain: 7
├─ Verification count: 12
└─ Status: Active ✅
```

4. Download certificates from IPFS:
   - Quality control certificate
   - GMP compliance certificate
   - Batch test results
5. Verify certificates are legitimate
6. Cross-reference with physical inspection
7. Complete audit report

**Post conditions:**
- Complete audit trail documented
- Compliance verified on immutable ledger
- Regulator has cryptographic proof of custody chain

---

## Edge Cases & Error Handling

### Product Not Found
**Scenario:** User scans QR code with invalid/unregistered ID

**Result:**
```
❌ PRODUCT NOT FOUND

This product ID is not registered in the Aura system.

Possible causes:
• Product is counterfeit
• QR code is damaged/incorrect
• Product has not been registered yet

RECOMMENDATION
Contact the seller and manufacturer to verify authenticity.
Do not use this product until verified.
```

### Wallet Not Connected (Registration)
**Scenario:** User tries to register without connecting wallet

**Result:**
- Registration form disabled
- Prominent "Connect Wallet" button
- Message: "Connect your wallet to register products"

### Insufficient Role Permissions
**Scenario:** User with no MANUFACTURER_ROLE tries to register

**Result:**
```
⚠️ PERMISSION DENIED

Your wallet does not have permission to register products.

If you are a manufacturer, please contact support to
request MANUFACTURER_ROLE for your address.

Your address: 0x...
```

### Transaction Failure
**Scenario:** Blockchain transaction fails (insufficient gas, network issue)

**Result:**
- Error message with transaction hash
- "Try Again" button
- Option to increase gas price
- Link to transaction on Snowtrace for debugging
