const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance API - Email Service',
      version: '1.0.0',
      description: 'API for sending emails using Gmail SMTP',
      contact: {
        name: 'API Support',
        email: 'deepanshu2912@gmail.com'
      }
    },
    // Use an environment variable when deployed (e.g. Netlify) or default to root so
    // Swagger UI issues requests to the same origin. Avoid hardcoding localhost.
    servers: [
      {
        url: process.env.SWAGGER_BASE_URL || '/',
        description: 'API server (use SWAGGER_BASE_URL in production if needed)'
      }
    ],
    components: {
      schemas: {
        EmailRequest: {
          type: 'object',
          required: ['to', 'subject', 'body'],
          properties: {
            to: {
              type: 'string',
              format: 'email',
              description: 'Recipient email address'
            },
            subject: {
              type: 'string',
              description: 'Email subject'
            },
            body: {
              type: 'string',
              description: 'Email body content (supports HTML)'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Email sent successfully'
            },
            messageId: {
              type: 'string',
              example: 'unique-message-id'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            error: {
              type: 'string',
              example: 'Detailed error message'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;