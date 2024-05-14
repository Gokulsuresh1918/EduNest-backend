import { NextFunction, Request, Response } from "express";
import { Temporary } from "../../modal/temporary";
import router from "routes/authRouter";
import bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { User } from "../../modal/users";
import jwt from "jsonwebtoken";
// import {randomInt} from 'crypto'



export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const otp = generateotp();
  console.log("OTP IS ", otp);

  const user = new Temporary({
    name,
    email,
    password,
    otp: otp,
  });
  // req.session.email = email;

  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return res.status(400).json({ error: "user already exists" });
  }
  const emailText = `Hi, this is from EduNest. You just signed up. Your OTP is: ${otp}`;
  const mailOptions = {
    from: "edunestofficials@gmail.com",
    to: user.email,
    subject: "OTP Verification",
    text: emailText,
  };

  transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
    if (error) {
      console.log("Error sending OTP:", error);
    }

    console.log("OTP sent:", info.response);
  });
  // Hashing of password and adding to the database
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;
  const newUser = await user.save();
  res.status(201).json({ message: "user created sucessfully", newUser });
};

// OTP verification
const transporter = nodemailer.createTransport({
  service: "Gmail", // e.g., 'Gmail', 'SMTP'
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});
let otp;
let data;
const generateotp = () => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, 6);
  // const otp =randomInt(100000,1000000)

  return otp
};

export const otpVerification = async (req: Request, res: Response) => {
  try {
    const userEnteredOTP = req.body.userEnteredOTP;
    // console.log('OTP Verification Logic:', req.body.userEnteredOTP);
    try {
      const temporary = await Temporary.findOne({ otp: userEnteredOTP });
      const otpdata = temporary.otp;

      if (userEnteredOTP == otpdata) {
        await User.insertMany([temporary]);

        console.log("User registered successfully!!");
        res.status(200).json({ message: "OTP verified successfully" });
      }
    } catch (error) {
      res.status(400).json({ error: "OTP entered is not correct" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  console.log("hree is the resend otp logic");
  //todo resend otp logic
};


