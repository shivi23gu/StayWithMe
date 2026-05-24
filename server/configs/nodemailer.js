import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("Nodemailer Verification Failed:", error.message);
  } else {
    console.log("=== Nodemailer Connected! Ready to send emails ===");
  }
});

export default transporter;