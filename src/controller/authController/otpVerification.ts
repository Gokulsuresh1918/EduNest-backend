import { NextFunction, Request, Response } from "express";
import { Temporary } from "../../modal/temporary";
import router from "routes/authRouter";
import bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { User } from "../../modal/users";
import jwt from "jsonwebtoken";

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

export const verify = async (req: Request, res: Response) => {
  try {
    const userEnteredOTP = req.query.token.toString();
    // console.log("hii", userEnteredOTP);

    // Find the temporary entry by OTP
    const temporary = await Temporary.findOne({ otp: userEnteredOTP });

    if (!temporary) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Compare entered OTP with stored OTP
    if (userEnteredOTP === String(temporary.otp)) {
      // Transfer data from Temporary to User
      await User.create(temporary.toObject());

      // Remove the temporary entry
      await Temporary.deleteOne({ otp: userEnteredOTP});

      console.log("User registered successfully!");
      return res.redirect(`${process.env.CLIENT_URL}/verified`)
    } else {
      return res.status(400).json({ error: "OTP entered is not correct" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  console.log("hree is the resend otp logic");
  //todo resend otp logic
};
