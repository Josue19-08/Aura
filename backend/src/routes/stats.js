import express from 'express';
import { contractService } from '../services/contract.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get platform-wide product statistics
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Platform statistics
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
 *                     totalProducts:
 *                       type: integer
 *                       example: 42
 *                     totalVerifications:
 *                       type: integer
 *                       example: 128
 *                     fraudAlerts:
 *                       type: integer
 *                       example: 2
 *                     topProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer }
 *                           productName: { type: string }
 *                           lotId: { type: string }
 *                           verificationCount: { type: integer }
 */
router.get('/', async (req, res, next) => {
  try {
    const FRAUD_THRESHOLD = 100;

    // Get total registered products from the contract
    const totalProductsBigInt = await contractService.contract.getTotalProducts();
    const totalProducts = Number(totalProductsBigInt);

    if (totalProducts === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalProducts: 0,
          totalVerifications: 0,
          fraudAlerts: 0,
          topProducts: []
        }
      });
    }

    // Fetch all products to aggregate stats (cap at 200 for performance)
    const limit = Math.min(totalProducts, 200);
    const productIds = Array.from({ length: limit }, (_, i) => i + 1);

    const productResults = await Promise.allSettled(
      productIds.map(id => contractService.getProduct(id))
    );

    const products = productResults
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const totalVerifications = products.reduce(
      (sum, p) => sum + (p.verificationCount || 0),
      0
    );

    const fraudAlerts = products.filter(
      p => p.verificationCount > FRAUD_THRESHOLD
    ).length;

    const topProducts = [...products]
      .sort((a, b) => b.verificationCount - a.verificationCount)
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        productName: p.productName,
        lotId: p.lotId,
        verificationCount: p.verificationCount
      }));

    logger.info(`Stats fetched: ${totalProducts} products, ${totalVerifications} verifications`);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalVerifications,
        fraudAlerts,
        topProducts
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as statsRouter };
