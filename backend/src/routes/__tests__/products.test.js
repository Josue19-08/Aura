import { jest } from '@jest/globals';
import request from 'supertest';

// ── Mock contract and IPFS services before importing the app ─────────────────
const mockContractService = {
  initialize: jest.fn().mockResolvedValue(undefined),
  registerProduct: jest.fn(),
  transferCustody: jest.fn(),
  verifyProduct: jest.fn(),
  getProduct: jest.fn(),
  getCustodyHistory: jest.fn(),
  getCurrentCustodian: jest.fn(),
  getProductWithHistory: jest.fn(),
  provider: { getNetwork: jest.fn().mockResolvedValue({ chainId: 43113n }) }
};

const mockIpfsService = {
  uploadMetadata: jest.fn(),
  retrieveMetadata: jest.fn(),
  testConnection: jest.fn().mockResolvedValue(true)
};

jest.unstable_mockModule('../../services/contract.js', () => ({
  contractService: mockContractService
}));

jest.unstable_mockModule('../../services/ipfs.js', () => ({
  ipfsService: mockIpfsService
}));

// Set required env vars
process.env.CONTRACT_ADDRESS = '0x' + 'a'.repeat(40);
process.env.AVALANCHE_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';
process.env.PRIVATE_KEY = '0x' + '1'.repeat(64);
process.env.NODE_ENV = 'test';

const app = (await import('../../index.js')).default;

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE DATA
// ─────────────────────────────────────────────────────────────────────────────
const validProduct = {
  id: 1,
  lotId: 'LOT-001',
  productName: 'Ibuprofeno 400mg',
  origin: 'Bogotá',
  ipfsHash: 'QmTestHash',
  manufacturer: '0x' + 'a'.repeat(40),
  createdAt: 1710432000,
  verificationCount: 0,
  active: true
};

const validCustodyHistory = [
  { custodian: '0x' + 'a'.repeat(40), timestamp: 1710432000, locationNote: 'Bogotá' }
];

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /', () => {
  it('should return API info', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Aura API');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/health', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('status');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/products/register', () => {
  const validBody = {
    lotId: 'LOT-001',
    productName: 'Ibuprofeno 400mg',
    origin: 'Bogotá',
    metadata: { manufacturer: 'Pharma Corp' }
  };

  it('should register a product and return 201', async () => {
    mockIpfsService.uploadMetadata.mockResolvedValue('QmTestHash');
    mockContractService.registerProduct.mockResolvedValue({
      productId: 1,
      transactionHash: '0xabc',
      blockNumber: 100
    });

    const res = await request(app)
      .post('/api/products/register')
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.productId).toBe(1);
    expect(res.body.data.ipfsHash).toBe('QmTestHash');
  });

  it('should return 400 for missing lotId', async () => {
    const res = await request(app)
      .post('/api/products/register')
      .send({ ...validBody, lotId: '' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_LOT_ID');
  });

  it('should return 400 for missing productName', async () => {
    const res = await request(app)
      .post('/api/products/register')
      .send({ ...validBody, productName: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PRODUCT_NAME');
  });

  it('should return 400 for invalid lotId format', async () => {
    const res = await request(app)
      .post('/api/products/register')
      .send({ ...validBody, lotId: 'LOT @#$' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_LOT_ID');
  });

  it('should return 400 for invalid metadata type', async () => {
    const res = await request(app)
      .post('/api/products/register')
      .send({ ...validBody, metadata: 'not-an-object' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_METADATA');
  });

  it('should return 503 when IPFS upload fails', async () => {
    const ipfsError = new Error('IPFS connection failed');
    ipfsError.code = 'IPFS_UPLOAD_FAILED';
    ipfsError.statusCode = 503;
    mockIpfsService.uploadMetadata.mockRejectedValue(ipfsError);

    const res = await request(app)
      .post('/api/products/register')
      .send(validBody);

    expect(res.status).toBe(503);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/products/transfer', () => {
  const validTransfer = {
    productId: 1,
    newCustodian: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    locationNote: 'Warehouse A'
  };

  it('should transfer custody and return 200', async () => {
    mockContractService.transferCustody.mockResolvedValue({
      transactionHash: '0xdef',
      blockNumber: 200
    });

    const res = await request(app)
      .post('/api/products/transfer')
      .send(validTransfer);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transactionHash).toBe('0xdef');
  });

  it('should return 400 for invalid Ethereum address', async () => {
    const res = await request(app)
      .post('/api/products/transfer')
      .send({ ...validTransfer, newCustodian: 'not-an-address' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ADDRESS');
  });

  it('should return 400 for invalid productId', async () => {
    const res = await request(app)
      .post('/api/products/transfer')
      .send({ ...validTransfer, productId: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should return 400 for missing locationNote', async () => {
    const res = await request(app)
      .post('/api/products/transfer')
      .send({ ...validTransfer, locationNote: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_LOCATION_NOTE');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/products/:id/verify', () => {
  it('should verify product and return 200', async () => {
    mockContractService.verifyProduct.mockResolvedValue({
      transactionHash: '0xverify',
      product: validProduct
    });

    const res = await request(app).post('/api/products/1/verify');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transactionHash).toBe('0xverify');
  });

  it('should return 400 for invalid product ID (string)', async () => {
    const res = await request(app).post('/api/products/abc/verify');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_PRODUCT_ID');
  });

  it('should return 400 for product ID = 0', async () => {
    const res = await request(app).post('/api/products/0/verify');
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/products/:id', () => {
  it('should return product data with 200', async () => {
    mockContractService.getProduct.mockResolvedValue(validProduct);
    mockIpfsService.retrieveMetadata.mockResolvedValue({ manufacturer: 'Pharma Corp' });

    const res = await request(app).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.product.id).toBe(1);
    expect(res.body.data.metadata).toBeDefined();
  });

  it('should return product without metadata if IPFS fetch fails', async () => {
    mockContractService.getProduct.mockResolvedValue(validProduct);
    mockIpfsService.retrieveMetadata.mockRejectedValue(new Error('IPFS unavailable'));

    const res = await request(app).get('/api/products/1');

    expect(res.status).toBe(200);
    expect(res.body.data.metadata).toBeNull();
  });

  it('should return 400 for non-numeric product ID', async () => {
    const res = await request(app).get('/api/products/xyz');
    expect(res.status).toBe(400);
  });

  it('should propagate 404 when product not found on blockchain', async () => {
    const { AppError } = await import('../../middleware/errorHandler.js');
    mockContractService.getProduct.mockRejectedValue(
      new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND')
    );

    const res = await request(app).get('/api/products/9999');
    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/products/:id/history', () => {
  it('should return product with history and 200', async () => {
    mockContractService.getProductWithHistory.mockResolvedValue({
      product: validProduct,
      history: validCustodyHistory,
      currentCustodian: '0x' + 'a'.repeat(40)
    });
    mockIpfsService.retrieveMetadata.mockResolvedValue({ manufacturer: 'Pharma Corp' });

    const res = await request(app).get('/api/products/1/history');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.history).toHaveLength(1);
  });

  it('should return 400 for invalid product ID', async () => {
    const res = await request(app).get('/api/products/abc/history');
    expect(res.status).toBe(400);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('404 handler', () => {
  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
