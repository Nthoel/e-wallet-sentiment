const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'E-Wallet Sentiment API',
      version: '0.1.0',
      description:
        'API dokumentasi untuk E-Wallet Sentiment Analysis Platform. ' +
        'Platform ini menyediakan fitur analisis sentimen review e-wallet dari Google Play Store.',
      contact: {
        name: 'E-Wallet Sentiment Team'
      }
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:3001',
        description: 'Backend Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoint'
      },
      {
        name: 'Auth',
        description: 'Autentikasi dan manajemen user'
      },
      {
        name: 'Reviews',
        description: 'Manajemen review e-wallet'
      },
      {
        name: 'Profile',
        description: 'Manajemen profil user'
      },
      {
        name: 'Admin',
        description: 'Dashboard dan manajemen untuk admin'
      }
    ]
  },
  apis: [
    // Route files dengan JSDoc annotations
    path.join(__dirname, '../modules/**/*.routes.js'),
    path.join(__dirname, '../modules/**/*.router.js'),
    path.join(__dirname, '../app.js'),
    // Schema YAML files di folder docs
    path.join(__dirname, '../../../docs/schemas/*.yaml')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
