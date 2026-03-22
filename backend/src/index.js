import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { logger } from './utils/logger.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { healthRouter } from './routes/health.js';
import { productsRouter } from './routes/products.js';
import { contractService } from './services/contract.js';
import { swaggerSpec } from './config/swagger.js';

// Environment variables are loaded in server.js entry point

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
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

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Initialize contract and start listening — called by server.js, NOT on import
export async function startServer() {
  const PORT = process.env.PORT || 3000;

  await contractService.initialize();
  logger.info('Contract service initialized');

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`Network: ${process.env.NETWORK || 'fuji'}`);
  });
}

export default app;
