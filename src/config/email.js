const nodemailer = require('nodemailer');
require('dotenv').config();

// Create email transporter

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };