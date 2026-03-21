import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * IPFS Service for decentralized metadata storage using Pinata
 *
 * Handles uploading and retrieving product metadata to/from IPFS.
 * Uses Pinata API for reliable pinning and availability.
 */
class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretKey = process.env.PINATA_SECRET_KEY;
    this.pinataJwt = process.env.PINATA_JWT;
    this.ipfsGateway = process.env.IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs';
  }

  /**
   * Validate IPFS service configuration
   * @throws {Error} If API keys are not configured
   */
  validateConfig() {
    if (!this.pinataJwt && (!this.pinataApiKey || !this.pinataSecretKey)) {
      throw new Error('Pinata credentials not configured. Set PINATA_JWT or PINATA_API_KEY/PINATA_SECRET_KEY');
    }
  }

  /**
   * Get authorization headers for Pinata API
   * @returns {Object} Headers object with authorization
   */
  getAuthHeaders() {
    if (this.pinataJwt) {
      return {
        'Authorization': `Bearer ${this.pinataJwt}`,
        'Content-Type': 'application/json'
      };
    }
    return {
      'pinata_api_key': this.pinataApiKey,
      'pinata_secret_api_key': this.pinataSecretKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Upload JSON metadata to IPFS
   * @param {Object} metadata - Product metadata object
   * @param {string} metadata.productName - Name of the product
   * @param {string} metadata.lotId - Lot identifier
   * @param {string} metadata.manufacturer - Manufacturer name
   * @param {string} metadata.origin - Origin location
   * @returns {Promise<string>} IPFS CID (Content Identifier)
   */
  async uploadMetadata(metadata) {
    try {
      this.validateConfig();

      // Add timestamp and version to metadata
      const enrichedMetadata = {
        ...metadata,
        uploadedAt: new Date().toISOString(),
        version: '1.0'
      };

      logger.info('Uploading metadata to IPFS', { productName: metadata.productName });

      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          pinataContent: enrichedMetadata,
          pinataMetadata: {
            name: `${metadata.productName}-${metadata.lotId}`,
            keyvalues: {
              lotId: metadata.lotId,
              productName: metadata.productName
            }
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      const cid = data.IpfsHash;

      logger.info('Metadata uploaded to IPFS', { cid, productName: metadata.productName });

      return cid;
    } catch (error) {
      logger.error('Failed to upload metadata to IPFS', error);
      throw new AppError(
        error.message || 'Failed to upload metadata to IPFS',
        500,
        'IPFS_UPLOAD_FAILED'
      );
    }
  }

  /**
   * Retrieve metadata from IPFS by CID
   * @param {string} cid - IPFS Content Identifier
   * @returns {Promise<Object>} Parsed metadata object
   */
  async retrieveMetadata(cid) {
    try {
      if (!cid || cid === '' || cid === '0x0' || cid === '0x0000000000000000000000000000000000000000000000000000000000000000') {
        throw new AppError('Invalid or empty IPFS hash', 400, 'INVALID_CID');
      }

      logger.info('Retrieving metadata from IPFS', { cid });

      const url = `${this.ipfsGateway}/${cid}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch from IPFS gateway: ${response.statusText}`);
      }

      const metadata = await response.json();

      logger.info('Metadata retrieved from IPFS', { cid });

      return metadata;
    } catch (error) {
      logger.error('Failed to retrieve metadata from IPFS', { cid, error: error.message });
      throw new AppError(
        error.message || 'Failed to retrieve metadata from IPFS',
        error.status || 500,
        error.code || 'IPFS_RETRIEVAL_FAILED'
      );
    }
  }

  /**
   * Get publicly accessible URL for IPFS content
   * @param {string} cid - IPFS Content Identifier
   * @returns {string} Public URL
   */
  getPublicUrl(cid) {
    return `${this.ipfsGateway}/${cid}`;
  }

  /**
   * Test IPFS service connectivity
   * @returns {Promise<boolean>} True if service is accessible
   */
  async testConnection() {
    try {
      this.validateConfig();

      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate with Pinata');
      }

      const data = await response.json();
      logger.info('IPFS service connection test successful', data);

      return true;
    } catch (error) {
      logger.error('IPFS service connection test failed', error);
      throw error;
    }
  }
}

// Create singleton instance
const ipfsService = new IPFSService();

export { ipfsService };
