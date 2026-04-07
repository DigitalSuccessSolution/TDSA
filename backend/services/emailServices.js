// services/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use Port 465 with SSL
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Data Science Academy" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email Sent ✔");
  } catch (error) {
    console.log("Email Error:", error.message);
  }
};

module.exports = { sendEmail };
