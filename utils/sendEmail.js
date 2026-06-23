import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

export const sendEmail = async (options) => {
const transport = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_PASSWORD,
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
