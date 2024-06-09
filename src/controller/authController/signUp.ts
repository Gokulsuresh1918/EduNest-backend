import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Temporary } from "../../modal/temporary";
import { User } from "../../modal/users";
import ejs from "ejs";
import * as path from 'path';

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString().slice(0, 6);
};

// Create email transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});

// Register User Function
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const otp = generateOtp();
  console.log("OTP IS ", otp);

  const user = new Temporary({
    name,
    email,
    password,
    otp: otp,
  });

  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const verificationUrl = `${process.env.SERVER_URL}/auth/verify?token=${otp}`;
  // Read the HTML template and render it with data
  const templatePath = path.join(__dirname, "..", "..", "assignTaskTemp.html");
  const htmlContent = await ejs.renderFile(templatePath, {
    task: req.body.task,
    dueDate: req.body.dueDate,
    demoCode: req.body.demoCode,
    verificationUrl: verificationUrl,
  });

 
  const mailOptions = {
    from: "edunestofficials@gmail.com",
    to: user.email,
    subject: "OTP Verification",
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending OTP:", error);
      return res.status(500).json({ error: "Failed to send OTP" });
    }

    if (info) {
      console.log("OTP sent:", info.response);
    }
  });

  // Hash the password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  user.password = hashedPassword;
  const newUser = await user.save();
  res.status(201).json({ message: "User created successfully", newUser });
};
export const otpVerification = async (req: Request, res: Response) => {
  try {
    const { userEnteredOTP } = req.body;
    const temporary = await Temporary.findOne({ otp: userEnteredOTP });

    if (!temporary) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    const newUser = new User({
      name: temporary.name,
      email: temporary.email,
      password: temporary.password,
      role: temporary.role,
    });

    await newUser.save();
    await Temporary.deleteOne({ otp: userEnteredOTP });

    res.status(200).json({ message: "OTP verified successfully and user registered" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
