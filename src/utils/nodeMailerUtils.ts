import nodemailer from "nodemailer";
import envConfig from "../config/envConfig";

export const sendEmail = async (to: string, subject: string, html: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: envConfig.smtp_user,
      pass: envConfig.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: envConfig.smtp_user,
    to,
    subject,
    text: "",
    html,
  });
};
