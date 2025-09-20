const express = require('express');
const { sendEmail } = require('../config/email');

const router = express.Router();

/**
 * @swagger
 * /api/send-email:
 *   post:
 *     summary: Send an email using Gmail SMTP
 *     description: Sends an email to the specified recipient with the given subject and body content
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       200:
 *         description: Email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/send-email', async (req, res) => {
  try {
    // Some serverless environments (or proxy rewrites) may deliver the JSON body as a
    // string. Be defensive: if req.body is a string, try to parse it.
    let payload = req.body;
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (err) {
        // leave payload as string if parse fails
        console.warn('Warning: failed to parse string payload as JSON');
      }
    }

    const { to, subject, body } = payload || {};

    // Validate request body
    if (!to || !subject || !body) {
      console.debug('Received payload for send-email:', payload);
      return res.status(400).json({
        success: false,
        message: 'Please provide email recipient (to), subject, and body'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Send email
    const result = await sendEmail(to, subject, body);
    
    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('Error in send-email route:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

module.exports = router;