import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Aura API — Product Traceability System',
      version: '1.0.0',
      description: 'Blockchain-based immutable product traceability on Avalanche C-Chain. Register products, transfer custody, and verify authenticity with on-chain records and IPFS metadata.',
      contact: {
        name: 'Aura Team',
        url: 'https://github.com/Josue19-08/Aura'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            lotId: { type: 'string', example: 'LOT-2024-001' },
            productName: { type: 'string', example: 'Ibuprofeno 400mg' },
            origin: { type: 'string', example: 'Bogotá, Colombia' },
            ipfsHash: { type: 'string', example: 'QmXf7...abc' },
            manufacturer: { type: 'string', example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' },
            createdAt: { type: 'integer', example: 1710432000, description: 'Unix timestamp' },
            verificationCount: { type: 'integer', example: 5 },
            active: { type: 'boolean', example: true }
          }
        },
        CustodyRecord: {
          type: 'object',
          properties: {
            custodian: { type: 'string', example: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0' },
            timestamp: { type: 'integer', example: 1710432000 },
            locationNote: { type: 'string', example: 'Warehouse A, Bogotá' }
          }
        },
        Metadata: {
          type: 'object',
          description: 'Extended product metadata stored on IPFS',
          properties: {
            productName: { type: 'string' },
            lotId: { type: 'string' },
            manufacturer: { type: 'string' },
            origin: { type: 'string' },
            manufactureDate: { type: 'string', format: 'date-time' },
            expirationDate: { type: 'string', format: 'date-time' },
            description: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
            version: { type: 'string', example: '1.0' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'VALIDATION_ERROR' },
                message: { type: 'string', example: 'lotId is required' }
              }
            }
          }
        },
        TransactionResult: {
          type: 'object',
          properties: {
            transactionHash: { type: 'string', example: '0xabc123...' },
            blockNumber: { type: 'integer', example: 12345678 }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

export const swaggerSpec = swaggerJsdoc(options);
