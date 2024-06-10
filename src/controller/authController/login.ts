import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../modal/users";

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
};

const generateRefreshToken = (user: any) => {
  return jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

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

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken,
      user,
      message: "Login successful. Please store the tokens in localStorage.",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const googlelogin = async (req: Request, res: Response) => {
  const { name, email, profileData } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({
      name,
      email,
      password: profileData.sub,
      googleId: profileData.sub,
      role: "user",
    });
    await user.save();
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    accessToken,
    refreshToken,
    user,
    message:
      "Google login successful. Please store the tokens in localStorage.",
  });
};
