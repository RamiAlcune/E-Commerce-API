import { sendEmail, SendEmailInfo } from "./sendEmail";

export interface DetailsForVerifactionCode {
  name: string;
  email: string;
  verifcationToken?: string;
  verificationCode?: number;
  password_token_code?: number;
  password_token?: string;
  password_token_expiration?: Date;
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

export const sendResetPasswordEmail = async (Data: DetailsForVerifactionCode) => {
  const verifyEmailURL = `${Data.origin}/api/v1/auth/verify-email?token=${Data.password_token}&email=${Data.email}`;
  const message = `
  <p>PTo change the password ,Please click on the following link:</p>
  <a href="${verifyEmailURL}">Reset Password</a>
  <h3>Code: ${Data.password_token_code}</h3>
  <h1>Expired-Date: 10 Minutes </h1>
`;

  const data: SendEmailInfo = {
    to: Data.email,
    subject: "Reset-Password Confirmation",
    html: `<h4>Hello,${Data.name} </h4> ${message}`,
  };
  return sendEmail(data);
};
