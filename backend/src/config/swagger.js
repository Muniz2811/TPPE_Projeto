const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração básica do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestão de Vendas API',
      version: '1.0.0',
      description: 'Documentação da API do Sistema de Gestão de Vendas',
      contact: {
        name: 'Equipe de Desenvolvimento'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Servidor de Desenvolvimento'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs
};
