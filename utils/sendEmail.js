import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const sendEmail = async (options) => {
const transport = nodemailer.createTransport({
  service: "SendGrid",
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_PASSWORD,
  },
});

const mailOptions = {
  from: `Aly Abdullkareem  <${process.env.MAILTRAP_FROM}>`,
  to: options.email,
  subject: options.subject,
  html: options.message,
};

  return await transport.sendMail(mailOptions);
};
