import { jest } from '@jest/globals';

// ── Mock ethers before importing ContractService ────────────────────────────
const mockWait = jest.fn();
const mockRegisterProduct = jest.fn();
const mockTransferCustody = jest.fn();
const mockVerifyProduct = jest.fn();
const mockGetProduct = jest.fn();
const mockGetCustodyHistory = jest.fn();
const mockCurrentCustodian = jest.fn();

const mockContractInstance = {
  registerProduct: mockRegisterProduct,
  transferCustody: mockTransferCustody,
  verifyProduct: mockVerifyProduct,
  getProduct: mockGetProduct,
  getCustodyHistory: mockGetCustodyHistory,
  currentCustodian: mockCurrentCustodian,
  connect: jest.fn().mockReturnThis()
};

const mockGetNetwork = jest.fn().mockResolvedValue({ chainId: 43113n, name: 'fuji' });
const mockProviderInstance = { getNetwork: mockGetNetwork };

jest.unstable_mockModule('ethers', () => ({
  ethers: {
    JsonRpcProvider: jest.fn(() => mockProviderInstance),
    Contract: jest.fn(() => mockContractInstance),
    Wallet: jest.fn(() => ({ connect: jest.fn() })),
    id: jest.fn((str) => `0x${str}`),
    toBigInt: jest.fn((val) => BigInt(val))
  }
}));

// Set env vars before dynamic import
process.env.CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';
process.env.AVALANCHE_RPC_URL = 'https://api.avax-test.network/ext/bc/C/rpc';
process.env.PRIVATE_KEY = '0x' + '1'.repeat(64);

const { contractService } = await import('../contract.js');

// ─────────────────────────────────────────────────────────────────────────────
describe('ContractService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetNetwork.mockResolvedValue({ chainId: 43113n });
  });

  // ── initialize ─────────────────────────────────────────────────────────────
  describe('initialize()', () => {
    it('should connect to the blockchain network', async () => {
      await contractService.initialize();
      expect(mockGetNetwork).toHaveBeenCalled();
    });

    it('should throw if AVALANCHE_RPC_URL is missing', async () => {
      const original = process.env.AVALANCHE_RPC_URL;
      delete process.env.AVALANCHE_RPC_URL;
      contractService.rpcUrl = undefined;

      await expect(contractService.initialize()).rejects.toThrow();
      process.env.AVALANCHE_RPC_URL = original;
      contractService.rpcUrl = original;
    });
  });

  // ── registerProduct ────────────────────────────────────────────────────────
  describe('registerProduct()', () => {
    it('should return productId, transactionHash, and blockNumber on success', async () => {
      const fakeTopics = ['0x...', '0x01'];
      const fakeReceipt = {
        logs: [{ topics: fakeTopics }],
        blockNumber: 100
      };
      mockRegisterProduct.mockResolvedValue({
        hash: '0xabc',
        wait: jest.fn().mockResolvedValue(fakeReceipt)
      });

      await contractService.initialize();
      const result = await contractService.registerProduct('LOT-001', 'Product', 'Bogotá', 'QmHash');

      expect(result).toHaveProperty('transactionHash', '0xabc');
      expect(result).toHaveProperty('blockNumber', 100);
    });

    it('should throw AppError on contract failure', async () => {
      mockRegisterProduct.mockRejectedValue(new Error('revert'));
      await contractService.initialize();

      await expect(
        contractService.registerProduct('LOT-001', 'Product', 'Bogotá', 'QmHash')
      ).rejects.toMatchObject({ code: 'REGISTRATION_FAILED' });
    });
  });

  // ── transferCustody ────────────────────────────────────────────────────────
  describe('transferCustody()', () => {
    it('should return transactionHash and blockNumber on success', async () => {
      const fakeReceipt = { blockNumber: 200 };
      mockTransferCustody.mockResolvedValue({
        hash: '0xdef',
        wait: jest.fn().mockResolvedValue(fakeReceipt)
      });

      await contractService.initialize();
      const result = await contractService.transferCustody(1, '0x' + 'a'.repeat(40), 'Medellín');

      expect(result).toHaveProperty('transactionHash', '0xdef');
      expect(result).toHaveProperty('blockNumber', 200);
    });

    it('should throw AppError on contract failure', async () => {
      mockTransferCustody.mockRejectedValue(new Error('fail'));
      await contractService.initialize();

      await expect(
        contractService.transferCustody(1, '0x' + 'a'.repeat(40), 'Location')
      ).rejects.toMatchObject({ code: 'TRANSFER_FAILED' });
    });

    it('should throw NOT_CUSTODIAN error when caller is not custodian', async () => {
      mockTransferCustody.mockRejectedValue(new Error('not current custodian'));
      await contractService.initialize();

      await expect(
        contractService.transferCustody(1, '0x' + 'a'.repeat(40), 'Location')
      ).rejects.toMatchObject({ code: 'NOT_CUSTODIAN' });
    });
  });

  // ── getProduct ─────────────────────────────────────────────────────────────
  describe('getProduct()', () => {
    it('should return normalized product data', async () => {
      mockGetProduct.mockResolvedValue({
        id: 1n,
        lotId: 'LOT-001',
        productName: 'Ibuprofeno',
        origin: 'Bogotá',
        ipfsHash: 'QmHash',
        manufacturer: '0x' + 'a'.repeat(40),
        createdAt: 1710432000n,
        verificationCount: 5n,
        active: true
      });

      await contractService.initialize();
      const product = await contractService.getProduct(1);

      expect(product.id).toBe(1);
      expect(product.lotId).toBe('LOT-001');
      expect(product.verificationCount).toBe(5);
      expect(product.active).toBe(true);
    });

    it('should throw GET_PRODUCT_FAILED on contract error', async () => {
      mockGetProduct.mockRejectedValue(new Error('revert'));
      await contractService.initialize();

      await expect(contractService.getProduct(1)).rejects.toMatchObject({
        code: 'GET_PRODUCT_FAILED'
      });
    });
  });

  // ── getCustodyHistory ──────────────────────────────────────────────────────
  describe('getCustodyHistory()', () => {
    it('should return array of custody records', async () => {
      mockGetCustodyHistory.mockResolvedValue([
        { custodian: '0x' + 'a'.repeat(40), timestamp: 1710432000n, locationNote: 'Bogotá' },
        { custodian: '0x' + 'b'.repeat(40), timestamp: 1710518400n, locationNote: 'Medellín' }
      ]);

      await contractService.initialize();
      const history = await contractService.getCustodyHistory(1);

      expect(history).toHaveLength(2);
      expect(history[0].locationNote).toBe('Bogotá');
      expect(history[1].timestamp).toBe(1710518400);
    });

    it('should throw GET_HISTORY_FAILED on error', async () => {
      mockGetCustodyHistory.mockRejectedValue(new Error('fail'));
      await contractService.initialize();

      await expect(contractService.getCustodyHistory(1)).rejects.toMatchObject({
        code: 'GET_HISTORY_FAILED'
      });
    });
  });

  // ── getCurrentCustodian ────────────────────────────────────────────────────
  describe('getCurrentCustodian()', () => {
    it('should return custodian address', async () => {
      const addr = '0x' + 'c'.repeat(40);
      mockCurrentCustodian.mockResolvedValue(addr);

      await contractService.initialize();
      const custodian = await contractService.getCurrentCustodian(1);

      expect(custodian).toBe(addr);
    });

    it('should throw GET_CUSTODIAN_FAILED on error', async () => {
      mockCurrentCustodian.mockRejectedValue(new Error('fail'));
      await contractService.initialize();

      await expect(contractService.getCurrentCustodian(1)).rejects.toMatchObject({
        code: 'GET_CUSTODIAN_FAILED'
      });
    });
  });

  // ── getProductWithHistory ──────────────────────────────────────────────────
  describe('getProductWithHistory()', () => {
    it('should return product, history, and currentCustodian', async () => {
      const addr = '0x' + 'd'.repeat(40);
      mockGetProduct.mockResolvedValue({
        id: 2n, lotId: 'LOT-002', productName: 'Aspirin', origin: 'Cali',
        ipfsHash: 'QmXYZ', manufacturer: addr,
        createdAt: 1710432000n, verificationCount: 0n, active: true
      });
      mockGetCustodyHistory.mockResolvedValue([
        { custodian: addr, timestamp: 1710432000n, locationNote: 'Cali' }
      ]);
      mockCurrentCustodian.mockResolvedValue(addr);

      await contractService.initialize();
      const data = await contractService.getProductWithHistory(2);

      expect(data.product.id).toBe(2);
      expect(data.history).toHaveLength(1);
      expect(data.currentCustodian).toBe(addr);
    });
  });
});
