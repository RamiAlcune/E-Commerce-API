import { sendEmail, SendEmailInfo } from "./sendEmail";

export interface DetailsForVerifactionCode {
  name: string;
  email: string;
  verifcationToken: string;
  verificationCode: number;
  origin?: string;
}

export const sendVerifactionEmail = async (Details: DetailsForVerifactionCode) => {
  const verifyEmailURL = `${Details.origin}/api/v1/auth/verify-email?token=${Details.verifcationToken}&email=${Details.email}`;
  const message = `
  <p>Please confirm your email by clicking on the following link:</p>
  <a href="${verifyEmailURL}">Verify Email</a>
  <h3>Code: ${Details.verificationCode}</h3>
`;

  const data: SendEmailInfo = {
    to: Details.email,
    subject: "Email Confirmation",
    html: `<h4>Hello,${Details.name} </h4> ${message}`,
  };

  return sendEmail(data);
};
