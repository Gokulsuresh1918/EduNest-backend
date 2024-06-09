import { Classroom } from "../modal/classroom";
import { User } from "../modal/users";
import { Request, Response } from 'express';

export const userData =async (req: any, res: any) => {
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
  
