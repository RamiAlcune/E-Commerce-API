"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerifactionEmail = void 0;
const sendEmail_1 = require("./sendEmail");
const sendVerifactionEmail = async (Details) => {
    const verifyEmailURL = `${Details.origin}/api/v1/auth/verify-email?token=${Details.verifcationToken}&email=${Details.email}`;
    const message = `
  <p>Please confirm your email by clicking on the following link:</p>
  <a href="${verifyEmailURL}">Verify Email</a>
  <h3>Code: ${Details.verificationCode}</h3>
`;
    const data = {
        to: Details.email,
        subject: "Email Confirmation",
        html: `<h4>Hello,${Details.name} </h4> ${message}`,
    };
    return (0, sendEmail_1.sendEmail)(data);
};
exports.sendVerifactionEmail = sendVerifactionEmail;
