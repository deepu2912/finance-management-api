const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter using environment variables so production creds can be set in Netlify
const SMTP_HOST = process.env.SMTP_SERVER || 'smtp.gmail.com';
const SMTP_PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465;
const SMTP_SECURE = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : SMTP_PORT === 465;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration at startup where possible (helps catch auth/config issues early)
transporter.verify()
  .then(() => console.log('Email transporter verified'))
  .catch((err) => console.warn('Warning: email transporter verification failed:', err && err.message ? err.message : err));

// Function to send email
const sendEmail = async (to, subject, body) => {
  try {
    const mailOptions = {
      from: `"${process.env.SENDER_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error && error.message ? error.message : error);
    // Re-throw the original error so the route can inspect it and map to an HTTP status
    throw error;
  }
};

module.exports = { sendEmail };