import express from 'express';
import multer from 'multer';
import { ipfsService } from '../services/ipfs.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
// Accept multipart/form-data (files stored in memory, not disk)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/ipfs/upload
 * Accepts JSON metadata (and ignores file fields — files are handled client-side).
 * Returns the IPFS hash (CID).
 */
router.post('/upload', upload.any(), async (req, res, next) => {
  try {
    // The frontend sends { metadata: JSON string, certificates, images }
    // We only store the JSON metadata on IPFS
    let metadata = req.body.metadata;

    if (typeof metadata === 'string') {
      try {
        metadata = JSON.parse(metadata);
      } catch {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_METADATA', message: 'metadata must be valid JSON' }
        });
      }
    }

    if (!metadata || typeof metadata !== 'object') {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_METADATA', message: 'metadata is required' }
      });
    }

    logger.info('Uploading metadata to IPFS', { productName: metadata.productName });

    const ipfsHash = await ipfsService.uploadMetadata(metadata);

    res.status(200).json({
      success: true,
      data: { ipfsHash }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/ipfs/:hash
 * Retrieve metadata from IPFS by CID.
 */
router.get('/:hash', async (req, res, next) => {
  try {
    const { hash } = req.params;

    const metadata = await ipfsService.retrieveMetadata(hash);

    res.status(200).json({
      success: true,
      data: { metadata }
    });
  } catch (error) {
    next(error);
  }
});

export { router as ipfsRouter };
