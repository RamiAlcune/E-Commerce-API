import nodemailer from "nodemailer";

//config
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "mia29@ethereal.email",
    pass: "tsTGFdKCG7g9V5P5e1",
  },
});
export interface SendEmailInfo {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (SendInfo: SendEmailInfo) => {
  let testAccount = await nodemailer.createTestAccount();

  return transporter.sendMail({
    from: '"Sender Name" <your-email@gmail.com>', // Sender address
    to: SendInfo.to, // List of receivers
    subject: SendInfo.subject, // Subject line
    text: "Hello world?", // Plain text body
    html: SendInfo.html,
  });
};
