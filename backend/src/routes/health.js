import express from 'express';
import { contractService } from '../services/contract.js';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    // Check if contract service is initialized
    const isContractReady = contractService.provider !== null;

    // Get network info if available
    let networkInfo = null;
    if (isContractReady) {
      try {
        const network = await contractService.provider.getNetwork();
        const blockNumber = await contractService.provider.getBlockNumber();

        networkInfo = {
          chainId: Number(network.chainId),
          name: network.name,
          blockNumber
        };
      } catch (error) {
        networkInfo = { error: 'Failed to fetch network info' };
      }
    }

    res.status(200).json({
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        contractReady: isContractReady,
        network: networkInfo
      }
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: error.message
      }
    });
  }
});

export { router as healthRouter };
