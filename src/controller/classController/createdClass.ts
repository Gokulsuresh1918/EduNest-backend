import { Request, Response } from "express";
import { Task } from "../../modal/assignedTask";
import { Classroom } from "../../modal/classroom";
import { File } from "../../modal/uploads";
import { User } from "../../modal/users";
import * as nodemailer from "nodemailer";
import * as ejs from "ejs";
import * as path from "path";
import cron from "node-cron";

// Extend the Request interface to include a user property
interface User {
  userId: string;
  username: string;
  email: string;
}

interface ExtendedRequest extends Request {
  user?: User;
}

/**
 * Check if two dates are approximately equal within a given tolerance.
 * @param date1 First date object
 * @param date2 Second date object
 * @param toleranceInSeconds Tolerance in seconds (default: 30 seconds)
 * @returns True if dates are approximately equal, false otherwise
 */
function isApproximatelyEqual(
  date1: Date,
  date2: Date,
  toleranceInSeconds: number = 30
): boolean {
  const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime());
  const diffInSeconds = diffInMilliseconds / 1000;
  return diffInSeconds <= toleranceInSeconds;
}

/**
 * Create a new classroom.
 * @param req Request object containing classroom data
 * @param res Response object
 * @returns Promise<void>
 */
export const createClassroom = async (
  req: ExtendedRequest,
  res: Response
): Promise<void> => {
  try {
    // Extract user information from the request
    const { ownerId, title, description, profilePicture, code, teacher } = req.body;

    // Find the user by ID to get additional user details
    const userData = await User.findById(ownerId);

    // Create a new teacher object with the user's name and email
    const newTeacher = {
      name: userData.name,
      email: userData.email,
    };

    // Create a new classroom instance with the provided data
    const newClassroom = new Classroom({
      title,
      description,
      students: [],
      teacher: [newTeacher],
      owner: userData._id,
      profilePicture,
      roomCode: code,
      teacherCode: teacher,
    });

    // Save the new classroom to the database
    const savedClassroom = await newClassroom.save();

    res.status(200).json({
      message: "Classroom creation successful",
      classroom: savedClassroom,
    });
  } catch (error) {
    console.error("Error creating classroom:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieve classroom data based on room code.
 * @param req Request object containing room code
 * @param res Response object
 * @returns Promise<void>
 */
export const getClassData = async (req: Request, res: Response): Promise<void> => {
  try {
    const classCode = req.params.id;
    const classData = await Classroom.find({ roomCode: classCode });

    res.status(200).json({
      message: "Classroom data fetched",
      classroom: classData,
    });
  } catch (error) {
    console.error("Error fetching classroom data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieve classroom details based on classroom ID.
 * @param req Request object containing classroom ID
 * @param res Response object
 * @returns Promise<void>
 */
export const classDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const classData = await Classroom.findById(id);

    res.status(200).json({
      message: "Classroom data fetched",
      classroom: classData,
    });
  } catch (error) {
    console.error("Error fetching classroom details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieve student data based on student ID.
 * @param req Request object containing student ID
 * @param res Response object
 * @returns Promise<void>
 */
export const getStudentData = async (req: Request, res: Response): Promise<void> => {
  try {
    const UserId = req.params.id;
    const UserData = await User.findById(UserId);

    res.status(200).json({
      message: "Student data fetched",
      student: UserData,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Toggle the status (active/inactive) of a classroom.
 * @param req Request object containing classroom ID
 * @param res Response object
 * @returns Promise<void>
 */
export const deleteClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const classCode = req.params.id;
    const classroom = await Classroom.findOne({ roomCode: classCode });

    if (!classroom) {
      res.status(404).json({ message: "Classroom not found" });
      return;    }

    // Toggle the status (false -> true, true -> false)
    classroom.status = !classroom.status;
    const updatedClassroom = await classroom.save();

    res.status(200).json({
      message: "Classroom status updated",
      classroom: updatedClassroom,
    });
  } catch (error) {
    console.error("Error toggling classroom status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Block or unblock a user based on user ID.
 * @param req Request object containing user ID
 * @param res Response object
 * @returns Promise<void>
 */
export const blockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;    }

    // Toggle the user status (active -> blocked, blocked -> active)
    user.status = !user.status;
    const updatedUser = await user.save();

    res.status(200).json({
      message: "User status updated",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Assign a task to a student and schedule a reminder email.
 * @param req Request object containing task details
 * @param res Response object
 * @returns Promise<void>
 */
export const assignTask = async (req: Request, res: Response): Promise<void> => {
  const URL = process.env.CLIENT_URL;
  
  try {
    const { task, studentEmail, dueDate, demoCode } = req.body;

    // Find the user by email to get additional user details
    const user = await User.findOne({ email: studentEmail }).exec();
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;     }

    // Prepare verification URL for task assignment
    const verificationUrl = `${URL}/joinedClass/${demoCode}`;

    // Read the HTML template and render it with data
    const templatePath = path.join(__dirname, "../../templates/emailTemplate.html");
    const htmlContent = await ejs.renderFile(templatePath, {
      task,
      dueDate,
      demoCode,
      verificationUrl,
    });

    // Configure email options
    const mailOptions = {
      from: "edunestofficials@gmail.com",
      to: user.email,
      subject: "Task Assigned in the Classroom",
      html: htmlContent,
    };

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });

    // Send task assignment email
    transporter.sendMail(mailOptions, (error: any, info: { response: any }) => {
      if (error) {
        console.error("Error sending task assignment email:", error);
        return res.status(500).json({ error: "Failed to send task assignment email" });
      }
      console.log("Task assignment email sent:", info.response);
    });

    // Schedule a reminder email 30 minutes before the due date
    const cronSchedule = "* * * * *";
    const reminderTemplate = path.join(__dirname, "../../templates/reminderEmailTemplate.html");

    cron.schedule(cronSchedule, async () => {
      const now = new Date();
      const thirtyMinutesBeforeDueDate = new Date(dueDate.getTime() - 30 * 60000);

      if (isApproximatelyEqual(now, thirtyMinutesBeforeDueDate)) {
        // Render reminder email template with data
        const reminderHtmlContent = await ejs.renderFile(reminderTemplate, {
          task,
          dueDate,
          demoCode,
          verificationUrl,
        });

        // Configure reminder email options
        const reminderMailOptions = {
          from: "edunestofficials@gmail.com",
          to: user.email,
          subject: "Reminder: Task Submission Due Soon",
          html: reminderHtmlContent,
        };

        // Send reminder email
        transporter.sendMail(reminderMailOptions, (error: any, info: { response: any }) => {
          if (error) {
            console.error("Error sending reminder email:", error);
          } else {
            console.log("Reminder email sent:", info.response);
          }
        });
      }
    });

    // Create new task document and save it to the database
    const newTask = new Task({
      title: task,
      dueDate,
      assignedTo: user._id,
      classCode: demoCode,
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      message: "Task successfully assigned",
      task: savedTask,
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Send bulk email to multiple recipients.
 * @param req Request object containing email details
 * @param res Response object
 * @returns Promise<void>
 */
export const bulkEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subject, body, emailAddresses } = req.body;

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASS,
      },
    });

    // Setup email options
    const mailOptions = {
      from: process.env.MY_EMAIL,
      to: emailAddresses,
      subject,
      text: body,
    };

    // Send bulk email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      console.log("Bulk email sent:", info.response);
    });

    res.status(201).json({
      message: "Bulk email sent successfully",
    });
  } catch (error) {
    console.error("Error sending bulk email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieve files uploaded for a specific classroom.
 * @param req Request object containing class code
 * @param res Response object
 * @returns Promise<void>
 */
export const fileData = async (req: Request, res: Response): Promise<void> => {
  try {
    const classCode = req.params.id;
    const files = await File.find({ classCode });

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error retrieving files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Upload a new file for a specific classroom.
 * @param req Request object containing file details
 * @param res Response object
 * @returns Promise<void>
 */
export const fileUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename, fileType, fileSize, fileUrl, uploaderId, classCode } = req.body;

    // Create a new file instance
    const newFile = new File({
      filename,
      fileType,
      fileSize,
      fileUrl,
      uploaderId,
      classCode,
    });

    // Save the new file to the database
    const savedFile = await newFile.save();

    res.status(200).json(savedFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Retrieve tasks assigned to a specific student.
 * @param req Request object containing student ID
 * @param res Response object
 * @returns Promise<void>
 */
export const assignedStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const UserId = req.params.id;
    const assignedTasks = await Task.find({ assignedTo: UserId });

    res.status(200).json({
      message: "Assigned tasks fetched",
      tasks: assignedTasks,
    });
  } catch (error) {
    console.error("Error fetching assigned tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
