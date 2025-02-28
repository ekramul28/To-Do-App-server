import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com.",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "mdekramulhassan168@gmail.com",
      pass: "ktrz fbbb lxlr kmhp",
    },
  });

  await transporter.sendMail({
    from: "mdekramulhassan168@gmail.com", // sender address
    to, // list of receivers
    subject: "The code is valid for 2 minutes", // Subject line
    text: "", // plain text body
    html, // html body
  });
};
