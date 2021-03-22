import nodemailer from "nodemailer";
import jwt, { Secret } from "jsonwebtoken";
import config from "config";

const email: any = async (req, res, next) => {
  const payload = { email: req.body.email };

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
      from: `"Quinn" <verification@${process.env.EMAIL_BASE}>`, // sender address
      // from: '"Quinn" <contact@jaquinn.com>', // sender address
      to: req.body.email, // list of receivers
      subject: "Account Verification", // Subject line
      text: `Hello ${req.body.name}\n\nPlease verify your account: https://${req.headers.host}/api/verification/${req.body.email}/${verificationToken}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });

    console.log(`Message sent to ${req.body.email}`);

    next();
  } catch (e) {
    console.log("Failed to send email", e);
    res.status(500).json({ msg: "Failed to send email" });
  }
};

export default email;
