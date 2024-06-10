import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { Temporary } from "../../modal/temporary";
import { User } from "../../modal/users";
import ejs from "ejs";
import * as path from "path";

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000)
    .toString()
    .slice(0, 6);
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
  const { name, email, password,role } = req.body;
  console.log("hii", req.body);

  const otp = generateOtp();
  console.log("OTP IS ", otp);

  const user = new Temporary({
    name,
    email,
    password,
    otp: otp,
    role:role
  });

  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const verificationUrl = `${process.env.SERVER_URL}/auth/verify?token=${otp}`;
  const htmlContent = `<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin: auto;
            }
            .code {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            .button {
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 5px;
            }
            .link {
                color: #4CAF50;
                text-decoration: none;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Verify Your Email</h1>
            <p>Thank you for signing up. You can verify your email address using one of the following options:</p>
            <div>
                <h2>Option 1: Verify using OTP</h2>
                <p>Use the code below to verify your email address:</p>
                <div class="code">${otp}</div>
            </div>
            <div>
                <h2>Option 2: Verify using Email Link</h2>
                <p>Click the link below to verify your email address:</p>
                <a href="${verificationUrl}" class="link">Verify Email</a>
            </div>
            <p>If you did not sign up for this account, please ignore this email.</p>
        </div>
    </body>
    </html>`;

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

    res
      .status(200)
      .json({ message: "OTP verified successfully and user registered" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
