import express from 'express';
import { contractService } from '../services/contract.js';
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
    const { lotId, productName, origin, ipfsHash } = req.body;

    logger.info(`Registering product: ${productName}`);

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

    res.status(200).json({
      success: true,
      data: {
        product
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

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
});

export { router as productsRouter };
