import express from 'express';
import { contractService } from '../services/contract.js';
import { ipfsService } from '../services/ipfs.js';
import {
  validateProductRegistration,
  validateCustodyTransfer,
  validateProductId
} from '../middleware/validator.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Register new product
router.post('/register', validateProductRegistration, async (req, res, next) => {
  try {
    const { lotId, productName, origin, metadata } = req.body;

    logger.info(`Registering product: ${productName}`);

    // Upload metadata to IPFS first
    const metadataObject = metadata || {
      productName,
      lotId,
      origin,
      manufactureDate: new Date().toISOString()
    };

    const ipfsHash = await ipfsService.uploadMetadata(metadataObject);
    logger.info(`Metadata uploaded to IPFS: ${ipfsHash}`);

    // Register product on blockchain with IPFS hash
    const result = await contractService.registerProduct(
      lotId,
      productName,
      origin,
      ipfsHash
    );

    res.status(201).json({
      success: true,
      data: {
        productId: result.productId,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        ipfsHash,
        message: 'Product registered successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Transfer custody
router.post('/transfer', validateCustodyTransfer, async (req, res, next) => {
  try {
    const { productId, newCustodian, locationNote } = req.body;

    logger.info(`Transferring custody of product ${productId}`);

    const result = await contractService.transferCustody(
      productId,
      newCustodian,
      locationNote
    );

    res.status(200).json({
      success: true,
      data: {
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        message: 'Custody transferred successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Verify product (increments counter)
router.post('/:id/verify', validateProductId, async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Verifying product ${id}`);

    const result = await contractService.verifyProduct(id);

    res.status(200).json({
      success: true,
      data: {
        product: result.product,
        transactionHash: result.transactionHash,
        message: 'Product verified successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get product by ID
router.get('/:id', validateProductId, async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Fetching product ${id}`);

    const product = await contractService.getProduct(id);

    // Fetch metadata from IPFS if available
    let metadata = null;
    if (product.ipfsHash && product.ipfsHash !== '') {
      try {
        metadata = await ipfsService.retrieveMetadata(product.ipfsHash);
      } catch (error) {
        logger.warn(`Failed to fetch IPFS metadata for product ${id}`, error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        product,
        metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get product with complete history
router.get('/:id/history', validateProductId, async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Fetching product ${id} with history`);

    const data = await contractService.getProductWithHistory(id);

    // Fetch metadata from IPFS if available
    let metadata = null;
    if (data.product.ipfsHash && data.product.ipfsHash !== '') {
      try {
        metadata = await ipfsService.retrieveMetadata(data.product.ipfsHash);
      } catch (error) {
        logger.warn(`Failed to fetch IPFS metadata for product ${id}`, error);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        ...data,
        metadata
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as productsRouter };
