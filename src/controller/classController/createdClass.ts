import { Temporary } from "../../modal/temporary";
import { User } from "../../modal/users";
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

export const deleteClass = async (req: Request, res: Response)  => {
  const classCode = req.params?.id;
  // console.log('class',classCode);
  
  try {
 
    const updatedClassroom = await Classroom.findOneAndUpdate(
      {roomCode: classCode },
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
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};