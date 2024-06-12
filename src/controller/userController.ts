import { Classroom } from "../modal/classroom";
import { User } from "../modal/users";
import { Request, Response } from "express";
import * as nodemailer from "nodemailer";
import { Temporary } from "../modal/temporary";
import bcrypt from "bcrypt";

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

export const userData = async (req: any, res: any) => {
  const id = req.params?.id;
  try {
    const userData = await User.findById(id);
    // console.log('user',userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data back to the frontend
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const findUser = async (req: any, res: any) => {
  const reqemail = req.body.email;
  // console.log("fdsfasf", reqemail);

  try {
    const userData = await User.findOne({ email: reqemail });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.newPassword) {
      // console.log('dasdsadas',req.body.newPassword);

      const newpass = req.body.newPassword;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpass, salt);

      const updatedUser = await User.findOneAndUpdate(
        { email: reqemail },
        { password: hashedPassword },
        { new: true }
      );
console.log(updatedUser);

      res
        .status(200)
        .json({ message: "Password Updated Now LogIn" });
    } else {
      res.json(userData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const allUserData = async (req: any, res: any) => {
  try {
    const userData = await User.find();
    // console.log('user',userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data back to the frontend
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const classroomData = async (req: any, res: any) => {
  try {
    const userData = await Classroom.find();
    // console.log('user',userData);

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send user data back to the frontend
    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getClassData = async (req: Request, res: Response) => {
  const classId = req.params?.id;
  // console.log("queryil vana data", classId);
  const classData = await Classroom.findById(classId);
  // console.log("retrieved data backend", classData);

  res.status(200).json({
    message: "Classroom data fetched",
    classroom: classData.title,
  });
};

export const updateUsername = async (req: Request, res: Response) => {
  const newUsername = req.body.newUsername;
  const userId = req.body.userId;

  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the username
    userData.name = newUsername;
    await userData.save();

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  const userId = req.params?.id;

  try {
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    userData.name = req.body.name;
    userData.email = req.body.email;
    await userData.save();

    res.status(200).json({ message: "Username updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const updateClass = async (req: Request, res: Response) => {
  const userId = req.params?.id;
  console.log(req.body);

  try {
    const classData = await Classroom.findById(userId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    classData.title = req.body.title;
    classData.description = req.body.description;
    await classData.save();

    res.status(200).json({ message: "Class updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  const otp = generateOtp();
  console.log("OTP IS ", otp);

  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = new User({
    name,
    email,
  });

  await newUser.save();

  res.status(201).json({ message: "User created successfully", newUser });
};
