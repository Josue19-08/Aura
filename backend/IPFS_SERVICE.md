# IPFS Service Documentation

## Overview

The IPFS service handles decentralized metadata storage for product information using Pinata as the IPFS pinning provider. This ensures that product metadata is stored in a decentralized, immutable, and always-available manner.

## Configuration

### Environment Variables

Add these to your `.env` file:

```bash
# Option 1: Use JWT (Recommended)
PINATA_JWT=your_pinata_jwt_token

# Option 2: Use API Keys
PINATA_API_KEY=your_api_key
PINATA_SECRET_KEY=your_secret_key

# IPFS Gateway
IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs
```

### Getting Pinata Credentials

1. Sign up at [https://pinata.cloud](https://pinata.cloud)
2. Navigate to **API Keys** in the dashboard
3. Create a new API key with the following permissions:
   - `pinFileToIPFS`
   - `pinJSONToIPFS`
   - `unpin` (optional)
4. Copy the API Key, Secret Key, or JWT token
5. Add to your `.env` file

## Metadata Schema

The standard metadata structure for products:

```json
{
  "productName": "Ibuprofeno 400mg",
  "lotId": "LOT-2024-001",
  "manufacturer": "Pharma Corp",
  "origin": "Bogotá, Colombia",
  "manufactureDate": "2024-03-15T00:00:00Z",
  "expirationDate": "2027-03-15T00:00:00Z",
  "description": "Pain reliever and fever reducer",
  "images": [
    "https://gateway.pinata.cloud/ipfs/QmXxx..."
  ],
  "certificates": [
    {
      "type": "FDA_APPROVAL",
      "url": "https://gateway.pinata.cloud/ipfs/QmYyy...",
      "issuedDate": "2024-01-10"
    }
  ],
  "batchSize": 10000,
  "storageConditions": "Store below 25°C",
  "ingredients": ["Ibuprofen", "Cellulose", "Starch"],
  "version": "1.0",
  "uploadedAt": "2024-03-15T10:30:00Z"
}
```

## API Usage

### Register Product with Metadata

```bash
POST /api/products/register
Content-Type: application/json

{
  "lotId": "LOT-2024-001",
  "productName": "Ibuprofeno 400mg",
  "origin": "Bogotá, Colombia",
  "metadata": {
    "manufacturer": "Pharma Corp",
    "manufactureDate": "2024-03-15T00:00:00Z",
    "expirationDate": "2027-03-15T00:00:00Z",
    "description": "Pain reliever and fever reducer",
    "batchSize": 10000,
    "storageConditions": "Store below 25°C"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "productId": 1,
    "transactionHash": "0xabc123...",
    "blockNumber": 12345,
    "ipfsHash": "QmXxx...",
    "message": "Product registered successfully"
  }
}
```

### Get Product with Metadata

```bash
GET /api/products/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "product": {
      "id": 1,
      "lotId": "LOT-2024-001",
      "productName": "Ibuprofeno 400mg",
      "origin": "Bogotá, Colombia",
      "ipfsHash": "QmXxx...",
      "manufacturer": "0xabc123...",
      "createdAt": 1710504000,
      "verificationCount": 5,
      "active": true
    },
    "metadata": {
      "productName": "Ibuprofeno 400mg",
      "lotId": "LOT-2024-001",
      "manufacturer": "Pharma Corp",
      "origin": "Bogotá, Colombia",
      "manufactureDate": "2024-03-15T00:00:00Z",
      "expirationDate": "2027-03-15T00:00:00Z",
      "description": "Pain reliever and fever reducer",
      "batchSize": 10000,
      "storageConditions": "Store below 25°C",
      "version": "1.0",
      "uploadedAt": "2024-03-15T10:30:00Z"
    }
  }
}
```

## Service Methods

### `uploadMetadata(metadata)`

Uploads JSON metadata to IPFS via Pinata.

**Parameters:**
- `metadata` (Object): Product metadata object

**Returns:**
- `string`: IPFS CID (Content Identifier)

**Example:**
```javascript
import { ipfsService } from './services/ipfs.js';

const metadata = {
  productName: 'Ibuprofeno 400mg',
  lotId: 'LOT-2024-001',
  manufacturer: 'Pharma Corp'
};

const cid = await ipfsService.uploadMetadata(metadata);
console.log('IPFS CID:', cid); // QmXxx...
```

### `retrieveMetadata(cid)`

Retrieves metadata from IPFS by CID.

**Parameters:**
- `cid` (string): IPFS Content Identifier

**Returns:**
- `Object`: Parsed metadata object

**Example:**
```javascript
const metadata = await ipfsService.retrieveMetadata('QmXxx...');
console.log(metadata.productName); // Ibuprofeno 400mg
```

### `getPublicUrl(cid)`

Gets publicly accessible URL for IPFS content.

**Parameters:**
- `cid` (string): IPFS Content Identifier

**Returns:**
- `string`: Public URL

**Example:**
```javascript
const url = ipfsService.getPublicUrl('QmXxx...');
console.log(url); // https://gateway.pinata.cloud/ipfs/QmXxx...
```

### `testConnection()`

Tests connectivity to Pinata API.

**Returns:**
- `boolean`: True if connection successful

**Example:**
```javascript
const isConnected = await ipfsService.testConnection();
console.log('IPFS connected:', isConnected);
```

## Error Handling

The service throws `AppError` instances for all errors:

```javascript
try {
  const cid = await ipfsService.uploadMetadata(metadata);
} catch (error) {
  if (error.code === 'IPFS_UPLOAD_FAILED') {
    console.error('Failed to upload to IPFS:', error.message);
  }
}
```

Common error codes:
- `IPFS_UPLOAD_FAILED`: Failed to upload metadata to IPFS
- `IPFS_RETRIEVAL_FAILED`: Failed to retrieve metadata from IPFS
- `INVALID_CID`: Invalid or empty IPFS hash

## Health Check

Check IPFS service status:

```bash
GET /api/health
```

Response includes `ipfsReady` field:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "ipfsReady": true,
    "contractReady": true,
    ...
  }
}
```

## IPFS Gateways

Default gateway: `https://gateway.pinata.cloud/ipfs`

Alternative gateways:
- `https://ipfs.io/ipfs` (public)
- `https://cloudflare-ipfs.com/ipfs` (fast)
- `https://dweb.link/ipfs` (decentralized)

You can change the gateway in `.env`:
```bash
IPFS_GATEWAY=https://ipfs.io/ipfs
```

## Best Practices

1. **Always validate metadata** before uploading to IPFS
2. **Store only public information** on IPFS (data is publicly accessible)
3. **Keep metadata consistent** with the schema
4. **Use descriptive pinning names** for easier management in Pinata dashboard
5. **Monitor Pinata quotas** to avoid service interruptions
6. **Use multiple gateways** for redundancy

## Troubleshooting

### "Pinata credentials not configured"
- Ensure `PINATA_JWT` or both `PINATA_API_KEY` and `PINATA_SECRET_KEY` are set in `.env`
- Restart the server after adding environment variables

### "Failed to upload metadata to IPFS"
- Check Pinata API status at [https://status.pinata.cloud](https://status.pinata.cloud)
- Verify API key permissions
- Check Pinata account quota limits

### "Failed to retrieve metadata from IPFS"
- Verify the CID is valid and properly formatted
- Try alternative IPFS gateways
- Check if content is pinned in Pinata dashboard

### "Invalid IPFS hash"
- Ensure the hash starts with 'Qm' (v0) or 'baf' (v1)
- Verify the hash wasn't corrupted during storage

## References

- [Pinata Documentation](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Pinata API Reference](https://docs.pinata.cloud/api-reference)
