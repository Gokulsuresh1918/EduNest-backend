import { Temporary } from "../../modal/temporary";
import { User } from "../../modal/users";
import { Task } from "../../modal/assignedTask";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Classroom } from "../../modal/classroom";

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
    console.log("userId:", userId);

    // Find the user by ID to get additional user details
    const userData = await User.findById(userId);

    // Create a new teacher object with the user's name and email
    const newTeacher = {
      name: userData.name,
      email: userData.email,
    };
    console.log("req uaser", newTeacher);

    // Create a new classroom instance with the provided data
    const newClassroom = new Classroom({
      title: req.body.title,
      description: req.body.description,
      students: [],
      teacher: [newTeacher],
      owner: userData._id,
      profilePicture: req.body.profilePicture,
      roomCode: req.body.code,
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
  try {
    const task = req.body
    // console.log('task',task);

    const user = await User.findOne({ email: task.studentEmail }).exec();

    // console.log('userdadta',user);
    
   const tasks = new Task({
    title: req.body.task, 
    dueDate: req.body.dueDate, 
    assignedTo: [user._id], 
  });

  const taskData = await Task.insertMany([tasks]);
    // console.log('userdadta',taskData);

    res.status(201).json({
      message: "Task successfully assigned.",
      task: task,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};
