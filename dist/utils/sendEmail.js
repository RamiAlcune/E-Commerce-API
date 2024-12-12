"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
//config
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: "mia29@ethereal.email",
        pass: "tsTGFdKCG7g9V5P5e1",
    },
});
const sendEmail = async (SendInfo) => {
    let testAccount = await nodemailer_1.default.createTestAccount();
    return transporter.sendMail({
        from: '"Sender Name" <your-email@gmail.com>', // Sender address
        to: SendInfo.to, // List of receivers
        subject: SendInfo.subject, // Subject line
        text: "Hello world?", // Plain text body
        html: SendInfo.html,
    });
};
exports.sendEmail = sendEmail;
