const express = require('express');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const emailRouter = require('./routes/email');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api', emailRouter);

// Add route for swagger.json
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Export app for serverless adapters (Netlify, AWS Lambda, etc.)
if (require.main === module) {
  // If this file is executed directly (node src/index.js), start the server.
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;