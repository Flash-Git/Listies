import { Response } from "express";
import nodemailer from "nodemailer";
import { Request } from "express-validator/src/base";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";

import { User } from "models";

// Works better when not middleware
const sendEmail = async (req: Request, res: Response, { name, email }: User): Promise<void> => {
  if (!process.env.REACT_APP_EMAIL_BASE) {
    console.error("No Server email setup");
    res.status(500).send({ msg: "Server emailer is missing" });
  }
  if (!process.env.REACT_APP_EMAIL_PASSWORD) {
    console.error("No Server email password setup");
    res.status(500).send({ msg: "Server emailer password is missing" });
  }

  const payload = { name, email };

  const jwtSecret: Secret =
    process.env.NODE_ENV == "production"
      ? process.env.REACT_APP_JWT_SECRET
      : config.get("jwtSecret");

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
        user: `contact@${process.env.REACT_APP_EMAIL_BASE}`,
        pass: process.env.REACT_APP_EMAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      from: `"Quinn" <contact@${process.env.REACT_APP_EMAIL_BASE}>`, // sender address
      to: email, // list of receivers
      subject: "Listies Account Verification", // Subject line
      text: `Hello ${name},\n\nPlease verify your account: (click here)[https://${req.headers.host}/api/verification/${email}/${verificationToken}]\n\nThanks,\nListies`, // plain text body
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
