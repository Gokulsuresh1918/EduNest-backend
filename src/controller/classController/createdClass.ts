import { Request, Response } from "express";
import { Task } from "../../modal/assignedTask";
import { Classroom } from "../../modal/classroom";
import { File } from "../../modal/uploads";
import { User } from "../../modal/users";
import * as nodemailer from "nodemailer";

// Extend the Request interface to include a user property
interface User {
  userId: string;
  username: string;
  email: string;
}
interface ExtendedRequest extends Request {
  user?: User;
}

export const createClassroom = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  try {
    // Extract user information from the request
    let user = req.body;

    let userId = user.ownerId;
    // console.log("userId:", userId);

    // Find the user by ID to get additional user details
    const userData = await User.findById(userId);

    // Create a new teacher object with the user's name and email
    const newTeacher = {
      name: userData.name,
      email: userData.email,
    };
    console.log("req uaser", req.body.teacher);

    // Create a new classroom instance with the provided data
    const newClassroom = new Classroom({
      title: req.body.title,
      description: req.body.description,
      students: [],
      teacher: [newTeacher],
      owner: userData._id,
      profilePicture: req.body.profilePicture,
      roomCode: req.body.code,
      teacherCode: req.body.teacher,
    });
    // console.log( 'req newClassroom',newClassroom);

    const clasRoom = await Classroom.insertMany([newClassroom]);

    console.log(clasRoom);

    res.status(200).json({
      message: "Classroom creation successful",
      classroom: newClassroom,
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    // Respond with an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getClassData = async (req: Request, res: Response) => {
  const classCode = req.params?.id;
  // console.log("querryil vana data", classCode);
  const classData = await Classroom.find({ roomCode: classCode });
  // console.log("retrived data abcakend", classData);

  res.status(200).json({
    message: "Classroom data fetched",
    classroom: classData,
  });
};

export const getStudentData = async (req: Request, res: Response) => {
  const UserId = req.params?.id;
  // console.log("querryil vana data", UserId);
  const UserData = await User.findById(UserId);
  // console.log("retrived data abcakend", UserData);

  res.status(200).json({
    message: "Classroom data fetched",
    Students: UserData,
  });
};

export const deleteClass = async (req: Request, res: Response) => {
  const classCode = req.params?.id;
  // console.log('class',classCode);

  try {
    const updatedClassroom = await Classroom.findOneAndUpdate(
      { roomCode: classCode },
      { $set: { status: true } },
      { new: true }
    );
    // console.log('found class',updatedClassroom);

    if (!updatedClassroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    res.status(200).json({
      message: "Classroom marked as deleted",
      classroom: updatedClassroom,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};
export const blockUser = async (req: Request, res: Response) => {
  const userId = req.params?.id;
  // console.log('clasuserIds',userId);

  try {
    const UserData = await User.findByIdAndUpdate(
      userId,
      { $set: { status: true } },
      { new: true }
    );

    // console.log('found User',UserData);

    if (!UserData) {
      return res.status(404).json({ message: "UserData not found" });
    }

    res.status(200).json({
      message: "User marked as Blocked",
      User: UserData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};
export const assigntask = async (req: Request, res: Response) => {
  const URL = process.env.CLIENT_URL;
  try {
    const task = req.body;
    // console.log('task',task);

    const user = await User.findOne({ email: task.studentEmail }).exec();

    // console.log('userdadta',user);
    const verificationUrl = `${URL}/joinedClass/${req.body.demoCode}`;

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
            .task-details {
                font-size: 16px;
                margin: 20px 0;
            }
            .task-details p {
                margin: 5px 0;
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
            <h1>New Task Assigned</h1>
            <p>You have been assigned a new task by your teacher. Here are the details:</p>
            <div class="task-details">
                <p><strong>Title:</strong> ${req.body.task}</p>
                <p><strong>Due Date:</strong> ${req.body.dueDate}</p>
                <p><strong>Class Code:</strong> ${req.body.demoCode}</p>
            </div>
            <p>Please ensure to complete the task by the due date.</p>
            <div>
                <a href="${verificationUrl}" class="button">View Task</a>
            </div>
            <p>If you have any questions, please contact your teacher.</p>
        </div>
    </body>
    </html>
`;

    const mailOptions = {
      from: "edunestofficials@gmail.com",
      to: user.email,
      subject: "OTP Verification",
      html: htmlContent,
    };
    const transporter = nodemailer.createTransport({
      service: "Gmail", // e.g., 'Gmail', 'SMTP'
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });
    transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
      if (error) {
        console.log("Error sending OTP:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }

      if (info) {
        console.log("OTP sent:", info.response);
      } else {
        console.log("Info is undefined");
        // Handle the case where info is undefined
      }
    });

    const tasks = new Task({
      title: req.body.task,
      dueDate: req.body.dueDate,
      assignedTo: user._id,
      classCode: req.body.demoCode,
    });

    const taskData = await Task.insertMany([tasks]);
    // console.log('userdadta',taskData);

    res.status(201).json({
      message: "Task successfully assigned.",
      task: task,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};
export const bulkEmail = async (req: Request, res: Response) => {
  try {
    const { subject, body, emailAddresses } = req.body;
    // console.log(subject, body, emailAddresses);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });

    // Setup email options
    let mailOptions = {
      from: process.env.MY_EMAIL,
      to: emailAddresses,
      subject: subject,
      text: body,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
    });

    res.status(201).json({
      message: "Email Sent successfully .",
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while processing your request." });
  }
};

export const fileData = async (req: Request, res: Response) => {
  try {
    const classCode = req.params?.id;
    console.log("classCode", classCode);

    const files = await File.find({ classCode });
    // console.log('file',files);

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const fileUpload = async (req: Request, res: Response) => {
  try {
    const { filename, fileType, fileSize, fileUrl, uploaderId, classCode } =
      req.body;

    // if (!filename || !fileType || !fileSize || !fileUrl || !uploaderId) {
    //   return res.status(400).json({ message: 'All fields are required' });
    // }

    const newFile = new File({
      filename,
      fileType,
      fileSize,
      fileUrl,
      uploaderId,
      classCode,
    });

    const savedFile = await newFile.save();

    res.status(200).json(savedFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const assignedStudent = async (req: Request, res: Response) => {
  try {
    const UserId = req.params?.id;
    // console.log("querryil vana data", UserId);
    const UserData = await Task.find({ assignedTo: UserId });
    // console.log("retrived data abcakend", UserData);

    res.status(200).json({
      message: "Classroom data fetched",
      Students: UserData,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error" });
  }
};
