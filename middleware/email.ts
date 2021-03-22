import nodemailer from "nodemailer";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";

import { User } from "models";

// Works better when not middleware
const sendEmail: any = async (req, res, { name, email }: User) => {
  const payload = { name, email };

  const jwtSecret: Secret =
    process.env.NODE_ENV == "production" ? process.env.JWT_SECRET : config.get("jwtSecret");

  const verificationToken = jwt.sign(payload, jwtSecret, {
    // 1 day
    expiresIn: 86400,
  });

  try {
    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.porkbun.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: `contact@${process.env.EMAIL_BASE}`,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: `"Quinn" <contact@${process.env.EMAIL_BASE}>`, // sender address
      to: email, // list of receivers
      subject: "Account Verification", // Subject line
      text: `Hello ${name},\n\nPlease verify your account: (test)[https://${req.headers.host}/api/verification/${email}/${verificationToken}]\n\nThanks,\nListies`, // plain text body
      html: `Hello ${name},<br><br>Please <a href="https://${req.headers.host}/api/verification/${email}/${verificationToken}">click here</a> to verify your account.<br><br>Thanks,<br>Listies`, // html body
      // html: "<b>Hello world?</b>", // html body
    });
    console.log(`Email sent to ${email}`);
  } catch (e) {
    console.log("Failed to send email\n", e);
    res.status(500).json({ msg: "Server failed to send email" });
  }
};

export default sendEmail;
