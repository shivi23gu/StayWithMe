import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Environment variables load karne ke liye initialization jaruri hai
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // 587 TLS port ke liye hamesha false rahega
  auth: {
    user: process.env.SMTP_USER, // .env se aapka Brevo username load karega
    pass: process.env.SMTP_PASS, // .env se aapka Brevo password/SMTP Key load karega
  },
});

// System check: Server initialization terminal par hi verify ho jaye
transporter.verify((error, success) => {
  if (error) {
    console.log("Nodemailer Verification Failed:", error.message);
  } else {
    console.log("=== Nodemailer Connected! Ready to send emails ===");
  }
});

export default transporter;