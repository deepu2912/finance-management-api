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
// Capture raw body (useful for debugging serverless environments where body may arrive
// as a string or encoded). The `verify` function stores the raw buffer as req.rawBody
// while still allowing express.json() to parse the JSON into req.body.
app.use(express.json({
  verify: (req, _res, buf) => {
    try {
      req.rawBody = buf && buf.toString();
    } catch (err) {
      req.rawBody = undefined;
    }
  }
}));

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