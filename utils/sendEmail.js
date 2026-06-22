import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const sendEmail = async (options) => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `aly adbullkareem <${process.env.MAILTRAP_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  return await transport.sendMail(mailOptions);
};
