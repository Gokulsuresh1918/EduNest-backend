import { NextFunction, Request, Response } from "express";
import { Temporary } from "../../modal/temporary";
import router from "routes/authRouter";
import bcrypt from "bcrypt";
import * as nodemailer from "nodemailer";
import { User } from "../../modal/users";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "Email not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Password does not match" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      user:user,
      message: "Login successful. Please store this token in localStorage.",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googlelogin = async (req: Request, res: Response) => {
  // console.log("google dadta vannu ", req.body);
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.profileData.sub,
  });
  const newUser = await user.save();

  console.log('login using google ',newUser);
  return res.status(200).json({ message: "user registration succesfull" });
};
