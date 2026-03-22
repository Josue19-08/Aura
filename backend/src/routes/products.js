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

/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: Product registration, custody transfer, and verification
 */

/**
 * @swagger
 * /api/products/register:
 *   post:
 *     summary: Register a new product on-chain
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [lotId, productName, origin]
 *             properties:
 *               lotId:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 pattern: '^[A-Za-z0-9\-_]+$'
 *                 example: LOT-2024-001
 *               productName:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Ibuprofeno 400mg
 *               origin:
 *                 type: string
 *                 maxLength: 200
 *                 example: Bogotá, Colombia
 *               metadata:
 *                 $ref: '#/components/schemas/Metadata'
 *     responses:
 *       201:
 *         description: Product registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     productId: { type: integer, example: 1 }
 *                     transactionHash: { type: string }
 *                     blockNumber: { type: integer }
 *                     ipfsHash: { type: string }
 *                     message: { type: string }
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       503:
 *         description: IPFS or blockchain service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', validateProductRegistration, async (req, res, next) => {
  try {
    const { lotId, productName, origin, metadata } = req.body;

    logger.info(`Registering product: ${productName}`);

    const metadataObject = metadata || {
      productName,
      lotId,
      origin,
      manufactureDate: new Date().toISOString()
    };

    const ipfsHash = await ipfsService.uploadMetadata(metadataObject);
    logger.info(`Metadata uploaded to IPFS: ${ipfsHash}`);

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

/**
 * @swagger
 * /api/products/transfer:
 *   post:
 *     summary: Transfer product custody to a new address
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, newCustodian, locationNote]
 *             properties:
 *               productId:
 *                 type: integer
 *                 minimum: 1
 *                 example: 1
 *               newCustodian:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                 example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0'
 *               locationNote:
 *                 type: string
 *                 maxLength: 200
 *                 example: 'Warehouse A, Medellín'
 *     responses:
 *       200:
 *         description: Custody transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     transactionHash: { type: string }
 *                     blockNumber: { type: integer }
 *                     message: { type: string }
 *       400:
 *         description: Validation error or unauthorized custodian
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
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

/**
 * @swagger
 * /api/products/{id}/verify:
 *   post:
 *     summary: Verify product authenticity (increments on-chain counter)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Product verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     transactionHash: { type: string }
 *                     message: { type: string }
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/verify', validateProductId, async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Verifying product ${id}`);

    const result = await contractService.verifyProduct(id);

    res.status(200).json({
      success: true,
      data: {
        status: result.status,
        product: result.product,
        custodyHistory: result.custodyHistory,
        currentCustodian: result.currentCustodian,
        verificationCount: result.verificationCount,
        transactionHash: result.transactionHash,
        message: 'Product verified successfully'
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product data by ID (no counter increment)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Product data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     metadata:
 *                       $ref: '#/components/schemas/Metadata'
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', validateProductId, async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Fetching product ${id}`);

    const product = await contractService.getProduct(id);

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

/**
 * @swagger
 * /api/products/{id}/history:
 *   get:
 *     summary: Get product with complete custody chain
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *     responses:
 *       200:
 *         description: Product with full custody history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: object
 *                   properties:
 *                     product:
 *                       $ref: '#/components/schemas/Product'
 *                     history:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CustodyRecord'
 *                     currentCustodian: { type: string }
 *                     metadata:
 *                       $ref: '#/components/schemas/Metadata'
 *       400:
 *         description: Invalid product ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id/history', validateProductId, async (req, res, next) => {
  try {
    const { id } = req.params;

    logger.info(`Fetching product ${id} with history`);

    const data = await contractService.getProductWithHistory(id);

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
