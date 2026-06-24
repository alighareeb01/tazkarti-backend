import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const sendEmail = async (options) => {
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10000, // 10 seconds
  socketTimeout: 10000,
});

const mailOptions = {
  from: `Aly Abdullkareem <${process.env.GMAIL_USER}>`,
  to: options.email,
  subject: options.subject,
  html: options.message,
};

  return await transport.sendMail(mailOptions);
};
