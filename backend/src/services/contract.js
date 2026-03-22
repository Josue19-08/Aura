import { ethers } from 'ethers';
import { logger } from '../utils/logger.js';
import { AppError } from '../middleware/errorHandler.js';

// ProductRegistry ABI - limited to the calls exercised by the API layer.
const PRODUCT_REGISTRY_ABI = [
  // Read functions
  'function getProduct(uint256 productId) view returns (tuple(uint256 id, string lotId, string productName, string origin, string ipfsHash, address manufacturer, uint256 createdAt, uint256 verificationCount, bool active))',
  'function getCustodyHistory(uint256 productId) view returns (tuple(address custodian, uint256 timestamp, string locationNote)[])',
  'function currentCustodian(uint256 productId) view returns (address)',
  'function verifyProduct(uint256 productId) returns (bool exists, tuple(uint256 id, string lotId, string productName, string origin, string ipfsHash, address manufacturer, uint256 createdAt, uint256 verificationCount, bool active) product, tuple(address custodian, uint256 timestamp, string locationNote)[] history, address custodian)',
  // Write functions
  'function registerProduct(string lotId, string productName, string origin, string ipfsHash) returns (uint256)',
  'function transferCustody(uint256 productId, address newCustodian, string locationNote)',
  // Stats
  'function getTotalProducts() view returns (uint256)',
  // Events
  'event ProductRegistered(uint256 indexed productId, string lotId, address indexed manufacturer, uint256 timestamp)',
  'event CustodyTransferred(uint256 indexed productId, address indexed fromCustodian, address indexed toCustodian, string location, uint256 timestamp)',
  'event ProductVerified(uint256 indexed productId, address verifier, uint256 newCount, uint256 timestamp)'
];

// Verification counts above this threshold are treated as suspicious by the API.
const FRAUD_THRESHOLD = 100;

class ContractService {
  constructor() {
    this.provider = null;
    this.contract = null;
  }

  /**
   * Bootstraps a read-only contract instance and shared JSON-RPC provider.
   * The signer is created lazily for write operations so startup can still
   * succeed in read-mostly environments.
   */
  async initialize() {
    try {
      // Read env vars here (after dotenv.config() has run in server.js)
      this.contractAddress = process.env.CONTRACT_ADDRESS;
      this.rpcUrl = process.env.AVALANCHE_RPC_URL;
      this.privateKey = process.env.PRIVATE_KEY;

      if (!this.rpcUrl) {
        throw new Error('AVALANCHE_RPC_URL not configured');
      }

      if (!this.contractAddress) {
        logger.warn('CONTRACT_ADDRESS not configured - contract features will be unavailable');
        logger.warn('Complete Issue #2 (Deploy contracts) to enable blockchain features');
        return; // Skip contract initialization
      }

      // Create provider
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);

      // Test connection
      await this.provider.getNetwork();
      logger.info('Connected to blockchain network');

      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        PRODUCT_REGISTRY_ABI,
        this.provider
      );

      logger.info(`Contract initialized at ${this.contractAddress}`);
    } catch (error) {
      logger.error('Failed to initialize contract service', error);
      throw error;
    }
  }

  /**
   * Returns the wallet used for write operations against the contract.
   */
  getSigner() {
    if (!this.privateKey) {
      throw new AppError('PRIVATE_KEY not configured', 500, 'MISSING_PRIVATE_KEY');
    }

    return new ethers.Wallet(this.privateKey, this.provider);
  }

  /**
   * Registers a product on-chain and normalizes the emitted event into
   * a JSON-safe response shape for the REST API.
   */
  async registerProduct(lotId, productName, origin, ipfsHash) {
    try {
      const signer = this.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      logger.info(`Registering product: ${productName} (Lot: ${lotId})`);

      const tx = await contractWithSigner.registerProduct(
        lotId,
        productName,
        origin,
        ipfsHash
      );

      logger.info(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();

      // Extract product ID from event
      const event = receipt.logs.find(
        log => log.topics[0] === ethers.id('ProductRegistered(uint256,string,address,uint256)')
      );

      let productId;
      if (event) {
        productId = ethers.toBigInt(event.topics[1]);
      }

      logger.info(`Product registered with ID: ${productId}`);

      return {
        productId: productId ? Number(productId) : null,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('Failed to register product', error);
      throw new AppError(
        error.message || 'Failed to register product',
        400,
        'REGISTRATION_FAILED'
      );
    }
  }

  /**
   * Submits a custody transfer transaction from the configured backend signer.
   */
  async transferCustody(productId, newCustodian, locationNote) {
    try {
      const signer = this.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      logger.info(`Transferring custody of product ${productId} to ${newCustodian}`);

      const tx = await contractWithSigner.transferCustody(
        productId,
        newCustodian,
        locationNote
      );

      logger.info(`Transaction sent: ${tx.hash}`);
      const receipt = await tx.wait();

      logger.info(`Custody transferred successfully`);

      return {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      logger.error('Failed to transfer custody', error);

      // Handle specific errors
      if (error.message.includes('not current custodian')) {
        throw new AppError(
          'Only current custodian can transfer custody',
          403,
          'NOT_CUSTODIAN'
        );
      }

      throw new AppError(
        error.message || 'Failed to transfer custody',
        400,
        'TRANSFER_FAILED'
      );
    }
  }

  /**
   * Verifies a product through the state-changing contract method, then re-reads
   * the product snapshot so the API returns the incremented counter and latest
   * custody chain in a single response.
   */
  async verifyProduct(productId) {
    try {
      const signer = this.getSigner();
      const contractWithSigner = this.contract.connect(signer);

      logger.info(`Verifying product ${productId}`);

      const tx = await contractWithSigner.verifyProduct(productId);
      await tx.wait();

      const { product, history, currentCustodian } = await this.getProductWithHistory(productId);
      const verificationCount = product.verificationCount;
      const status = verificationCount > FRAUD_THRESHOLD ? 'suspicious' : 'authentic';

      return {
        transactionHash: tx.hash,
        product,
        custodyHistory: history,
        currentCustodian,
        verificationCount,
        status
      };
    } catch (error) {
      logger.error('Failed to verify product', error);
      throw new AppError(
        error.message || 'Failed to verify product',
        400,
        'VERIFICATION_FAILED'
      );
    }
  }

  /**
   * Reads a product tuple from the contract and converts bigint fields into
   * primitives the API can serialize directly.
   */
  async getProduct(productId) {
    try {
      const product = await this.contract.getProduct(productId);

      // Check if product exists
      if (!product.active && product.id === 0n) {
        throw new AppError(
          `Product with ID ${productId} not found`,
          404,
          'PRODUCT_NOT_FOUND'
        );
      }

      return {
        id: Number(product.id),
        lotId: product.lotId,
        productName: product.productName,
        origin: product.origin,
        ipfsHash: product.ipfsHash,
        manufacturer: product.manufacturer,
        createdAt: Number(product.createdAt),
        verificationCount: Number(product.verificationCount),
        active: product.active
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error('Failed to get product', error);
      throw new AppError(
        error.message || 'Failed to get product',
        400,
        'GET_PRODUCT_FAILED'
      );
    }
  }

  /**
   * Returns the full custody chain with bigint timestamps normalized to numbers.
   */
  async getCustodyHistory(productId) {
    try {
      const history = await this.contract.getCustodyHistory(productId);

      return history.map(record => ({
        custodian: record.custodian,
        timestamp: Number(record.timestamp),
        locationNote: record.locationNote
      }));
    } catch (error) {
      logger.error('Failed to get custody history', error);
      throw new AppError(
        error.message || 'Failed to get custody history',
        400,
        'GET_HISTORY_FAILED'
      );
    }
  }

  /**
   * Returns the current custodian address for a product.
   */
  async getCurrentCustodian(productId) {
    try {
      const custodian = await this.contract.currentCustodian(productId);
      return custodian;
    } catch (error) {
      logger.error('Failed to get current custodian', error);
      throw new AppError(
        error.message || 'Failed to get current custodian',
        400,
        'GET_CUSTODIAN_FAILED'
      );
    }
  }

  /**
   * Aggregates the product snapshot, custody history, and current custodian so
   * route handlers do not need to coordinate multiple service calls.
   */
  async getProductWithHistory(productId) {
    try {
      const [product, history, custodian] = await Promise.all([
        this.getProduct(productId),
        this.getCustodyHistory(productId),
        this.getCurrentCustodian(productId)
      ]);

      return {
        product,
        history,
        currentCustodian: custodian
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      logger.error('Failed to get product with history', error);
      throw new AppError(
        error.message || 'Failed to get product data',
        400,
        'GET_PRODUCT_DATA_FAILED'
      );
    }
  }
}

// Create singleton instance
const contractService = new ContractService();

export { contractService };
