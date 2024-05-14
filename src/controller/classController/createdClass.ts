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
  // console.log("createClassroom", re/q.body);

  try {
    let user = req.user;
    let userId = user.userId;
    const userData = await User.findById(userId);
    console.log("ashwin", userData);

    const newTeacher = {
      name: userData.name,
      email: userData.email,
    };

    const newClassroom = new Classroom({
      title: req.body.title,
      description: req.body.description,
      students: [],
      teacher: [newTeacher],
      owner: userData.name,
      roomCode: req.body.code,
      userId: req.body.userId,
    });

    await newClassroom.save();
    console.log("classroom created successfully", newClassroom);

    res.status(200).json({
      message: "Classroom creation successful",
      classroom: newClassroom,
    });
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};


export const getClassData =async(req:Request,res:Response)=>{
  // const ClassData = await Classroom.findById(userId);

}