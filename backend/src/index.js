import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { productsRouter } from './routes/products.js';
import { contractService } from './services/contract.js';

// Environment variables are loaded in server.js entry point

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});

app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: 'Aura API',
      version: '1.0.0',
      description: 'Product traceability on Avalanche',
      endpoints: {
        health: '/api/health',
        products: {
          register: 'POST /api/products/register',
          transfer: 'POST /api/products/transfer',
          verify: 'POST /api/products/:id/verify',
          get: 'GET /api/products/:id',
          history: 'GET /api/products/:id/history'
        }
      }
    }
  });
});

app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Initialize and start server
async function startServer() {
  try {
    // Initialize contract service
    await contractService.initialize();
    logger.info('Contract service initialized');

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`Network: ${process.env.NETWORK || 'fuji'}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

// Start the server
startServer();

export default app;
