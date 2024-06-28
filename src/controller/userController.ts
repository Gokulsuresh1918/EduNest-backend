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



// Function to find user by ID or email and send data to the frontend
export const userData = async (req: Request, res: Response) => {
  const { id, email } = req.query;
// console.log('req querry',req.query);

  try {
    let userData;

    if (id) {
      userData = await User.findById(id);
    } else if (email) {
      userData = await User.findOne({ email: email });
      if (userData) {
        // Generate OTP
        const otp = userData.otp
        console.log('otp anaii ',otp);
        
        const htmlContent = `
          <html>
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
                 
                  <p>If you did not sign up for this account, please ignore this email.</p>
              </div>
          </body>
          </html>
        `;

        const mailOptions = {
          from: "edunestofficials@gmail.com",
          to: userData.email,
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
      }
    } else {
      return res.status(400).json({ message: "ID or email is required" });
    }

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
  const newpass = req.body.newPassword;
  // console.log("fdsfasf", req.body);

  try {
    const userData = await User.findOne({ email: reqemail });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    // console.log("userData", userData);

    if (newpass) {
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newpass, salt);

      const updatedUser = await User.findOneAndUpdate(
        { email: reqemail },
        { password: hashedPassword },
        { new: true }
      );
      // console.log('updatedUser',updatedUser);

      res.status(200).json({ message: "Password Updated Now LogIn" });
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

  try {
    const classData = await Classroom.findById(classId);

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.status(200).json({
      message: "Classroom data fetched",
      classroom: classData.title || classData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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


export const getStudentsData = async (req: Request, res: Response) => {
  const studentIds = req.query.ids;
// console.log('entere',req.query.ids);

  if (!Array.isArray(studentIds)) {
    return res.status(400).json({ message: "Invalid student IDs" });
  }

  try {
    const students = await User.find({ _id: { $in: studentIds } });

    if (!students.length) {
      return res.status(404).json({ message: "Students not found" });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};