const swaggerAutogen = require('swagger-autogen')();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RubyAMS API',
      version: '1.0.0',
      description: 'API for Ruby Academic Management System',
      contact: {
        name: 'API Support',
        email: 'support@rubyams.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080/api',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            studentNumber: { type: 'integer' },
            nftAddress: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            code: { type: 'string' },
            credits: { type: 'integer' },
            semester: { type: 'integer' },
            inProgress: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Bid: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            amount: { type: 'integer' },
            txHash: { type: 'string' },
            bidder: { type: 'string' },
            courseId: { type: 'integer' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        Vote: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            qualityName: { type: 'string' },
            txHash: { type: 'string' },
            voter: { type: 'string' },
            courseId: { type: 'integer' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/controller/*.ts']
};

const outputFile = './swagger.json';
const endpointsFiles = [
  './src/controller/student.ts',
  './src/controller/course.ts',
  './src/controller/bid.ts',
  './src/controller/vote.ts'
];

swaggerAutogen(outputFile, endpointsFiles, swaggerOptions); 