import { jest } from '@jest/globals';

// ── Mock global fetch before importing the service ───────────────────────────
global.fetch = jest.fn();

process.env.PINATA_JWT = 'test-jwt-token';
process.env.IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';

const { ipfsService } = await import('../ipfs.js');

// ─────────────────────────────────────────────────────────────────────────────
describe('IPFSService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── uploadMetadata ─────────────────────────────────────────────────────────
  describe('uploadMetadata()', () => {
    it('should return CID on successful upload', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ IpfsHash: 'QmTestCID123' })
      });

      const cid = await ipfsService.uploadMetadata({
        productName: 'Ibuprofeno',
        lotId: 'LOT-001',
        origin: 'Bogotá'
      });

      expect(cid).toBe('QmTestCID123');
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        expect.objectContaining({ method: 'POST' })
      );
    });

    it('should throw IPFS_UPLOAD_FAILED when Pinata returns error', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Unauthorized' })
      });

      await expect(
        ipfsService.uploadMetadata({ productName: 'Test', lotId: 'LOT-X', origin: 'Bogotá' })
      ).rejects.toMatchObject({ code: 'IPFS_UPLOAD_FAILED' });
    });

    it('should throw IPFS_UPLOAD_FAILED when fetch throws a network error', async () => {
      global.fetch.mockRejectedValue(new Error('network failure'));

      await expect(
        ipfsService.uploadMetadata({ productName: 'Test', lotId: 'LOT-X', origin: 'Bogotá' })
      ).rejects.toMatchObject({ code: 'IPFS_UPLOAD_FAILED' });
    });

    it('should enrich metadata with uploadedAt and version fields', async () => {
      let capturedBody;
      global.fetch.mockImplementation((_url, options) => {
        capturedBody = JSON.parse(options.body);
        return Promise.resolve({
          ok: true,
          json: async () => ({ IpfsHash: 'QmABC' })
        });
      });

      await ipfsService.uploadMetadata({ productName: 'Test', lotId: 'LOT-Y', origin: 'Cali' });

      expect(capturedBody.pinataContent).toHaveProperty('uploadedAt');
      expect(capturedBody.pinataContent).toHaveProperty('version', '1.0');
    });
  });

  // ── retrieveMetadata ───────────────────────────────────────────────────────
  describe('retrieveMetadata()', () => {
    it('should return parsed metadata for a valid CID', async () => {
      const fakeMetadata = { productName: 'Ibuprofeno', lotId: 'LOT-001' };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => fakeMetadata
      });

      const metadata = await ipfsService.retrieveMetadata('QmTestCID123');
      expect(metadata).toEqual(fakeMetadata);
    });

    it('should throw INVALID_CID for empty CID', async () => {
      await expect(ipfsService.retrieveMetadata('')).rejects.toMatchObject({
        code: 'INVALID_CID'
      });
    });

    it('should throw INVALID_CID for zero-hash CID', async () => {
      await expect(ipfsService.retrieveMetadata('0x0')).rejects.toMatchObject({
        code: 'INVALID_CID'
      });
    });

    it('should throw IPFS_RETRIEVAL_FAILED when gateway returns error', async () => {
      global.fetch.mockResolvedValue({ ok: false, statusText: 'Not Found' });

      await expect(ipfsService.retrieveMetadata('QmValidCID')).rejects.toMatchObject({
        code: 'IPFS_RETRIEVAL_FAILED'
      });
    });

    it('should throw IPFS_RETRIEVAL_FAILED when fetch throws', async () => {
      global.fetch.mockRejectedValue(new Error('network error'));

      await expect(ipfsService.retrieveMetadata('QmValidCID')).rejects.toMatchObject({
        code: 'IPFS_RETRIEVAL_FAILED'
      });
    });
  });

  // ── getPublicUrl ───────────────────────────────────────────────────────────
  describe('getPublicUrl()', () => {
    it('should return correct gateway URL', () => {
      const url = ipfsService.getPublicUrl('QmTestCID');
      expect(url).toBe('https://gateway.pinata.cloud/ipfs/QmTestCID');
    });
  });

  // ── testConnection ─────────────────────────────────────────────────────────
  describe('testConnection()', () => {
    it('should return true when Pinata responds with 200', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: 'Congratulations! You are communicating with the Pinata API!' })
      });

      const result = await ipfsService.testConnection();
      expect(result).toBe(true);
    });

    it('should throw when Pinata returns non-200', async () => {
      global.fetch.mockResolvedValue({ ok: false, statusText: 'Unauthorized' });
      await expect(ipfsService.testConnection()).rejects.toThrow();
    });
  });
});
