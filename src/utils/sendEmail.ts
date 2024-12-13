import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure the transporter for Mailtrap
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // Mailtrap SMTP host
  port: 587, // Default Mailtrap port for SMTP
  auth: {
    user: process.env.USER_GMAIL, // Your Gmail address
    pass: process.env.APP_PASSWORD, // App password generated by Google
  },
});

export interface SendEmailInfo {
  to: string; // Recipient email address
  subject: string; // Email subject
  html: string; // Email body (HTML content)
}

export const sendEmail = async (SendInfo: SendEmailInfo) => {
  const sender = {
    user: process.env.USER_GMAIL, // Your Gmail address
    pass: process.env.APP_PASSWORD, // App password generated by Google
  };

  return transporter.sendMail({
    from: `"E-Commerce-Project" <${sender.user}>`, // Sender name and address
    to: SendInfo.to, // Recipient address
    subject: SendInfo.subject, // Subject line
    html: SendInfo.html, // HTML body
  });
};
